import { MapInstance } from "./MapInstance";
import { NPC } from "../entities/NPC";
import { Unit } from "../entities/Unit";

export class MapInstanceAI{
    private _map:MapInstance;
    
    constructor(){

    }

    public step():void{
        const units:Unit[] = this._map.getAllUnits();
        const npcs:NPC[] = units.filter(unit => unit instanceof NPC) as NPC[];

        npcs.forEach(npc => {
            // wake up or put to sleep
            this.sleepOrWake(npc, units);

            // skip sleeping npcs
            if(npc.sleeping)
                return;

            // find target if none or other can't bee seen
            if(!npc.target || !npc.canSeeTarget)
                this.findFirstTarget(npc, units);
            
            // skip targetless npcs
            if(!npc.target)
                return;

            // move awake npcs to their targets
            this.movement(npc);
        });
    }

    private sleepOrWake(npc:NPC, units:Unit[]):void{
        for(let unit of units){
            if(this.isValidTarget(npc, unit))
                npc.sleeping = false;
            else
                npc.sleeping = true;
        }
    }

    private movement(npc:NPC):void{
        if(npc.isAbove(npc.target)){
            npc.y -= npc.moveSpeed;
        }
        else if(npc.isBelow(npc.target)){
            npc.y += npc.moveSpeed;
        }

        if(npc.isRightOf(npc.target)){
            if(npc.facing !== "left")
                npc.facing = "left";
            npc.x -= npc.moveSpeed;
        }
        else if(npc.isLeftOf(npc.target)){
            if(npc.facing !== "right")
                npc.facing = "right";
            npc.x += npc.moveSpeed;

        }
    }

    private combat():void{
        
    }

    private findFirstTarget(npc:NPC, units:Unit[]):void{
        for(let unit of units){
            if(this.isValidTarget(npc, unit)){
                npc.target = unit;
                break;
            }
        }
    }

    private isValidTarget(npc:NPC, target:Unit):boolean{
        return npc !== target && npc.faction !== target.faction && npc.canSee(target);
    }
}