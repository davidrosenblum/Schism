import { Unit, UnitParams, UnitState } from "./Unit";

/**
 * Enumerated rank values
 */
export enum NpcRank{
    MINION=1, ELITE=2, BOSS=3, ELITE_BOSS=4
}

/**
 * Enumerated preferred range values
 */
export enum NpcRange{
    MELEE=1, RANGED=2
}

/**
 * NPC constructor parameters
 */
export interface NPCParams extends UnitParams{
    level:number;
    rank:NpcRank;
    prefRange:NpcRange;
}

/**
 * NPC state representation
 */
export interface NPCState extends UnitState{
    level:number;
    rank:NpcRank;
}

export class NPC extends Unit{
    public static readonly SIGHT:number = 128;

    private _level:number;
    private _rank:NpcRank;
    private _prefRange:NpcRange;

    public target:Unit;

    /**
     * Constructs a non-player character
     * @param params NPC parameters
     */
    constructor(params:NPCParams){
        super(params);

        const {
            level, rank, prefRange
        } = params;
        
        this._level = level;
        this._rank = rank;
        this._prefRange = prefRange; 
        this.target = null;

        this.health.modifyCapacityKeepRatio(
            (this.level - 1) * (this.level + 3)
        );
    }

    /**
     * Checks if the given target is visible to this NPC
     * @param target unit to check if in range or not
     * @returns true/false if in range
     */
    public canSee(target:Unit):boolean{
        return this.inRange(target, NPC.SIGHT);
    }

    /**
     * Gets an object that represents of state of this NPC
     * @returns state object
     */
    public getState():NPCState{
        const {
            level, rank
        } = this;

        return {
            ...super.getState(), level, rank
        };
    }
    
    /**
     * Getter for if there is a current target and if its visible (in range) or not
     * @returns true/false target exists and in range
     */
    public get canSeeTarget():boolean{
        return this.target && this.canSee(this.target);
    }

    /**
     * Getter for the level
     * @returns level
     */
    public get level():number{
        return this._level;
    }

    /**
     * Getter for the rank
     * @returns rank
     */
    public get rank():NpcRank{
        return this._rank;
    }

    /**
     * Getter for the preferred range
     * @returns preferred range
     */
    public get prefRange():NpcRange{
        return this._prefRange;
    }

    /**
     * Getter for the xp value
     * @returns xp value
     */
    public get xpValue():number{
        return this.rank * this.level;
    }
}