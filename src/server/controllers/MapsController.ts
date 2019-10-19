import { ChatController } from "./ChatController";
import { MapInstance, MapSummary, MapDifficulty, MapEmptyEvent, MapType } from "../maps/MapInstance";
import { MapInstanceFactory } from "../maps/MapInstanceFactory";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";

export class MapsControllerType{    
    private _maps:Map<string, MapInstance>;

    /**
     * Constructs a Map Controller object
     */
    constructor(){
        this._maps = new Map();

        // test maps (remove later)
        for(let i:number = 0; i < 15; i++){
            this.createMap("Test", MapDifficulty.TRAINING, `Test Map ${i+1}`);
        }
    }

    /**
     * Handles map list requests
     * @param user  requesting user
     */
    public processMapList(user:User):void{
        UserUpdater.mapList(user, this.getMapList());   
    }

    /**
     * Handles map create requests
     * @param user      requesting user
     * @param param1    request body
     */
    public processMapCreate(user:User, {mapType=null, customName=null, password=null, difficulty=0}):void{
        // valiate request body
        if(!mapType || !customName || !difficulty){
            UserUpdater.requestBodyError(user, "map-create");
            return;
        }

        // must not be in a map
        if(user.map){
            UserUpdater.error(user, "map-create", "Can't create a map while in one.");
            return;
        }

        // create the map
        this.createMap(mapType, difficulty, customName, password, (err, map) => {
            if(err){
                // error creating map, send error
                UserUpdater.error(user, "map-create", err);
            }
            else{
                // map created, update user and join
                UserUpdater.mapCreated(user);
                this.processMapJoin(user, {mapId: map.id, password});
            }
        })
    }

    /**
     * Handles map join requests
     * @param user      requesting user
     * @param param1    request body
     */
    public processMapJoin(user:User, {mapId="", password=""}):void{
        // validate request body
        if(!mapId){
            UserUpdater.requestBodyError(user, "map-join");
            return;
        }

        // must have an active player
        if(!user.player){
            UserUpdater.error(user, "map-join", "You have no active player.");
            return;
        }

        // must be in a map
        if(user.map){
            UserUpdater.error(user, "map-join", "You are already in a map.");
            return;
        }

        // find the map
        const map:MapInstance = this._maps.get(mapId);
        if(!map){
            // map not found, send error
            UserUpdater.error(user, "map-join", "Map does not exist.");
            return;
        }

        // join the map
        map.addUser(user, password, (err, joinData) => {
            if(err){
                // unable to join map, send error
                UserUpdater.error(user, "map-join", err);
            }
            else{
                // map joined, send update
                user.map = map;
                UserUpdater.mapJoined(user, joinData);
            }
        });
    }

    /**
     * Handles map leave request
     * @param user  requesting user
     */
    public processMapLeave(user:User):void{
        // must be in a map
        if(!user.map){
            UserUpdater.error(user, "map-leave", "You are not in a map.");
            return;
        }

        // remove the user
        user.map.removeUser(user, err => {
            if(err){
                // error - send message
                UserUpdater.error(user, "map-leave", err);
            }
            else{
                // success, uppdate user
                user.map = null;
                UserUpdater.mapLeft(user);
            }
        });
    }

    /**
     * Handles chat request
     * @param user      requesting user
     * @param param1    request body
     */
    public processChat(user:User, {chat=""}):void{
        // must have chat text
        if(!chat)
            return;

        // must be in a map with an active player
        if(!user.map || !user.player){
            UserUpdater.error(user, "chat", "You are not in a map.");
            return;
        }

        // chat cannot exceed 128 characters
        // do this after chat command?
        if(chat.length > 128)
            chat = chat.substring(0, 128);

        // chat commands start with '/'
        if(chat.startsWith("/"))
            ChatController.processChatCommand(user, chat);

        // otherwise its normal chat text
        else
            user.map.chatAll(chat, user.player.name);
    }

    /**
     * Handles player updates (eg move, animate, etc requests)
     * @param user      requesting user
     * @param update    request body (the update)
     */
    public processPlayerUpdate(user:User, update:any):void{
        // must be in a map and have an active player
        if(!user.map || !user.player){
            UserUpdater.error(user, "player-update", "You are not in a map.");
            return;
        }

        // have the map validate and apply the update
        user.map.applySafeUserUpdate(user, update);
    }

    /**
     * Map empty listener, destroys map when its empty
     */
    private onMapEmpty = (evt:MapEmptyEvent):void => {
        this._maps.delete(evt.target.id);
        evt.target.destroy();
    }

    /**
     * Creates a map and places it into the map sytstem
     * @param type          map type (enumerated)
     * @param difficulty    map difficulty (enemy levels)
     * @param name          custom map name
     * @param pw            optional map password
     * @param cb            callback for helpful errors
     */
    public createMap(type:MapType, difficulty:number, name:string, pw?:string, cb?:(err?:string, map?:MapInstance)=>void):void{
        // create the map
        const map:MapInstance = MapInstanceFactory.create(type, difficulty, name, pw);
        if(map){
            // map created
            map.onEmpty = this.onMapEmpty;      // attach on empty listener
            map.ai.startAsyncLoop();            // begin map AI loop
            this._maps.set(map.id, map);        // store map
            if(cb) cb(null, map);               // success callback
        }
        else{
            // map not created
            if(cb) cb("Invalid map type.");
        }
    }

    /**
     * Gets an array of all the current map summaries
     * @returns map summaries array
     */
    public getMapList():MapSummary[]{
        let maps:MapSummary[] = new Array(this._maps.size);

        let i:number = 0;
        this._maps.forEach(map => maps[i++] = map.getSummary());

        return maps;
    }
}

/**
 * Maps Controller singleton
 */
export const MapsController = new MapsControllerType();