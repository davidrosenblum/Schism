import * as websocket from "websocket";
import { AccountSchema } from "../database/DBAccounts";
import { Player } from '../entities/Player';
import { MapInstance } from '../maps/MapInstance';
import { parseJson, stringifyJson } from "../utils/JsonUtils";
import { TokenGenerator } from "../utils/TokenGenerator";

// expected json payload types
export type UserPayloadType = (
    "login" | "logout" | "player-list" | "player-select" | "player-create" | "player-delete" | "player-update" |
    "map-list" | "map-create" | "map-join" | "map-leave" |"map-fx" | "ent-create" | "ent-delete" | "ent-update" | 
    "stats-update" | "chat" | "ability-cast" | "ability-ready"
);

// expected json message format
export type UserPayload = {type:UserPayloadType, data?:any};

// expected json packet delimiter
export const MSG_DELIM:string = "?&?";

export class User{
    private static readonly tokens:TokenGenerator = new TokenGenerator(8);

    private _id:string;
    private _connection:websocket.connection;

    public account:AccountSchema;
    public player:Player;
    public map:MapInstance;
    public onData:(payload:UserPayload)=>void;

    /**
     * Constructs a User object that wraps a websocket connection
     * @param connection websocket connection
     */
    constructor(connection:websocket.connection){
        this._id = User.tokens.nextToken();
        this._connection = connection;

        this.account = null;
        this.player = null;
        this.map = null;

        // listen for socket events
        this._connection.on("error", () => {});
        this._connection.on("close", this.onClose);
        this._connection.on("message", this.onMessage);
    }

    /**
     * On socket close listener
     */
    private onClose = () => {
        User.tokens.releaseToken(this.id);
    }

    /**
     * On socket message listener
     */
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

    /**
     * Sends any utf8 string down the socket
     * @param str   string to send
     */
    public sendString(str:string):void{
        try{
            this._connection.send(str);
        }
        catch(err){
            return;
        }
    }

    /**
     * Sends formatted and delimited json string down the socket
     * @param payload   formatted json payload
     */
    public sendJson(payload:UserPayload):void{
        stringifyJson(payload, (err, json) => {
            if(!err){
                this.sendString(json + MSG_DELIM);
            }
        });
    }

    /**
     * Converts data to expected json format and sends the delmited json down the socket
     * @param type  payload type
     * @param data  payload data
     */
    public sendData(type:UserPayloadType, data?:any):void{
        this.sendJson({type, data});
    }

    /**
     * Getter for the client guid
     * @returns client guid
     */
    public get id():string{
        return this._id;
    }

    /**
     * Getter for the username
     * @returns username
     */
    public get username():string{
        return this.account ? this.account.username : null;
    }

    /**
     * Getter for the access level
     * @returns access level
     */
    public get accessLevel():number{
        return this.account ? this.account.accessLevel : -1;
    }

    /**
     * Getter for the account id (if there is an account)
     * @returns account id
     */
    public get accountId():string{
        return this.account ? (this.account as any)._id.toHexString() : null;
    }
}