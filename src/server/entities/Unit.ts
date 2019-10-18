import { Ability, AbilityState, AbilityType } from "../abilities/Ability";
import { AbilityFactory } from "../abilities/AbilityFactory";
import { CombatObject, CombatObjectParams, CombatObjectState, CombatObjectStats, CombatObjectUpdate } from "./CombatObject";
import { UpdateEvent } from "./Object2D";

/**
 * Unit constructor parameters
 */
export interface UnitParams extends CombatObjectParams{
    abilities?:Iterable<AbilityType>;
}

/**
 * Unit state representation
 */
export interface UnitState extends CombatObjectState{
    abilities:AbilityState[];
}

/**
 * Unit stats representation
 */
export interface UnitStats extends CombatObjectStats{
}

/**
 * Update data specific to the Unit class
 */
export interface UnitData{
    abilities?:AbilityState[];
}

/**
 * Unit update includes Unit-specific and inherited update data
 */
export type UnitUpdate = UnitData & CombatObjectUpdate;

/**
 * Unit update event
 */
export type UnitUpdateEvent = UpdateEvent<Unit, UnitUpdate>;

export abstract class Unit extends CombatObject{
    private _abilities:Map<string, Ability>;

    /**
     * Constructs a unit object
     * @param params unit parameters
     */
    constructor(params:UnitParams){
        super(params);

        this._abilities = new Map();

        // learn preset abilities
        if(params.abilities)
            this.learnAbilities(params.abilities);
    }

    /**
     * Learns an ability 
     * @param type ability type (internal name)
     * @returns true/false if ability was learned (not known and valid type)
     */
    public learnAbility(type:AbilityType):boolean{
        // already known ability?
        if(this._abilities.has(type))
            return false;

        // ability exists?
        const ability:Ability = AbilityFactory.create(type);
        if(!ability)
            return false;

        // learn ability
        this._abilities.set(ability.internalName, ability);
        return true;
    }

    /**
     * Learns a group of abilities
     * @param types ability types (internal names) to learn
     */
    public learnAbilities(types:Iterable<AbilityType>):void{
        for(let type of types)
            this.learnAbility(type);
    }

    /**
     * Gets an learned ability by its internal name
     * @param name enumerated ability internal name
     * @returns the ability
     */
    public getAbility(name:AbilityType):Ability{
        return this._abilities.get(name);
    }

    /**
     * Gets an ability at random
     * @returns the randomly selected ability
     */
    public getAnyAbility():Ability{
        // random ability index
        const index:number = Math.floor(Math.random() * this._abilities.size);
        
        // iterate until index is reached
        let i:number = 0;
        for(let ability of this._abilities.values()){ // values() gives an iterator
            if(i++ === index){
                return ability;
            }
        }

        return null; // only happens if the unit has no abilities
    }

    /**
     * Gets an object that represents the unit's state
     * @returns unit state object
     */
    public getState():UnitState{
        // convert ability map to array of ability states
        let abilities:AbilityState[] = new Array(this._abilities.size);
        let i:number = 0;
        this._abilities.forEach(ability => abilities[i++] = ability.getState());

        return {
            ...super.getState(), abilities
        };
    }

    /**
     * Getter for level
     * @returns level
     */
    public abstract get level():number;
}