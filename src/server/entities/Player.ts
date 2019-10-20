import { Unit, UnitState, UnitStats } from "./Unit";
import { PlayerSchema, PlayerUpdateSchema } from "../database/DBPlayers";

/**
 * Enumerated player archetype ids
 */
export enum PlayerArchetype{
    KNIGHT = 1, RANGER = 2, ALCHEMIST = 3
}

/**
 * Player state representation
 */
export interface PlayerState extends UnitState{
    archetype:PlayerArchetype;
    level:number;
    xp:number;
    xpRequired:number;
    merits:number;
}

/**
 * Player stats representation
 */
export interface PlayerStats extends UnitStats{
    level:number;
    xp:number;
    xpRequired:number;
    merits:number;
}

/**
 * Update data specific to the Player class
 */
export type PlayerData = PlayerUpdateSchema;

/**
 * Player update event
 */
export interface PlayerEvent{
    target:Player;
    data:PlayerUpdateSchema;
    message?:string;
}

// archetype default stats and increments ('bonus')
type ATStatsData = {hp:number, hpBonus:number, mp:number, mpBonus:number, res:number, def:number, w:number, h:number};
const ArchetypeStats:{[atId:number]: ATStatsData} = {
    1: {hp: 100, hpBonus: 3, mp: 100, mpBonus: 1, res: 0.20, def: 0.05, w: 55, h: 100},
    2: {hp: 80,  hpBonus: 2, mp: 100, mpBonus: 1, res: 0.10, def: 0.10, w: 41, h: 100},
    3: {hp: 65,  hpBonus: 1, mp: 100, mpBonus: 2, res: 0.00, def: 0.05, w: 43, h: 100}
};

export class Player extends Unit{
    public static readonly LEVEL_CAP:number = 30;
    public static readonly MERITS_CAP:number = 9999;
    public static readonly MOVE_SPEED:number = 1;
    public static readonly RUN_SPEED:number = 3;

    private _archetype:PlayerArchetype;
    private _level:number;
    private _xp:number;
    private _merits:number;

    public onPlayerUpdate:(evt:PlayerEvent)=>void;

    /**
     * Constructs a player
     * @param saveData  player data from database
     * @param ownerId   player's owner id (client id)
     */
    constructor(saveData:PlayerSchema, ownerId:string){
        const {
            w, h, hp, mp, res, def, hpBonus, mpBonus
        } = ArchetypeStats[saveData.archetype];
        
        const levels:number = saveData.level - 1;

        super({
            ownerId,
            name:           saveData.name,
            type:           "player",
            faction:        "Players",
            width:          w,
            height:         h,
            moveSpeed:      Player.MOVE_SPEED,
            health:         hp + (hpBonus * levels),
            mana:           mp + (mpBonus * levels),
            resistance:     res,
            defense:        def
        });

        // restore attributes from saveData (database)
        this._archetype =   saveData.archetype;
        this._level =       saveData.level;
        this._xp =          0;              // set later
        this._merits =      0;              // set later

        this.onPlayerUpdate = null;         // no default update listener
        this.addMerits(saveData.merits);    // add merits (this respects capacity)
        this.addXP(saveData.xp);            // add xp (levels up if xp was added outside game)
    }

    /**
     * Increments the player's level, boosts stats, refills hp/mp, and triggers player update
     */
    private levelUp():void{
        if(!this.isLevelCap){
            // increment level and reset xp
            this._level++;
            this._xp = 0;

            // boost health/mana capacity and refill health/mana
            this.health.modifyCapacity(ArchetypeStats[this.archetype].hpBonus);
            this.mana.modifyCapacity(ArchetypeStats[this.archetype].mpBonus);
            this.refill();

            // trigger player update
            this.triggerPlayerUpdate(
                {level: this.level},
                `You reached level ${this.level}.`
            );
        }
    }

    /**
     * Adds experience to the player, applies levels if neccessary
     * @param xp amount of experience to add
     */
    public addXP(xp:number):void{
        // ignore if max level
        if(this.isLevelCap)
            return;

        // store xp earned (for event)
        const totalXP:number = xp;
        // levelup if possible
        while(xp >= this.xpToGo){
            // level up
            xp -= this.xpToGo;
            this.levelUp();
        }
        // add leftover xp
        this._xp += xp;

        // trigger update
        this.triggerPlayerUpdate(
            {xp: this.xp},
            `You earned ${totalXP} experience.`
        );
    }

    /**
     * Adds merits to the player, keeps within merit capacity and triggers player update
     * @param merits amount of merits to add
     */
    public addMerits(merits:number):void{
        // ignore if merits already full
        if(this.meritsFull)
            return;

        // add merits and enforce capacity
        this._merits = Math.min(this.merits + Math.abs(merits), Player.MERITS_CAP);

        // trigger update
        this.triggerPlayerUpdate(
            {merits: this._merits},
            `You earned ${merits} merits.`
        );
    }

    /**
     * Toggles between run speed and move speed
     */
    public toggleRun():void{
        if(this.moveSpeed === Player.MOVE_SPEED)
            this.moveSpeed = Player.RUN_SPEED;
        else
            this.moveSpeed = Player.MOVE_SPEED;
    }

    /**
     * Destructor for the player
     */
    public destroy():void{
        super.destroy();
        this.onPlayerUpdate = null;
    }

    /**
     * Triggers the player update listener
     * @param data      update event payload
     * @param message   optional text message 
     */
    private triggerPlayerUpdate(data:PlayerData, message?:string):void{
        if(this.onPlayerUpdate){
            this.onPlayerUpdate({
                target: this,
                data,
                message
            });
        }
    }

    /**
     * Gets an object that represents the current stats of the player
     * @returns player stats object
     */
    public getStats():PlayerStats{
        const {
            level, xp, xpRequired, merits
        } = this;

        return {
            ...super.getStats(), level, xp, xpRequired, merits
        }
    }

    /**
     * Gets an object that represents the current state of the player
     * @returns player state object
     */
    public getState():PlayerState{
        const {
            level, xp, xpRequired, merits, archetype
        } = this;

        return {
            ...super.getState(), level, xp, xpRequired, merits, archetype
        };
    }

    /**
     * Getter for the enumerated archetype id
     * @returns enumerated archetype id
     */
    public get archetype():PlayerArchetype{
        return this._archetype;
    }

    /**
     * Getter for if the player is level capped or not
     * @returns is at level capacity or not
     */
    public get isLevelCap():boolean{
        return this.level >= Player.LEVEL_CAP;
    }

    /**
     * Getter for if the player has reach merit capacity.
     * @returns True/false if at merit cap.
     */
    public get meritsFull():boolean{
        return this.merits >= Player.MERITS_CAP;
    }

    /**
     * Getter for level
     * @returns level of the player
     */
    public get level():number{
        return this._level;
    }

    /**
     * Getter for xp required for this level
     * @returns total xp required for this level
     */
    public get xpRequired():number{
        const n:number = this.level - 1;
        return (n + 2) * (n + 3) + 20;
    }

    /**
     * Getter for how much more xp is required to level
     * @returns difference of xp required and xp
     */
    public get xpToGo():number{
        return this.xpRequired - this.xp;
    }

    /**
     * Getter for experience
     * @returns amount of experience points
     */
    public get xp():number{
        return this._xp;
    }

    /**
     * Getter for merits
     * @returns amount of merits
     */
    public get merits():number{
        return this._merits;
    }
}