import { ChatController } from "./ChatController";
import { MapInstance, MapSummary, MapDifficulty, MapEmptyEvent } from "../maps/MapInstance";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";
import { MapInstanceFactory } from "../maps/MapInstanceFactory";

export class MapsControllerType{    
    private _maps:Map<string, MapInstance>;

    constructor(){
        this._maps = new Map();

        this.createMap("Test", MapDifficulty.TRAINING, "Alpha");
        this.createMap("Test", MapDifficulty.STANDARD, "Beta");
        this.createMap("Test", MapDifficulty.ELITE, "Gamma");
        this.createMap("Test", MapDifficulty.SUICIDAL, "Epsilon", "111");

        for(let i:number = 0; i < 15; i++){
            this.createMap("Test", MapDifficulty.TRAINING, `Test Map ${i+1}`);
        }
    }

    public processMapList(user:User):void{
        UserUpdater.mapList(user, this.getMapList());   
    }

    public processMapCreate(user:User, {mapType=null, customName=null, password=null, difficulty=0}):void{
        if(!mapType || !customName || !difficulty){
            UserUpdater.requestBodyError(user, "map-create");
            return;
        }

        if(user.map){
            UserUpdater.error(user, "map-create", "Can't create a map while in one.");
            return;
        }

        this.createMap(mapType, difficulty, customName, password, (err, map) => {
            if(err){
                UserUpdater.error(user, "map-create", err);
            }
            else{
                UserUpdater.mapCreated(user);
                this.processMapJoin(user, {mapId: map.id, password});
            }
        })
    }

    public processMapJoin(user:User, {mapId="", password=""}):void{
        if(!mapId){
            UserUpdater.requestBodyError(user, "map-join");
            return;
        }

        if(!user.player){
            UserUpdater.error(user, "map-join", "You have no active player.");
            return;
        }

        if(user.map){
            UserUpdater.error(user, "map-join", "You are already in a map.");
            return;
        }

        const map:MapInstance = this._maps.get(mapId);
        if(!map){
            UserUpdater.error(user, "map-join", "Map does not exist.");
            return;
        }

        map.addUser(user, password, (err, joinData) => {
            if(err){
                UserUpdater.error(user, "map-join", err);
            }
            else{
                user.map = map;
                UserUpdater.mapJoined(user, joinData);
            }
        });
    }

    public processMapLeave(user:User):void{
        if(!user.map){
            UserUpdater.error(user, "map-leave", "You are not in a map.");
            return;
        }

        user.map.removeUser(user, err => {
            if(err){
                UserUpdater.error(user, "map-leave", err);
            }
            else{
                user.map = null;
                UserUpdater.mapLeft(user);
            }
        });
    }

    public processChat(user:User, {chat=""}):void{
        if(!chat){
            return;
        }

        if(!user.map){
            UserUpdater.error(user, "chat", "You are not in a map.");
            return;
        }

        // do this after chat command?
        if(chat.length > 128){
            chat = chat.substring(0, 128);
        }

        if(chat.startsWith("/")){
            ChatController.processChatCommand(user, chat);
        }
        else{
            user.map.chatAll(chat, user.player.name);
        }
    }

    public processPlayerUpdate(user:User, update:any):void{
        if(!user.map || !user.player){
            UserUpdater.error(user, "player-update", "You are not in a map.");
            return;
        }

        user.map.applySafeUserUpdate(user, update);
    }

    private onMapEmpty = (evt:MapEmptyEvent):void => {
        this._maps.delete(evt.target.id);
        evt.target.destroy();
    }

    public createMap(type:string, difficulty:number, name:string, pw?:string, cb?:(err?:string, map?:MapInstance)=>void):void{
        const map:MapInstance = MapInstanceFactory.create(type, difficulty, name, pw);
        if(map){
            map.onEmpty = this.onMapEmpty;
            this._maps.set(map.id, map);
            if(cb) cb(null, map);
        }
        else{
            if(cb) cb("Invalid map type.");
        }
    }

    public getMapList():MapSummary[]{
        let maps:MapSummary[] = new Array(this._maps.size);

        let i:number = 0;
        this._maps.forEach(map => maps[i++] = map.getSummary());

        return maps;
    }
}

export const MapsController = new MapsControllerType();