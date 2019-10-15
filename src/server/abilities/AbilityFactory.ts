import { Ability } from "./Ability";
import { AlchemistAbility1, AlchemistAbility2, AlchemistAbility3, AlchemistAbility4 } from "./AlchemistAbilities";
import { KnightAbility1, KnightAbility2, KnightAbility3, KnightAbility4 } from "./KnightAbilities";
import { RangerAbility1, RangerAbility2, RangerAbility3, RangerAbility4 } from "./RangerAbilities";

const abilities:{[name:string]: () => Ability} = {
    "alchemist1": () => new Ability(AlchemistAbility1),
    "alchemist2": () => new Ability(AlchemistAbility2),
    "alchemist3": () => new Ability(AlchemistAbility3),
    "alchemist4": () => new Ability(AlchemistAbility4),
    "knight1": () => new Ability(KnightAbility1),
    "knight2": () => new Ability(KnightAbility2),
    "knight3": () => new Ability(KnightAbility3),
    "knight4": () => new Ability(KnightAbility4),
    "ranger1": () => new Ability(RangerAbility1),
    "ranger2": () => new Ability(RangerAbility2),
    "ranger3": () => new Ability(RangerAbility3),
    "ranger4": () => new Ability(RangerAbility4)
};

export class AbilityFactory{
    public static create(type:string):Ability{
        if(type in abilities){
            return abilities[type]();
        }
        return null;
    }
}