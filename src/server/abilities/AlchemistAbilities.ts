import { Ability, AbilityTargets, AbilityRange, TargetRelationship, AbilityConfig } from "./Ability";
import { Unit } from "../entities/Unit";

export const AlchemistAbility1:AbilityConfig = {
    name: "Arcane Bolt",
    internalName: "alchemist1",
    description: "",
    manaCost: 2,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.NEAR,
    maxTargets: 1,
    recharge: 1,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.33 : 1;
        const damage:number = 4 * critBonus;
        target.takeDamage(damage);
        return true;
    }
};

export const AlchemistAbility2:AbilityConfig = {
    name: "Flame Strike",
    internalName: "alchemist2",
    description: "",
    manaCost: 6,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.FAR,
    maxTargets: 16,
    recharge: 1,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.33 : 1;
        const damage:number = 8 * critBonus;
        const dot:number = 6 * critBonus;
        const ticks:number = 3;
        target.takeDamageOverTime(damage, dot, ticks);
        return true;
    }
};

export const AlchemistAbility3:AbilityConfig = {
    name: "Mana Burst",
    internalName: "achelmist3",
    description: "",
    manaCost: 14,
    targets: AbilityTargets.ALL,
    affects: AbilityTargets.ALL,
    range: AbilityRange.NEAR,
    maxTargets: 16,
    recharge: 12,
    affect: (caster, target, relationship) => {
        switch(relationship){
            case TargetRelationship.SELF:
            case TargetRelationship.ALLIES:
                target.health.modifyPercent(0.10);
                target.mana.modifyPercent(0.10);
                return true;

            case TargetRelationship.ENEMIES:
                if(!target.rollDodge()){
                    const critBonus:number = caster.rollCritical() ? 1.33 : 1;
                    const damage:number = 15 * critBonus;
                    target.takeDamage(damage);
                    return true;
                }
                return false;
        }
    }
};

export const AlchemistAbility4:AbilityConfig = {
    name: "Barrier",
    internalName: "alchemist4",
    description: "",
    manaCost: 20,
    targets: AbilityTargets.SELF_ONLY,
    affects: AbilityTargets.ALLIES_AND_SELF,
    range: AbilityRange.NEAR,
    maxTargets: 8,
    recharge: 60,
    affect: (caster, target, relationship) => {
        target.health.modifyPercent(0.20)
        target.resistance.modifyCapacityKeepRatio(0.20, 45);
        return true;
    }
};