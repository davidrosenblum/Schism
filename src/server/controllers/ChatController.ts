import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";
import { MapsController } from "./MapsController";

class ChatControllerType{
    public processChatCommand(user:User, chat:string):void{
        const args:string[] = chat.split(" ");

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

    private processAdd(user:User, args:string[]):void{
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }
        
        const value:number = parseInt(args[2]) || 0;
        
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

    private processSet(user:User, args:string[]):void{
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
        }

        switch(args[1]){
            case "map":
                MapsController.processMapJoin(user, {mapId: args[2], password: args[3]});
                break;

            default:
                UserUpdater.chat(user, `Invalid set arg "${args[1]}".`);
                break;
        }
    }

    private processInfo(user:User):void{
        UserUpdater.chat(user, 
            `ID  = ${user.player.name} (${user.player.id})\n` +
            `MAP = ${user.map.type} (${user.map.id})\n` +
            `XY  = ${user.player.x}, ${user.player.y}`
        );
    }

    private processLevelXP(user:User, args:string[]):void{
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            
        }
        else{
            const level:number = parseInt(args[1]) || (user.player.level + 1);
            while(user.player.level < level){
                user.player.addXP(user.player.xpToGo);
            }
        }
    }

    private processRun(user:User):void{
        if(user.accessLevel < 2){
            UserUpdater.chat(user, "Privilege error.");
        }
        else{
            user.player.toggleRun();
        }
    }

    private processKillMe(user:User):void{
        if(user.accessLevel < 2){
            UserUpdater.chat(user, "Privilege error.");
        }
        else{
            user.player.kill();
        }
    }
}

export const ChatController = new ChatControllerType();