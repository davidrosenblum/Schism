import { User, UserPayloadType } from "./User";
import { CombatEntityData } from "../entities/CombatEntity";
import { PlayerState } from "../entities/Player";
import { UnitUpdate, UnitState } from '../entities/Unit';
import { PlayerListSchema } from "../database/DBPlayers";
import { MapSummary, MapJoinData } from '../maps/MapInstance';
import { GameEntityUpdate } from "../entities/GameEntity";



export class UserUpdater{
    public static loggedIn(user:User):void{
        const {id} = user;
        user.sendData("login", {id});
    }

    public static loggedOut(user:User):void{
        user.sendData("logout");
    }

    public static playerList(user:User, list:PlayerListSchema[]):void{
        user.sendData("player-list", {list});
    }

    public static playerCreated(user:User):void{
        user.sendData("player-create");
    }

    public static playerDeleted(user:User):void{
        user.sendData("player-delete");
    }

    public static playerSelected(user:User, state:PlayerState):void{
        user.sendData("player-select", state);
    }

    public static mapList(user:User, list:MapSummary[]):void{
        user.sendData("map-list", {list});
    }

    public static mapCreated(user:User):void{
        user.sendData("map-create");
    }

    public static mapJoined(user:User, joinData:MapJoinData):void{
        user.sendData("map-join", joinData);
    }

    public static mapLeft(user:User):void{
        user.sendData("map-leave");
    }

    public static entityCreated(user:User, state:UnitState):void{
        user.sendData("ent-create", state);
    }

    public static entityDeleted(user:User, id:string):void{
        user.sendData("ent-delete", {id});
    }

    public static entityUpdated(user:User, unitId:string, update:GameEntityUpdate):void{
        user.sendData("ent-update", {...update, id: unitId});
    }

    public static statsUpdated(user:User, unitId:string, stats:CombatEntityData):void{
        user.sendData("stats-update", {...stats, id: unitId});
    }

    public static chat(user:User, chat:string, from?:string):void{
        user.sendData("chat", {chat, from});
    }

    public static abilityCasted(user:User, abilityName:string):void{
        user.sendData("ability-cast", {abilityName});
    }

    public static error(user:User, type:UserPayloadType, message:string):void{
        user.sendData(type, {error: message});
    }

    public static requestBodyError(user:User, type:UserPayloadType):void{
        this.error(user, type, "Bad request body.");
    }

    public static notLoggedInError(user:User, type:UserPayloadType):void{
        this.error(user, type, "Not logged in.");
    }
}