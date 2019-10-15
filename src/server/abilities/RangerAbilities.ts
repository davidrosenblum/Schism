import { AbilityConfig, AbilityTargets, AbilityRange } from "./Ability";

export const RangerAbility1:AbilityConfig = {
    name: "Quickshot",
    internalName: "ranger1",
    description: "",
    manaCost: 2,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.FAR,
    maxTargets: 1,
    recharge: 1,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.50 : 1;
        const damage:number = 6 * critBonus;
        target.takeDamage(damage);
        return true;
    }
};

export const RangerAbility2:AbilityConfig = {
    name: "Poison Arrow",
    internalName: "ranger2",
    description: "",
    manaCost: 5,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.FAR,
    maxTargets: 1,
    recharge: 6,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.50 : 1;
        const damage:number = 8 * critBonus;
        const dot:number = 4 * critBonus;
        const ticks:number = 3;

        target.takeDamageOverTime(damage, dot, ticks);
        target.resistance.modifyCapacityKeepRatio(-0.10, 10);
        target.defense.modifyCapacityKeepRatio(-0.05, 10);
        target.health.modifyCapacityPercent(-0.10, 10);
        return true;
    }
};

export const RangerAbility3:AbilityConfig = {
    name: "Multishot",
    internalName: "ranger3",
    description: "",
    manaCost: 8,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.FAR,
    maxTargets: 6,
    recharge: 12,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.50 : 1;
        const damage:number = 14 * critBonus;
        target.takeDamage(damage);
        return true;
    }
};

export const RangerAbility4:AbilityConfig = {
    name: "Rain of Arrows",
    internalName: "ranger4",
    description: "",
    manaCost: 20,
    targets: AbilityTargets.ENEMIES_ONLY,
    affects: AbilityTargets.ENEMIES_ONLY,
    range: AbilityRange.FAR,
    maxTargets: 16,
    recharge: 35,
    affect: (caster, target, relationship) => {
        if(target.rollDodge()){
            return false;
        }

        const critBonus:number = caster.rollCritical() ? 1.50 : 1;
        const damage:number = 25 * critBonus;
        target.takeDamage(damage);
        return true;
    }
};