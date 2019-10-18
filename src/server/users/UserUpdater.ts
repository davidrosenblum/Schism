import { User, UserPayloadType } from "./User";
import { PlayerListSchema } from "../database/DBPlayers";
import { CombatObjectUpdate } from "../entities/CombatObject";
import { GameObjectUpdate } from "../entities/GameObject";
import { PlayerState } from "../entities/Player";
import { UnitState } from "../entities/Unit";
import { MapSummary, MapJoinData } from "../maps/MapInstance";

export class UserUpdater{
    /**
     * Sends the expected successful login response
     * @param user  user object
     */
    public static loggedIn(user:User):void{
        const {id} = user;
        user.sendData("login", {id});
    }

    /**
     * Sends the epxected successful logout response
     * @param user  user object
     */
    public static loggedOut(user:User):void{
        user.sendData("logout");
    }

    /**
     * Sends the exepcted successful player list response
     * @param user  user object
     * @param list  player list
     */
    public static playerList(user:User, list:PlayerListSchema[]):void{
        user.sendData("player-list", {list});
    }

    /**
     * Sends the expected successful player create response
     * @param user  user object
     */
    public static playerCreated(user:User):void{
        user.sendData("player-create");
    }

    /**
     * Sends the expected successful player delete response
     * @param user  user object
     */
    public static playerDeleted(user:User):void{
        user.sendData("player-delete");
    }

    /**
     * Sends the expected successful player select response
     * @param user  user object
     * @param state selected player state
     */
    public static playerSelected(user:User, state:PlayerState):void{
        user.sendData("player-select", state);
    }

    /**
     * Sends teh expected successful map list response
     * @param user  user object
     * @param list  map list
     */
    public static mapList(user:User, list:MapSummary[]):void{
        user.sendData("map-list", {list});
    }

    /**
     * Sends the expected successful map create response
     * @param user  user object
     */
    public static mapCreated(user:User):void{
        user.sendData("map-create");
    }

    /**
     * Sends the expected successful map join response
     * @param user      user object
     * @param joinData  map state data
     */
    public static mapJoined(user:User, joinData:MapJoinData):void{
        user.sendData("map-join", joinData);
    }

    /**
     * Sends the expected successful map leave response
     * @param user  user object
     */
    public static mapLeft(user:User):void{
        user.sendData("map-leave");
    }

    /**
     * Sends the expected map entity created update
     * @param user  user object
     * @param state entity state
     */
    public static entityCreated(user:User, state:UnitState):void{
        user.sendData("ent-create", state);
    }

    /**
     * Sends the expected map entity deleted updated
     * @param user  user object
     * @param id    entity id
     */
    public static entityDeleted(user:User, id:string):void{
        user.sendData("ent-delete", {id});
    }

    /**
     * Sends the expected map entity updated update
     * @param user      user object
     * @param id        entity id
     * @param update    entity update data 
     */
    public static entityUpdated(user:User, id:string, update:GameObjectUpdate):void{
        user.sendData("ent-update", {...update, id});
    }

    /**
     * Sends the expected map entity stats update
     * @param user      user object
     * @param id        entity id
     * @param stats     entity stats data
     */
    public static statsUpdated(user:User, id:string, stats:CombatObjectUpdate):void{
        user.sendData("stats-update", {...stats, id});
    }

    /**
     * Sends the expected map chat update
     * @param user  user object
     * @param chat  chat message 
     * @param from  user's display name
     */
    public static chat(user:User, chat:string, from?:string):void{
        user.sendData("chat", {chat, from});
    }

    /**
     * Sends the expected successful ability cast response
     * @param user          user object
     * @param abilityName   ability that was casted 
     */
    public static abilityCasted(user:User, abilityName:string):void{
        user.sendData("ability-cast", {abilityName});
    }

    /**
     * Sends the expected error response
     * @param user      user object 
     * @param type      request type
     * @param message   error message
     */
    public static error(user:User, type:UserPayloadType, message:string):void{
        user.sendData(type, {error: message});
    }

    /**
     * Sends the standard bad request error
     * @param user  user object 
     * @param type  request type
     */
    public static requestBodyError(user:User, type:UserPayloadType):void{
        this.error(user, type, "Bad request body.");
    }

    /**
     * Sends the standard not logged in error
     * @param user  user object
     * @param type  request type
     */
    public static notLoggedInError(user:User, type:UserPayloadType):void{
        this.error(user, type, "Not logged in.");
    }
}