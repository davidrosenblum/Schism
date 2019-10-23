import { AssetsManager } from "./AssetsManager";
import { GameManager } from "./GameManager";
import { store } from "..";
import { showLogin } from "../actions/MenuActions";
import { processServerData } from "../controllers/RootController";
import { setLoginPending } from "../actions/AccountActions";
import { showAlertModal } from "../actions/AlertModalActions";

export const MSG_DELIM:string = "?&?";
export const VERSION:string = "0.1.0";

class GameSocketType{
    private _socket:WebSocket;

    constructor(){
        this._socket = null;
    }

    public connect(cb?:(err?:string)=>void):void{
        if(this._socket){
            if(cb) cb("Already connected.");
            return;
        }

        this._socket = new WebSocket(this.getSocketUrl());

        this._socket.onopen = () => {
            if(cb) cb();
        };

        this._socket.onclose = () => {
            this._socket = null;
            store.dispatch(showLogin());
            store.dispatch(setLoginPending(false));
            store.dispatch(showAlertModal({header: "Socket Error", body: "Connection error."}));

            if(GameManager.inGame){
                AssetsManager.purgeAssetCache();
                GameManager.unloadMap();
            }
        };

        this._socket.onmessage = this.onSocketData;
    }

    private onSocketData = (evt:MessageEvent):void => {
        evt.data.split(MSG_DELIM).forEach(json => {
            let payload:any;

            try{
                payload = JSON.parse(json);
            }
            catch(err){
                return;
            }

            processServerData(payload);
        });
    }

    public sendData(type:string, data:any=null):void{
        if(this.isConnected){
            try{
                this._socket.send(JSON.stringify({type, data}));
            }
            catch(err){
                return;
            }
        }
    }

    public login(username:string, password:string):void{
        this.sendData("login", {username, password, version: VERSION});
    }

    public logout():void{
        this.sendData("logout");
    }

    public getPlayerList():void{
        this.sendData("player-list");
    }

    public createPlayer(name:string, archetype:number):void{
        this.sendData("player-create", {name, archetype});
    }
    
    public deletePlayer(name:string):void{
        this.sendData("player-delete", {name});
    }

    public selectPlayer(name:string):void{
        this.sendData("player-select", {name});
    }

    public getMapList():void{
        this.sendData("map-list");
    }

    public createMap(mapType:number, difficulty:number, customName:string, password?:string):void{
        this.sendData("map-create", {mapType, difficulty, customName, password});
    }

    public joinMap(mapId:string, password?:string):void{
        this.sendData("map-join", {mapId, password});
    }

    public leaveMap():void{
        this.sendData("map-leave");
    }

    public playerUpdate(data:any):void{
        this.sendData("player-update", data);
    }

    public chat(chat:string):void{
        this.sendData("chat", {chat});
    }

    public castAbility(abilityName:string, targetId:string):void{
        this.sendData("ability-cast", {abilityName, targetId});
    }

    private getSocketUrl():string{
        const port:number = parseInt(new URLSearchParams(window.location.search).get("port")) || parseInt(window.location.port);
        return `wss://${window.location.hostname}:${port}`;
    }

    public get isConnected():boolean{
        return this._socket && this._socket.readyState === 1;
    }
}

export const GameSocket = new GameSocketType();