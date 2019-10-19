import { CombatStat } from "./CombatStat";
import { GameObject, GameObjectUpdate, GameObjectParams, GameObjectState } from "./GameObject";

/**
 * GameObject constructor parameters
 */
export interface CombatObjectParams extends GameObjectParams{
    health?:number;
    mana?:number;
    resistance?:number;
    defense?:number;
}

/**
 * CombatObject state representation
 */
export interface CombatObjectState extends GameObjectState{
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
}

/**
 * CombatObject stats representation
 */
export interface CombatObjectStats{
    health:number;
    healthCap:number;
    mana:number;
    manaCap:number;
    resistance:number;
    defense:number;
}

/**
 * Update data specific to the CombatObject class
 */
export interface CombatObjectData{
    health?:number;
    healthCap?:number;
    mana?:number;
    manaCap?:number;
    resistance?:number;
    defense?:number;
}

/**
 * CobmatObject update includes CobmatObject-specific and inherited update data
 */
export type CombatObjectUpdate = CombatObjectData & GameObjectUpdate;

// forwarded ombat stat change event
export interface CombatEvent{
    target:CombatObject;
    data:CombatObjectData;
}

// death event
export interface DeathEvent{
    target:CombatObject;
}

export class CombatObject extends GameObject{
    public static readonly HEALTH_CAP:number = 999;
    public static readonly MANA_CAP:number = 999;
    public static readonly RESISTANCE_CAP:number = 0.90;
    public static readonly DEFENSE_CAP:number = 0.50;
    public static readonly CRIT_CHANCE:number = 0.05;

    private _health:CombatStat;
    private _mana:CombatStat;
    private _resistance:CombatStat;
    private _defense:CombatStat;

    public invulnerable:boolean;
    public onCombatUpdate:(evt:CombatEvent)=>void;
    public onDeath:(evt:DeathEvent)=>void;

    /**
     * Constructs a combat object
     * @param params combat object parameters
     */
    constructor(params:CombatObjectParams){
        super(params);

        const {
            health=1, mana=1, resistance=0, defense=0
        } = params;

        this._health =      new CombatStat(health, CombatObject.HEALTH_CAP);
        this._mana =        new CombatStat(mana, CombatObject.MANA_CAP);
        this._resistance =  new CombatStat(resistance, CombatObject.RESISTANCE_CAP);
        this._defense =     new CombatStat(defense, CombatObject.DEFENSE_CAP);

        this.invulnerable = false;
        this.onCombatUpdate = null;
        this.onDeath = null;

        // listen for health changes 
        this.health.onChange = ({current, capacity}) => {
            // forward health update
            this.triggerCombatUpdate({health: current, healthCap: capacity});

            // trigger death if dead
            if(this.health.current <= 0)
                this.triggerDeath();
        };

        // listen for mana changes
        this.mana.onChange = ({current, capacity}) => {
            // forward mana update
            this.triggerCombatUpdate({mana: current, manaCap: capacity});
        };

        // listen for resistance changes
        this.resistance.onChange = ({current}) => {
            // forward resistance update
            this.triggerCombatUpdate({resistance: current});
        };

        // listen for defense changes
        this.defense.onChange = ({current}) => {
            // forward defense update
            this.triggerCombatUpdate({defense: current});
        };
    }

    /**
     * Triggers the combat update listener
     * @param data combat update data
     */
    private triggerCombatUpdate(data:CombatObjectData):void{
        if(this.onCombatUpdate){
            this.onCombatUpdate({
                target: this,
                data
            })
        }
    }

    /**
     * Triggers the death event listener
     */
    private triggerDeath():void{
        if(this.onDeath)
            this.onDeath({target: this});
    }

    /**
     * Takes damage (resistable)
     * @param amount damage to take
     */
    public takeDamage(amount:number):void{
        // resist damage
        const damage:number = amount * (1 - this.resistance.current);
        this.takeAbsoluteDamage(damage);
    }

    /**
     * Takes damage over time
     * @param initial   damage dealt up front
     * @param dotTotal  secondary damage to take split between tick intervals
     * @param ticks     amount of successive damage ticks to take
     */
    public takeDamageOverTime(initial:number, dotTotal:number, ticks:number):void{
        // calculate damage per dick and take initial damage
        const tickDamage:number = dotTotal / ticks;
        this.takeDamage(initial);

        // if still alive after initial attack, take tick damage
        if(this.health.current > 0){
            let ticksToGo:number = ticks; 

            const interval:NodeJS.Timeout = setInterval(() => {
                if(this && --ticksToGo > 0 && this.health.current > 0){
                    this.takeDamage(tickDamage);
                }
                else{
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    /**
     * Takes absolute damage (no resistance)
     * @param amount damage to take
     */
    public takeAbsoluteDamage(amount:number):void{
        if(!this.invulnerable)
            this.health.modify(-amount);
    }

    /**
     * Refills health and mana
     */
    public refill():void{
        this.health.refill();
        this.mana.refill();
    }

    /**
     * Clears the temp modifiers for each state (health, mana, resistance, defense)
     */
    public clearTempModifiers():void{
        this.health.clearTempModifiers();
        this.mana.clearTempModifiers();
        this.resistance.clearTempModifiers();
        this.defense.clearTempModifiers();
    }

    /**
     * Rolls for the change to deal critical damage
     * @returns true/false for successful critical roll
     */
    public rollCritical():boolean{
        return Math.random() >= (1 - CombatObject.CRIT_CHANCE);
    }

    /**
     * Rolls for the chance to dodge an atttack
     * @returns true/false for successful dodge roll
     */
    public rollDodge():boolean{
        return Math.random() >= (1 - this.defense.current);
    }

    /**
     * Kills the combat object by removing all hit points
     */
    public kill():void{
        this.health.modify(-this.health.current);
    }

    /**
     * Destructor for this object (removes listeners)
     */
    public destroy():void{
        this.health.onChange = null;
        this.mana.onChange = null;
        this.resistance.onChange = null;
        this.defense.onChange = null;
    }

    /**
     * Gets an object that represents the current stats as numbers
     * @returns stats object
     */
    public getStats():CombatObjectStats{
        return {
            health:         this.health.current,
            healthCap:      this.health.capacity,
            mana:           this.mana.current,
            manaCap:        this.mana.capacity,
            resistance:     this.resistance.current,
            defense:        this.defense.current
        }
    }

    /**
     * Gets an object that represents the combat state
     * @returns state object
     */
    public getState():CombatObjectState{
        return {
            ...super.getState(),
            ...this.getStats()
        };
    }

    /**
     * Getter for health object
     * @returns health
     */
    public get health():CombatStat{
        return this._health;
    }

    /**
     * Getter for mana object
     * @returns mana
     */
    public get mana():CombatStat{
        return this._mana;
    }

    /**
     * Getter for resistance object
     * @returns resistance
     */
    public get resistance():CombatStat{
        return this._resistance;
    }

    /**
     * Getter for defense object
     * @returns defense
     */
    public get defense():CombatStat{
        return this._defense;
    }

    /**
     * Getter for if this unit is dead or not
     * @returns death status
     */
    public get isDead():boolean{
        return this.health.current <= 0;
    }
}