import { MapsController } from "./MapsController";
import { NPCFactory, NpcType } from "../entities/NPCFactory";
import { MapFxFactory } from "../maps/MapFxFactory";
import { MapFxType } from "../maps/MapFxData";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";
import { Anim } from "../entities/GameObject";
import { NPC } from "../entities/NPC";


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

            case "/spawn":
                this.processSpawn(user, args);
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
                
            case "/god":
                this.processGodMode(user);
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
                // second argument (args[1]) is mapId, third argument (args[3]) is password (optional)
                MapsController.processMapJoin(user, {mapId: args[2], password: args[3]});
                break;

            case "anim":
                // second argument (args[1] is animation)
                user.player.anim = args[2] as Anim
                break;

            default:
                UserUpdater.chat(user, `Invalid set arg "${args[1]}".`);
                break;
        }
    }

    private processSpawn(user:User, args:string[]):void{
        // enforce access level privilege
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }

        // second argument (args[1]) is property
        switch(args[1]){
            case "npc":
                // third argument (args[2]) is npc type
                // fourth argument (args[3]) is npc level (optional)
                // fifth argument (arg[s4]) is npc name (optional)
                this.spawnNpc(user, args[2], args[3], args[4]);
                break;

            case "fx":
                // third argument (args[2]) is fx type
                this.spawnFx(user, args[2]);
                break;

            default:
                UserUpdater.chat(user, `Invalid spawn arg "${args[1]}".`);
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

    /**
     * Handles "god" requests (god mode)
     * @param user  requesting user
     */
    private processGodMode(user:User):void{
        // enforce access level privilege
        if(user.accessLevel < 3){
            UserUpdater.chat(user, "Privilege error.");
            return;
        }

        // toggle invulnerability
        user.player.invulnerable = !user.player.invulnerable;
        UserUpdater.chat(user, `God mode ${user.player.invulnerable ? "enabled" : "disabled"}`);
    }

    /**
     * Helper method for spawning NPCs.
     * @param user      The requesting user.
     * @param typeArg   The requested NPC type.
     * @param levelArg  Optional NPC level.
     * @param nameArg   Optional NPC custom name.
     */
    private spawnNpc(user:User, typeArg:string, levelArg:string, nameArg:string):void{
        // create npc from text input
        const level:number = parseInt(levelArg) || 1;
        const npc:NPC = NPCFactory.create(typeArg as NpcType, {level, name: nameArg});
        
        // warn user of spawn error
        if(!npc){
            UserUpdater.chat(user, `Invalid NPC "${typeArg}".`);
            return;
        }

        // add npc 
        user.map.addUnit(npc, user.map.getUnitLocation(user.player.id));
    }

    /**
     * Helper method for spawning map effects.
     * @param user      The requesting user.
     * @param typeArg   The requested map effect type.
     */
    private spawnFx(user:User, typeArg:string):void{
        // create map effect from text input
        const fx = MapFxFactory.create(typeArg as MapFxType, user.player.id);

        // warn user of spawn error
        if(!fx){
            UserUpdater.chat(user, `Invalid effect "${typeArg}".`);
            return;
        }

        // create effect
        user.map.createEffect(fx);
    }
}

/**
 * Chat Controller singleton
 */
export const ChatController = new ChatControllerType();