import { Unit, UnitParams, UnitState } from './Unit';

export enum NpcRank{
    MINION=1, ELITE=2, BOSS=3, ELITE_BOSS=4
}

export enum NpcRange{
    MELEE=1, RANGED=2
}

export interface NPCParams extends UnitParams{
    level:number;
    rank:NpcRank;
    prefRange:NpcRange;
}

export interface NPCState extends UnitState{
    level:number;
    rank:NpcRank;
}

export class NPC extends Unit{
    public static readonly SIGHT:number = 128;

    private _level:number;
    private _rank:NpcRank;
    private _prefRange:NpcRange;

    public sleeping:boolean;
    public target:Unit;

    constructor(params:NPCParams){
        super(params);

        const {
            level, rank, prefRange
        } = params;
        
        this._level = level;
        this._rank = rank;
        this._prefRange = prefRange; 
        this.sleeping = true;
        this.target = null;

        this.health.modifyCapacityKeepRatio(
            (this.level - 1) * (this.level + 3)
        );
    }

    public canSee(target:Unit):boolean{
        return this.inRange(target, NPC.SIGHT);
    }

    public getState():NPCState{
        const {
            level, rank
        } = this;

        return {
            ...super.getState(), level, rank
        };
    }
    
    public get canSeeTarget():boolean{
        return this.target && this.canSee(this.target);
    }

    public get level():number{
        return this._level;
    }

    public get rank():NpcRank{
        return this._rank;
    }

    public get prefRange():NpcRange{
        return this._prefRange;
    }

    public get xpValue():number{
        return this.rank * this.level;
    }
}