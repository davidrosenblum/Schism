import { UpdateEvent } from "./Entity2D";
import { CombatStat } from "./CombatStat";
import { GameEntity, GameEntityParams, GameEntityState, GameEntityUpdate } from "./GameEntity";

export interface CombatEntityParams extends GameEntityParams{
    health?:number;
    mana?:number;
    resistance?:number;
    defense?:number;
}

export interface CombatEntityState extends GameEntityState{
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
}

export interface CombatEntityStats{
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
}

export interface CombatEntityData{
    health?:number;
    healthCap?:number;
    mana?:number;
    manaCap?:number;
    resistance?:number;
    defense?:number;
}

export type CombatEntityUpdate = CombatEntityData & GameEntityUpdate;

export interface CombatEvent{
    target:CombatEntity;
    data:CombatEntityData;
}

export interface DeathEvent{
    target:CombatEntity;
}

export class CombatEntity extends GameEntity{
    public static readonly HEALTH_CAP:number = 999;
    public static readonly MANA_CAP:number = 999;
    public static readonly RESISTANCE_CAP:number = 0.90;
    public static readonly DEFENSE_CAP:number = 0.50;
    public static readonly CRIT_CHANCE:number = 0.05;

    private _health:CombatStat;
    private _mana:CombatStat;
    private _resistance:CombatStat;
    private _defense:CombatStat;

    public onCombatUpdate:(evt:CombatEvent)=>void;
    public onDeath:(evt:DeathEvent)=>void;

    constructor(params:CombatEntityParams){
        super(params);

        const {
            health=1, mana=1, resistance=0, defense=0
        } = params;

        this._health =      new CombatStat(health, CombatEntity.HEALTH_CAP);
        this._mana =        new CombatStat(mana, CombatEntity.MANA_CAP);
        this._resistance =  new CombatStat(resistance, CombatEntity.RESISTANCE_CAP);
        this._defense =     new CombatStat(defense, CombatEntity.DEFENSE_CAP);

        this.onCombatUpdate = null;
        this.onDeath = null;

        this.health.onChange = ({current, capacity}) => {
            this.triggerCombatUpdate({health: current, healthCap: capacity});
            if(this.health.current <= 0)
                this.triggerDeath();
        };

        this.mana.onChange = ({current, capacity}) => {
            this.triggerCombatUpdate({mana: current, manaCap: capacity});
        };

        this.resistance.onChange = ({current}) => {
            this.triggerCombatUpdate({resistance: current});
        };

        this.defense.onChange = ({current}) => {
            this.triggerCombatUpdate({defense: current});
        };
    }

    private triggerCombatUpdate(data:CombatEntityData):void{
        if(this.onCombatUpdate){
            this.onCombatUpdate({
                target: this,
                data
            })
        }
    }

    private triggerDeath():void{
        if(this.onDeath)
            this.onDeath({target: this});
    }

    public takeDamage(amount:number):void{
        const damage:number = amount * (1 - this.resistance.current);
        this.takeAbsoluteDamage(damage);
    }

    public takeDamageOverTime(initial:number, dotTotal:number, ticks:number):void{
        const tickDamage:number = dotTotal / ticks;
        this.takeDamage(initial);

        if(this.health.current > 0){
            let ticksToGo:number = ticks;

            const interval:NodeJS.Timeout = setInterval(() => {
                if(this && --ticksToGo > 0){
                    this.takeDamage(tickDamage);
                }
                else{
                    clearTimeout(interval);
                }
            }, 1000);
        }
    }

    public takeAbsoluteDamage(amount:number):void{
        this.health.modify(-amount);
    }

    public refill():void{
        this.health.refill();
        this.mana.refill();
    }

    public clearTempModifiers():void{
        this.health.clearTempModifiers();
        this.mana.clearTempModifiers();
        this.resistance.clearTempModifiers();
        this.defense.clearTempModifiers();
    }

    public rollCritical():boolean{
        return Math.random() >= (1 - CombatEntity.CRIT_CHANCE);
    }

    public rollDodge():boolean{
        return Math.random() >= (1 - this.defense.current);
    }

    public kill():void{
        this.health.modify(-this.health.current);
    }

    public destroy():void{
        this.health.onChange = null;
        this.mana.onChange = null;
        this.resistance.onChange = null;
        this.defense.onChange = null;
    }

    public getStats():CombatEntityStats{
        return {
            health:         this.health.current,
            healthCap:      this.health.capacity,
            mana:           this.mana.current,
            manaCap:        this.mana.capacity,
            resistance:     this.resistance.current,
            defense:        this.defense.current
        }
    }

    public getState():CombatEntityState{
        return {
            ...super.getState(), ...this.getStats()
        };
    }

    public get health():CombatStat{
        return this._health;
    }

    public get mana():CombatStat{
        return this._mana;
    }

    public get resistance():CombatStat{
        return this._resistance;
    }

    public get defense():CombatStat{
        return this._defense;
    }
}