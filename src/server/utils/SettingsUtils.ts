import * as fs from "fs";
import * as path from "path";

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

    /**
     * Synchronously reads the settings file
     * @param cb    callback for error handling
     * @param opts  optional options
     */
    public static loadSync(cb:(err:Error, settings:SettingSchema)=>void, opts:{envArgs?:boolean}={}):void{
        let json:any;

        try{
            // attempt to read amd parse
            const fileText:string = fs.readFileSync(path.resolve(this.FILE_NAME)).toString();
            json = JSON.parse(fileText);
        }
        catch(err){
            // parse or read error
            this.settings = this.defaultSettings;
            cb(err, this.defaultSettings);
            return;
        }

        // validate the loaded settings
        this.settings = this.toValidSettings(json);
        
        // apply options
        if(opts.envArgs)
            this.settings = this.applyEnvArgs(this.settings);

        // trigger callback
        cb(null, this.settings);
    }
 
    /**
     * Synchronously writes the default settings file
     * @param cb    callback for error handling
     */
    public static writeDefaultsSync(cb:(err?:Error)=>void):void{
        try{
            const str:string = JSON.stringify(this.defaultSettings, null, 4);
            fs.writeFileSync(path.resolve(this.FILE_NAME), str);
        }
        catch(err){
            cb(err);
            return;
        }
        cb(null);
    }

    /**
     * Modifies an existing setting object by overriding values with expected environment variables
     * @param settings settings object to modify
     * @returns the modified settings input
     */
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

    /**
     * Modifies the json so it conforms to the valid settings schema (enforces types)
     * @param json  possibly bad settings json
     * @returns the modified json settings
     */
    public static toValidSettings(json:any):SettingSchema{
        return this.recursiveSettingsCheck(json, this.defaultSettings);
    }

    /**
     * Modifies an object within the settings object
     * @param jsonObject    possibly bad settings json object, or nested object
     * @param defaultObject default settings object reference 
     */
    private static recursiveSettingsCheck(jsonObject:any, defaultObject:SettingSchema):any{
        for(let param in defaultObject){
            if(typeof defaultObject[param] === "object"){
                // nested object
                this.recursiveSettingsCheck(jsonObject[param], defaultObject[param]);
            }
            else if(typeof jsonObject[param] !== typeof defaultObject[param]){
                // primitive type
                jsonObject[param] = defaultObject[param];
            }
        }
        return jsonObject;
    }

    /**
     * Getter for a copy of the default settings object
     * @returns default settings copy
     */
    public static get defaultSettings():SettingSchema{
        return {...this.defaults};
    }
}