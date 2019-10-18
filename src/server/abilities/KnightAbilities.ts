import { Ability, AbilityTargets, TargetRelationship, AbilityRange, AbilityConfig } from "./Ability";
import { Unit } from "../entities/Unit";
import { buffHealth, damageOnce, damageOverTime, debuffResistance } from "./AbilityPresets";

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
        if(target.rollDodge())
            return false;

        damageOverTime({
            caster,
            target,
            baseDamage: 4,
            dotTotal:   6,
            ticks:      3,
            critMult:   1.25
        });
        
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
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 12,
            critMult:   1.25,
        });

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
        buffHealth({
            target:         caster,
            percent:        1.25,
            durationSec:    20
        });
        
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
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 18,
            critMult:   1.25
        });

        debuffResistance({
            target,
            percent:        -0.20,
            durationSec:    10 
        });

        return true;
    }
};