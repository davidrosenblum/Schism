import * as websocket from "websocket";
import { User, UserPayload } from '../users/User';
import { AbilitiesController } from "./AbilitiesController";
import { AccountsController } from "./AccountsController";
import { MapsController } from "./MapsController";
import { PlayersController } from "./PlayersController";
import { SettingUtils } from "../utils/SettingsUtils";

class GameControllerType{
    private _users:Map<string, User>;

    constructor(){
        this._users = new Map();
    }

    private processData(user:User, payload:UserPayload):void{
        const {type, data} = payload;

        if(type !== "player-update")
            console.log(payload)

        switch(type){
            case "login":
                AccountsController.processLogin(user, data);
                break;

            case "logout":
                AccountsController.processLogout(user);
                break;

            case "player-list":
                PlayersController.processPlayerList(user);
                break;

            case "player-create":
                PlayersController.processPlayerCreate(user, data);
                break;

            case "player-delete":
                PlayersController.processPlayerDelete(user, data);
                break;

            case "player-select":
                PlayersController.processPlayerSelect(user, data);
                break;

            case "player-update":
                MapsController.processPlayerUpdate(user, data);
                break;

            case "map-list":
                MapsController.processMapList(user);
                break;

            case "map-create":
                MapsController.processMapCreate(user, data);
                break;

            case "map-join":
                MapsController.processMapJoin(user, data);
                break;

            case "map-leave":
                MapsController.processMapLeave(user);
                break;

            case "chat":
                MapsController.processChat(user, data);
                break;

            case "ability-cast":
                AbilitiesController.processAbilityCast(user, data);
                break;
        }
    }

    public enroll(req:websocket.request):void{
        if(this.isFull){
            req.reject(500, "Server at capacity.");
            return;
        }

        const conn:websocket.connection = req.accept(null, SettingUtils.settings.wsOrigin);
        const user:User = new User(conn);

        user.onData = payload => this.processData(user, payload);

        conn.on("close", () => {
            this._users.delete(user.id);
            AccountsController.processLogout(user);
            console.log(`User ${user.id} disconnected.`);
        });

        console.log(`User ${user.id} connected.`);
    }

    public get numUsers():number{
        return this._users.size;
    }

    public get isFull():boolean{
        return this.numUsers >= SettingUtils.settings.popLimit;
    }
}

export const GameController = new GameControllerType();