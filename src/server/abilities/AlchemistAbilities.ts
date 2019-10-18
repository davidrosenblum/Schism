import { AbilityTargets, AbilityRange, TargetRelationship, AbilityConfig } from "./Ability";
import { damageOnce, damageOverTime, heal, giveMana, buffResistance } from "./AbilityPresets";

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
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 4,
            critMult: 1.33
        });

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
        if(target.rollDodge())
            return false;

        damageOverTime({
            caster,
            target,
            baseDamage: 8,
            dotTotal: 6,
            ticks: 3,
            critMult: 1.33
        });

        return true;
    }
};

export const AlchemistAbility3:AbilityConfig = {
    name: "Mana Burst",
    internalName: "alchemist3",
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
                heal({
                    target,
                    percent: 0.10
                });

                giveMana({
                    target,
                    percent: 0.10
                });

                return true;

            case TargetRelationship.ENEMIES:
                if(target.rollDodge())
                    return false;

                damageOnce({
                    caster,
                    target,
                    baseDamage: 15,
                    critMult: 1.33
                });
                
                return true;

            default:
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
        heal({
            target,
            percent: 0.20
        });

        buffResistance({
            target,
            percent: 0.20,
            durationSec: 45
        });

        return true;
    }
};