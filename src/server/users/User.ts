import * as websocket from "websocket";
import { AccountSchema } from "../database/DBAccounts";
import { Player } from '../entities/Player';
import { MapInstance } from '../maps/MapInstance';
import { parseJson, stringifyJson } from "../utils/JsonUtils";
import { TokenGenerator } from "../utils/TokenGenerator";

export type UserPayloadType = (
    "login" | "logout" | "player-list" | "player-select" | "player-create" | "player-delete" | "player-update" |
    "map-list" | "map-create" | "map-join" | "map-leave" |"map-fx" | "ent-create" | "ent-delete" | "ent-update" | 
    "stats-update" | "chat" | "ability-cast" | "ability-ready"
);

export type UserPayload = {type:UserPayloadType, data?:any};

export const MSG_DELIM:string = "?&?";

export class User{
    private static readonly tokens:TokenGenerator = new TokenGenerator(8);

    private _id:string;
    private _connection:websocket.connection;

    public account:AccountSchema;
    public player:Player;
    public map:MapInstance;
    public onData:(payload:UserPayload)=>void;

    constructor(connection:websocket.connection){
        this._id = User.tokens.nextToken();
        this._connection = connection;

        this.account = null;
        this.player = null;
        this.map = null;

        this._connection.on("error", () => {});
        this._connection.on("close", this.onClose);
        this._connection.on("message", this.onMessage);
    }

    public static create(connection:websocket.connection):User{
        return new User(connection);
    }

    private onClose = () => {
        User.tokens.releaseToken(this.id);
    }

    private onMessage = (data:websocket.IMessage) => {
        if(!this.onData) return;

        data.utf8Data.split(MSG_DELIM).forEach(json => {
            parseJson(json, (err, {type, data}) => {
                if(!err){
                    this.onData({type, data});
                }
            });
        });
    };

    public sendString(str:string):void{
        try{
            this._connection.send(str);
        }
        catch(err){
            return;
        }
    }

    public sendJson(payload:UserPayload):void{
        stringifyJson(payload, (err, json) => {
            if(!err){
                this.sendString(json + MSG_DELIM);
            }
        });
    }

    public sendData(type:UserPayloadType, data?:any):void{
        this.sendJson({type, data});
    }

    public get id():string{
        return this._id;
    }

    public get username():string{
        return this.account ? this.account.username : null;
    }

    public get accessLevel():number{
        return this.account ? this.account.accessLevel : -1;
    }

    public get accountId():string{
        return this.account ? (this.account as any)._id.toHexString() : null;
    }
}