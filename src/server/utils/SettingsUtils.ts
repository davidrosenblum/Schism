import * as fs from "fs";
import * as path from "path";
import { parseJson } from "./JsonUtils";

export interface SettingSchema{
    port:number;
    mongoUri:string;
    wsOrigin:string;
    popLimit:number;
    ssl: {
        pfxFile:string;
        pfxPassphrase:string;
        keyFile:string;
        crtFile:string;
    }
}

export class SettingUtils{
    private static readonly defaults:SettingSchema = {
        port: 8080,
        mongoUri: "mongodb://localhost:27017/schism",
        wsOrigin: "*",
        popLimit: 50,
        ssl: {
            pfxFile: "",
            pfxPassphrase: "",
            keyFile: "",
            crtFile: ""
        }
    };

    public static readonly FILE_NAME:string = "settings.json";

    public static settings:SettingSchema = null;

    public static loadSync(cb:(err:Error, settings:SettingSchema)=>void, opts:{envArgs?:boolean}={}):void{
        let json:any;

        try{
            const fileText:string = fs.readFileSync(path.resolve(this.FILE_NAME)).toString();
            json = JSON.parse(fileText);
        }
        catch(err){
            this.settings = this.defaultSettings;
            cb(err, this.defaultSettings);
            return;
        }

        this.settings = this.toValidSettings(json);
        
        if(opts.envArgs){
            this.settings = this.applyEnvArgs(this.settings);
        }

        cb(null, this.settings);
    }
 
    public static writeDefaultsSync(cb:(err?:Error)=>void):void{
        const str:string = JSON.stringify(this.defaultSettings, null, 4);
        try{
            fs.writeFileSync(path.resolve(this.FILE_NAME), str);
        }
        catch(err){
            cb(err);
            return;
        }
        cb(null);
    }

    public static applyEnvArgs(settings:SettingSchema):SettingSchema{
        return {
            port:       parseInt(process.env.PORT) || settings.port,
            mongoUri:   process.env.MONGO_URI || settings.mongoUri,
            popLimit:   parseInt(process.env.POP_LIMIT) || settings.popLimit,
            wsOrigin:   process.env.WS_ORIGIN || settings.wsOrigin,
            ssl: {
                crtFile: process.env.CRT || settings.ssl.crtFile,
                keyFile: process.env.KEY || settings.ssl.keyFile,
                pfxFile: process.env.PFX || settings.ssl.pfxFile,
                pfxPassphrase: process.env.PFX_PP || settings.ssl.pfxPassphrase
            }
        };
    }

    public static toValidSettings(json:any):SettingSchema{
        return this.recursiveSettingsCheck(json, this.defaultSettings);
    }

    private static recursiveSettingsCheck(jsonObject:any, defaultObject:any):any{
        for(let param in defaultObject){
            if(typeof defaultObject[param] === "object"){
                this.recursiveSettingsCheck(jsonObject[param], defaultObject[param]);
            }
            else if(typeof jsonObject[param] !== typeof defaultObject[param]){
                jsonObject[param] = defaultObject[param];
            }
        }
        return jsonObject;
    }

    public static get defaultSettings():SettingSchema{
        return {...this.defaults};
    }
}