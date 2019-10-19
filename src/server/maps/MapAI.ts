import { MapInstance, MapLocation } from "./MapInstance";
import { Ability } from "../abilities/Ability";
import { Facing } from "../entities/GameObject";
import { Object2D } from "../entities/Object2D";
import { NPC } from "../entities/NPC";
import { Unit } from "../entities/Unit";
import { Clock } from "../utils/Clock";

export class MapAI{
    private _map:MapInstance;
    private _looping:boolean;
    private _timeoutId:NodeJS.Timeout;
    private _clock:Clock;

    /**
     * Constructs a Map AI object
     * @param map   map to simulate 'intelligence' for
     */
    constructor(map:MapInstance){
        this._map =         map;            // the map 
        this._looping =     false;          // async loop active?
        this._timeoutId =   null;           // async loop id
        this._clock =       new Clock();    // delta clock
    }

    /**
     * Stars the async game loop
     * (stops any running one)
     * @param interval  delay between iterations (ms)
     */
    public startAsyncLoop():void{
        this.stopAsyncLoop();       // stop async loop (if in one)
        this._looping = true;       // looping true
        this.asyncLoop();           // start async loop
    }

    /**
     * Stops the async game loop
     */
    public stopAsyncLoop():void{
        // stop looping and clear async loop timeout
        this._looping = false;
        if(this._timeoutId){
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    /**
     * Performs a game loop iteration and, if valid, will asychronously 'recurse'
     * @param interval  delay between iterations (ms)
     */
    private asyncLoop():void{
        // step and async do next step
        const delta:bigint = this._clock.getDelta();

        // eventually use delta with this
        this.step();

        // schedule next step
        this._timeoutId = setTimeout(() => {
            if(this._looping)
                this.asyncLoop();
        }, 60); // replace this later with ticks
    }

    /**
     * Runs through the next step in the game loop
     */
    public step():void{
        // for each npc... make it do something
        const units:Unit[] = this._map.getAllUnits();
        units.forEach(unit => {
            if(unit instanceof NPC)
                this.stepUnit(unit, units);
        });
    }

    /**
     * Updates a unit in the game loop
     * @param npc   npc that is updating
     * @param units all possible unit targets 
     */
    private stepUnit(npc:NPC, units:Unit[]):void{
        // find target if no target or can't see target anymore
        if(!npc.target || (npc.target && (!npc.canSeeTarget || npc.target.isDead)))
            npc.target = this.findTarget(npc, units); 

        // if no target could be found, bail
        if(!npc.target){
            // idle because no longer in combat or moving torwards a target
            if(npc.anim !== "idle")
                npc.anim = "idle";
            return;
        }

        // move towards target if not in range
        if(!npc.inRange(npc.target, npc.prefRange))
            this.move(npc);

        // otherwise attack the target
        else
            this.combat(npc, units);
    }

    /**
     * Moves the npc closer to its target
     * (Should have a target when this method is invoked)
     * @param npc   npc moving towards target
     */
    private move(npc:NPC):void{
        let ox:number = npc.x;      // original x
        let oy:number = npc.y;      // original y
        let facing:Facing;          // new facing direction

        // the npc.setState({stuff}, false) suppresses the update event (triggered at the end)

        if(npc.isRightOf(npc.target)){
            // move left
            npc.setState({x: npc.x - npc.moveSpeed}, false);

            // undo move on collision
            if(this.checkCollision(npc))
                npc.setState({x: ox}, false);
            else
                facing = "left";
        }
        else if(npc.isLeftOf(npc.target)){
            // move right
            npc.setState({x: npc.x + npc.moveSpeed}, false);

            // undo move on collision
            if(this.checkCollision(npc)){
                npc.setState({x: ox}, false);
            }
            else
                facing = "right";
        }

        if(npc.isBelow(npc.target)){
            // move up
            npc.setState({y: npc.y - npc.moveSpeed}, false);

            // undo move on collision
            if(this.checkCollision(npc))
                npc.setState({y: oy}, false);
        }
        else if(npc.isAbove(npc.target)){
            // move down
            npc.setState({y: npc.y + npc.moveSpeed}, false);

            // undo move on collision
            if(this.checkCollision(npc))
                npc.setState({y: oy}, false);
        }

        if(npc.x !== ox || npc.y !== oy || npc.facing !== facing){
            // change state if movement occurred (implies possible animation/facing change)
            npc.setState({x: npc.x, y: npc.y, anim: "run", facing});
        }
        else{
            // didn't move, set anim to idle
            if(npc.anim === "run")
                npc.anim = "idle";
        }
    }

    /**
     * Checks for collision detection against all map objects
     * @param npc npc that might be colliding
     * @returns true/false for collision
     */
    private checkCollision(npc:NPC):boolean{
        // get row/col for npc
        const npcLocation:MapLocation = this._map.getUnitLocation(npc.id);
        // get collidables surrounding that point
        const collidables:Object2D[] = this._map.collision.getCollidablesNear(npcLocation);
        // create a cell-sized hitbox for the npc
        const npcHitbox:Object2D = this._map.collision.getCollisionBox(npc);

        // check for hitbox collision 
        for(let collidable of collidables){
            if(collidable && collidable.hitboxTest(npcHitbox)){
                return true;
            }
        }
        return false;
    }

    /**
     * Causes the NPC to pick a random ability and attack its target
     * (Should have a target when this method is invoked)
     * @param npc   attacking npc
     * @param units all possible targets 
     */
    private combat(npc:NPC, units:Unit[]):void{
        // pick random ability and attack target
        const ability:Ability = npc.getAnyAbility();
        if(ability)
            ability.cast(npc, npc.target, units);
    }

    /**
     * Finds the first valid target
     * @param npc   npc looking for target
     * @param units all possible targets
     * @returns frst valid target unit
     */
    private findTarget(npc:NPC, units:Unit[]):Unit{
        // find's first unit that is not the npc, enemy faction, and visible 
        return units.find(unit => {
            return unit !== npc && npc.faction !== unit.faction && npc.canSee(unit);
        });
    }

    /**
     * Destructor that stops async activity
     */
    public destroy():void{
        this._map = null;
        this.stopAsyncLoop();
    }
}