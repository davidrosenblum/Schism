import { AbilityConfig, AbilityTargets, AbilityRange } from "./Ability";
import { damageOnce, damageOverTime, debuffHealth, debuffDefense, debuffResistance } from "./AbilityPresets";

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
        if(target.rollDodge())
            return false;

        damageOnce({
            target,
            caster,
            baseDamage: 6,
            critMult:   1.50
        });

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
        if(target.rollDodge())
            return false;

        damageOverTime({
            caster,
            target,
            baseDamage: 8,
            dotTotal: 4,
            ticks: 3,
            critMult: 1.50
        });

        debuffResistance({
            target,
            percent: -0.10,
            durationSec: 10
        })

        debuffDefense({
            target,
            percent: -0.05,
            durationSec: 10
        });

        debuffHealth({
            target,
            percent: -0.10,
            durationSec: 10
        });

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
        if(target.rollDodge())
            return false;

        damageOverTime({
            caster,
            target,
            baseDamage: 14,
            dotTotal:   3,
            ticks:      3,
            critMult:   1.50    
        });

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
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 25,
            critMult:   1.50    
        });

        return true;
    }
};