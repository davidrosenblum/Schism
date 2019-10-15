import * as cors from "cors";
import * as express from "express";
import * as fs from "fs";
import * as https from "https";
import { MongoClient } from "mongodb";
import * as path from "path";
import * as websocket from "websocket";
import { GameController } from "./controllers/GameController";
import { GameDatabase } from "./database/GameDatabase";
import { AccountCreate } from "./handlers/AccountCreate";
import { MapList } from "./handlers/MapList";
import { PlayerList } from "./handlers/PlayerList";
import { SettingUtils } from "./utils/SettingsUtils";

export class Server{
    private _app:express.Application;
    private _httpsServer:https.Server;
    private _wsServer:websocket.server;

    constructor(){
        this._app = express();
        this._httpsServer = null;
        this._wsServer = null;

        this.createRoutes();
        this.init();
    }

    private onWebSocket = (req:websocket.request) => {
        GameController.enroll(req);
    }

    private createRoutes():void{
        this._app.use(express.json());
        this._app.use(cors());
        this._app.use(express.static(path.resolve("public/static")));

        this._app.get("/", (req, res) => res.sendFile(path.resolve("public/index.html")));
        this._app.get("/favicon.png", (req, res) => res.sendFile(path.resolve("public/favicon.png")));
        this._app.post("/accounts/create", AccountCreate.post);
        this._app.get("/players/list/:accountId", PlayerList.get);
        this._app.get("/maps/list", MapList.get);
    }

    private createServers(options?:https.ServerOptions):void{
        this._httpsServer = https.createServer(options, this._app);
        this._wsServer = new websocket.server({httpServer: this._httpsServer});

        this._wsServer.on("request", this.onWebSocket);
    }

    private initSettings():void{
        console.log("Loading settings file...");
        SettingUtils.loadSync(err => {
            if(err){
                if(err.name === "SyntaxError"){
                    console.log("Error parsing settings file (invalid json).");
                }
                else{
                    console.log("Writing default settings file.");
                    SettingUtils.writeDefaultsSync(() => {});
                }
                console.log("Using default settings.\n");
            }
            else{
                console.log("Settings loaded.\n");
            }
        }, {envArgs: true});
    }

    private initCerts():void{
        const {
            pfxFile, pfxPassphrase, keyFile, crtFile
        } = SettingUtils.settings.ssl;

        if((!pfxFile || !pfxPassphrase) && (!crtFile || !keyFile)){
            console.log("SSL certificate error.\n");
            console.log("Please provide a PFX file with passphrase or KEY/CRT files for HTTPS certificate.\n");
            console.log("PFX=file PFX_PP=phrase or KEY=file CRT=file command line arguments.\n");
            console.log("Or, just use the settings file's SSL configuration.\n");
            console.log("Remember, you just need KEY and CRT -OR- PFX with PFX passphrase!\n")
            // console.log({pfxFile, pfxPassphrase, keyFile, crtFile})
            process.exit();
        }

        console.log("Loading certificate file(s)...");
        if(pfxFile){
            console.log("Using PFX file with passphrase for HTTPS certificate.");
            this.createServers({
                pfx: fs.readFileSync(path.resolve(pfxFile)),
                passphrase: pfxPassphrase
            });
        }
        else if(crtFile && keyFile){
            console.log("Using KEY/CRT files for HTTPS certificate.\n");
            this.createServers({
                key:  fs.readFileSync(path.resolve(keyFile)),
                cert: fs.readFileSync(path.resolve(crtFile))
            });
        }
        console.log("Certificate file(s) loaded.\n");
    }

    private init():void{
        console.log("Schism Server\n");

        // load settings file (write defaults if neccessary)
        this.initSettings();

        // load https certificate certs 
        this.initCerts();

        const {port, mongoUri} = SettingUtils.settings;

        console.log("Connecting to MongoDB...");
        MongoClient.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
            if(err){
                console.log(err.message);
                process.exit();
                return;
            }
        

            console.log("Database connected.\n");
            GameDatabase.instance = new GameDatabase(client);

            console.log("Checking database collections...");
            GameDatabase.instance.createCollections()
                .then(() => {
                    console.log("Database collections ok.\n");
                    this._httpsServer.listen(port, () => {
                        console.log(`Server listening on port ${port}.\n`);
                    });
                })
                .catch(err => {
                    console.log(err);
                    process.exit();
                });
        });
    }
}

if(require.main === module){
    new Server();
}