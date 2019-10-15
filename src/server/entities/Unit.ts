import { Ability, AbilityState } from "../abilities/Ability";
import { AbilityFactory } from "../abilities/AbilityFactory";
import { CombatEntity, CombatEntityParams, CombatEntityState, CombatEntityUpdate, CombatEntityStats } from "./CombatEntity";
import { UpdateEvent } from "./Entity2D";

export interface UnitParams extends CombatEntityParams{
    abilities?:Iterable<string>;
}

export interface UnitState extends CombatEntityState{
    abilities:AbilityState[];
}

export interface UnitStats extends CombatEntityStats{
    // more stats?
}

export interface UnitUpdateData{
    abilities?:AbilityState[];
}

export type UnitUpdate = UnitUpdateData & CombatEntityUpdate;

export type UnitUpdateEvent = UpdateEvent<Unit, UnitUpdate>;

export class Unit extends CombatEntity{
    private _abilities:Map<string, Ability>;

    constructor(params:UnitParams){
        super(params);

        this._abilities = new Map();

        if(params.abilities)
            this.learnAbilities(params.abilities);
    }

    public learnAbility(name:string):boolean{
        const ability:Ability = AbilityFactory.create(name);
        if(ability){
            this._abilities.set(ability.internalName, ability);
            return true;
        }
        return false;
    }

    public learnAbilities(names:Iterable<string>):void{
        for(let name of names){
            this.learnAbility(name);
        }
    }

    public getAbility(name:string):Ability{
        return this._abilities.get(name);
    }

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

        return null; // should never happen!
    }

    public getState():UnitState{
        // convert map to array of string names
        let abilities:AbilityState[] = new Array(this._abilities.size);
        let i:number = 0;
        this._abilities.forEach(ability => abilities[i++] = ability.getState());

        return {
            ...super.getState(), abilities
        };
    }
}