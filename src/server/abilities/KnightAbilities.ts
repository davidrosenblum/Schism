import { Ability, AbilityTargets, TargetRelationship, AbilityRange, AbilityConfig } from "./Ability";
import { Unit } from "../entities/Unit";

export const KnightAbility1:AbilityConfig = {
    name: "Impale",
    internalName: "knight1",
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

        const critBonus:number = caster.rollCritical() ? 1 : 1.25;
        const damage:number = 4 * critBonus;
        const dot:number = 6 * critBonus;
        const ticks:number = 3;

        target.takeDamageOverTime(damage, dot, ticks);
        return true;
    }
};

export const KnightAbility2:AbilityConfig = {
    name: "Pulverize",
    internalName: "knight2",
    description: "",
    manaCost: 5,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.NEAR,
    maxTargets: 1,
    recharge: 5,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1 : 1.25;
        const damage:number = 12 * critBonus;

        target.takeDamage(damage);
        return true;
    }
};

export const KnightAbility3:AbilityConfig = {
    name: "Endure Pain",
    internalName: "knight3",
    description: "",
    manaCost: 10,
    targets: AbilityTargets.SELF_ONLY,
    affects: AbilityTargets.SELF_ONLY,
    range: AbilityRange.SELF,
    maxTargets: 1,
    recharge: 45,
    affect: (caster, target, relationship) => {
        caster.health.modifyCapacityPercentKeepRatio(1.25, 20);
        return true;
    }
};

export const KnightAbility4:AbilityConfig = {
    name: "Shatter Armor",
    internalName: "knight4",
    description: "",
    manaCost: 8,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.NEAR,
    maxTargets: 1,
    recharge: 12,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1 : 1.25;
        const damage:number = 18 * critBonus;

        target.takeDamage(damage);
        target.resistance.modifyCapacityKeepRatio(-0.20, 10);
        return true;
    }
};