import { processAbilityCast, processAbilityReady } from "./AbilityController";
import { processLogin, processLogout } from "./AccountController";
import { processChat, processStatsUpdate } from "./InGameController";
import { processPlayerList, processPlayerCreate, processPlayerDelete, processPlayerSelect } from "./PlayerListController";
import { processMapList, processMapCreate, processMapJoin, processMapLeave } from "./MapListController";
import { GameManager } from "../game/GameManager";

export const processServerData = (payload:any):void => {
    const {type, data={}} = payload;

    if(type !== "ent-update" && type !== "stats-update")
        console.log(payload);

    switch(type){
        case "login":
            processLogin(data);
            break;

        case "logout":
            processLogout(data);
            break;

        case "player-list":
            processPlayerList(data);
            break;

        case "player-create":
            processPlayerCreate(data);
            break;

        case "player-delete":
            processPlayerDelete(data);
            break;

        case "player-select":
            processPlayerSelect(data);
            break;

        case "map-list":
            processMapList(data);
            break;

        case "map-create":
            processMapCreate(data);
            break;

        case "map-join":
            processMapJoin(data);
            break;

        case "map-leave":
            processMapLeave(data);
            break;

        case "map-fx":
            GameManager.createFx(data);
            break;

        case "object-create":
            GameManager.createObject(data);
            break;

        case "object-delete":
            GameManager.deleteObject(data.id);
            break;

        case "ent-create":
            GameManager.createEntity(data);
            break;

        case "ent-delete":
            GameManager.deleteEntity(data.id);
            break;

        case "ent-update":
            GameManager.updateEntity(data);
            break;

        case "stats-update":
            processStatsUpdate(data);
            break;

        case "chat":
            processChat(data);
            break;

        case "ability-cast":
            processAbilityCast(data);
            break;

        case "ability-ready":
            processAbilityReady(data);
            break;

        default:
            console.log(`Uknown type "${type}".`);
            break;
    }
};