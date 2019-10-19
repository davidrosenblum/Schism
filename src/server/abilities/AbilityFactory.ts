import { Ability, AbilityType } from "./Ability";
import { AlchemistAbility1, AlchemistAbility2, AlchemistAbility3, AlchemistAbility4 } from "./AlchemistAbilities";
import { KnightAbility1, KnightAbility2, KnightAbility3, KnightAbility4 } from "./KnightAbilities";
import { RangerAbility1, RangerAbility2, RangerAbility3, RangerAbility4 } from "./RangerAbilities";
import { Ghoul1, GraveKnight1, Lich1, Lich2 } from "./UndeadAbilities";

// array of all the ability configurations
const abilityConfigs = [
    AlchemistAbility1, AlchemistAbility2, AlchemistAbility3, AlchemistAbility4,
    KnightAbility1, KnightAbility2, KnightAbility3, KnightAbility4,
    RangerAbility1, RangerAbility2, RangerAbility3, RangerAbility4,
    Ghoul1, GraveKnight1, Lich1, Lich2
];

// reduce the abilities array into a dictionary of {[abilityType]: () => new Ability(type)}
const abilities:{[name:string]: ()=>Ability} = abilityConfigs.reduce((acc, val) => {
    // create a dictionary to hold the {ability: createFunction}
    const abilityDict:{[name:string]: ()=>Ability} = {};
    // store the createFunction in the dictionary under the ability name key
    abilityDict[val.internalName] = () => new Ability(val);
    // create new object by merging the accumulator with new ability dict
    return {...acc, ...abilityDict};
}, {});

export class AbilityFactory{
    /**
     * Creates a new ability object based on the ability type
     * @param type ability internal name
     * @returns ability object
     */
    public static create(type:AbilityType):Ability{
        if(type in abilities){
            return abilities[type]();
        }
        return null;
    }
}