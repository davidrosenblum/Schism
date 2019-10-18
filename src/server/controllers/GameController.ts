import * as websocket from "websocket";
import { AbilitiesController } from "./AbilitiesController";
import { AccountsController } from "./AccountsController";
import { MapsController } from "./MapsController";
import { PlayersController } from "./PlayersController";
import { User, UserPayload } from '../users/User';
import { SettingUtils } from "../utils/SettingsUtils";

class GameControllerType{
    private _users:Map<string, User>;

    /**
     * Constructs a Game Controller
     */
    constructor(){
        this._users = new Map();
    }

    /**
     * Root handler for user requests
     * @param user      requesting user
     * @param payload   request header and body
     */
    private processData(user:User, payload:UserPayload):void{
        const {type, data} = payload;

        // print request
        if(type !== "player-update")
            console.log(payload)

        // handle request based on request type
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

    /**
     * Wraps a webosocket, if valid, in a user object and 'enrolls' it into the game state
     * @param req   websocket request
     */
    public enroll(req:websocket.request):void{
        // enforce capacity
        if(this.isFull){
            req.reject(500, "Server at capacity.");
            return;
        }

        // accept (or reject) the connection based on origin
        const conn:websocket.connection = req.accept(null, SettingUtils.settings.wsOrigin);
        // wrap the socket in a user object
        const user:User = new User(conn);

        // attach user data listener
        user.onData = payload => this.processData(user, payload);

        // attach socket closer listener
        conn.on("close", () => {
            this._users.delete(user.id);                    // remove user
            AccountsController.processLogout(user);         // logout so the account is unlocked (also leaves map)
            console.log(`User ${user.id} disconnected.`);   // print disconnected
        });

        // print connected
        console.log(`User ${user.id} connected.`);
    }

    /**
     * Getter for the number of connected websockets
     * @returns number of connected users
     */
    public get numUsers():number{
        return this._users.size;
    }

    /**
     * Getter for if the server is at capacity or not
     * @returns server at capacity or not
     */
    public get isFull():boolean{
        return this.numUsers >= SettingUtils.settings.popLimit;
    }
}

/**
 * Game Controller singleton (root controller)
 */
export const GameController = new GameControllerType();