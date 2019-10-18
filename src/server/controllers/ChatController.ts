import { MapsController } from "./MapsController";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";

class ChatControllerType{
    /**
     * Handles chat commands
     * @param user  requesting user
     * @param chat  chat command
     */
    public processChatCommand(user:User, chat:string):void{
        // chat commands are delimited by spaces
        const args:string[] = chat.split(" ");

        // the root command is the first argument (args[0])
        switch(args[0]){
            case "/add":
                this.processAdd(user, args);
                break;

            case "/set":
                this.processSet(user, args);
                break;

            case "/info":
                this.processInfo(user);
                break;

            case "/levelxp":
                this.processLevelXP(user, args);
                break;

            case "/run":
                this.processRun(user);
                break;

            case "/killme":
                this.processKillMe(user);
                break;

            default:
                UserUpdater.chat(user, `Invalid command ${args[0]}.`);
                break;
        }
    }

    /**
     * Handles "add" commands
     * @param user  requesting user
     * @param args  chat arguments
     */
    private processAdd(user:User, args:string[]):void{
        // enforce access level privilege
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }
        
        // third argument (args[2]) is quantity, parse to integer
        const value:number = parseInt(args[2]) || 0;
        
        // second argument is property - add quantity to property
        switch(args[1]){
            case "xp":
                user.player.addXP(value)
                break;

            case "health":
                user.player.health.modify(value);
                break;

            case "mana":
                user.player.mana.modify(value);
                break;

            case "resistance":
                user.player.resistance.modify(value);
                break;

            case "defense":
                user.player.defense.modify(value);
                break;

            default:
                UserUpdater.chat(user, `Invalid add arg "${args[1]}".`);
                break;
        }
    }

    /**
     * Handles "set" commmands
     * @param user  requesting user
     * @param args  chat arguments
     */
    private processSet(user:User, args:string[]):void{
        // enforce access level privilege
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }

        // second argument (args[1]) is property
        // third...n arguments are values depending on request (all strings)
        switch(args[1]){
            case "map":
                MapsController.processMapJoin(user, {mapId: args[2], password: args[3]});
                break;

            default:
                UserUpdater.chat(user, `Invalid set arg "${args[1]}".`);
                break;
        }
    }

    /**
     * Handles "info" requests
     * @param user  requesting user
     */
    private processInfo(user:User):void{
        UserUpdater.chat(user, 
            `ID  = ${user.player.name} (${user.player.id})\n` +
            `MAP = ${user.map.type} (${user.map.id})\n` +
            `XY  = ${user.player.x}, ${user.player.y}`
        );
    }

    /**
     * Handles "levelxp" requests
     * @param user  requesting user 
     * @param args  chat arguments
     */
    private processLevelXP(user:User, args:string[]):void{
        // enforce access level privilege
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }
        
        // second argument (args[1]) is level to reach
        // level up
        const level:number = parseInt(args[1]) || (user.player.level + 1);
        while(user.player.level < level)
            user.player.addXP(user.player.xpToGo);
    }

    /**
     * Handles "run" requests
     * @param user  requesting user 
     */
    private processRun(user:User):void{
        // enforce access level privilege
        if(user.accessLevel < 2){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }
        
        // togle user's player fast/normal move speed
        user.player.toggleRun();
    }

    /**
     * Handles "killme" requests
     * @param user  requesting user
     */
    private processKillMe(user:User):void{
        // enforce access level privilege
        if(user.accessLevel < 2){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }
        
        // kill the user's player
        user.player.kill();
    }
}

/**
 * Chat Controller singleton
 */
export const ChatController = new ChatControllerType();