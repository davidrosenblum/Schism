import { Unit, UnitState, UnitUpdate, UnitStats } from './Unit';
import { PlayerSchema, PlayerUpdateSchema } from '../database/DBPlayers';
import { UpdateEvent } from './Entity2D';

export enum PlayerArchetype{
    KNIGHT = 1, RANGER = 2, ALCHEMIST = 3
}

export interface PlayerState extends UnitState{
    archetype:PlayerArchetype;
    level:number;
    xp:number;
    xpRequired:number;
    merits:number;
}

export interface PlayerStats extends UnitStats{
    level:number;
    xp:number;
    xpRequired:number;
    merits:number;
}

export type PlayerData = PlayerUpdateSchema;

export type PlayerUpdate = UnitUpdate & PlayerData;

export interface PlayerEvent{
    target:Player;
    data:PlayerData;
    message?:string;
}

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

    constructor(saveData:PlayerSchema, ownerId:string){
        super({
            ownerId,
            name:           saveData.name,
            type:           "player",
            faction:        "Players",
            width:          ArchetypeStats[saveData.archetype].w,
            height:         ArchetypeStats[saveData.archetype].h,
            moveSpeed:      Player.MOVE_SPEED,
            health:         ArchetypeStats[saveData.archetype].hp,
            mana:           ArchetypeStats[saveData.archetype].mp,
            resistance:     ArchetypeStats[saveData.archetype].res,
            defense:        ArchetypeStats[saveData.archetype].def
        });

        this._archetype =   saveData.archetype;
        this._level =       1;
        this._xp =          0;
        this._merits =      saveData.merits;

        this.onPlayerUpdate = null;
        this.addMerits(saveData.merits);
        this.addXP(saveData.xp);
    }

    private levelUp():void{
        if(!this.isLevelCap){
            this._level++;
            this._xp = 0;

            this.health.modifyCapacity(ArchetypeStats[this.archetype].hpBonus);
            this.refill();

            this.triggerPlayerUpdate(
                {level: this.level},
                `You reached level ${this.level}.`
            );
        }
    }

    public addXP(xp:number):void{
        while(xp >= this.xpToGo){
            xp -= this.xpToGo;
            this.levelUp();
        }
        this._xp += xp;

        this.triggerPlayerUpdate(
            {xp: this.xp},
            `You earned ${xp} experience.`
        );
    }

    public addMerits(merits:number):void{
        this._merits = Math.min(this.merits + merits, Player.MERITS_CAP);

        this.triggerPlayerUpdate(
            {merits: this._merits},
            `You earned ${merits} merits.`
        );
    }

    public toggleRun():void{
        if(this.moveSpeed === Player.MOVE_SPEED){
            this.moveSpeed = Player.RUN_SPEED;
        }
        else{
            this.moveSpeed = Player.MOVE_SPEED;
        }
    }

    public destroy():void{
        super.destroy();
        this.onPlayerUpdate = null;
    }

    private triggerPlayerUpdate(data:PlayerData, message?:string):void{
        if(this.onPlayerUpdate){
            this.onPlayerUpdate({
                target: this,
                data,
                message
            });
        }
    }

    public getStats():PlayerStats{
        const {
            level, xp, xpRequired, merits
        } = this;

        return {
            ...super.getStats(), level, xp, xpRequired, merits
        }
    }

    public getState():PlayerState{
        const {
            level, xp, xpRequired, merits, archetype
        } = this;

        return {
            ...super.getState(), level, xp, xpRequired, merits, archetype
        };
    }

    public get archetype():PlayerArchetype{
        return this._archetype;
    }

    public get isLevelCap():boolean{
        return this.level >= Player.LEVEL_CAP;
    }

    public get level():number{
        return this._level;
    }

    public get xpRequired():number{
        const n:number = this.level - 1;
        return (n + 2) * (n + 3) + 20;
    }

    public get xpToGo():number{
        return this.xpRequired - this.xp;
    }

    public get xp():number{
        return this._xp;
    }

    public get merits():number{
        return this._merits;
    }
}