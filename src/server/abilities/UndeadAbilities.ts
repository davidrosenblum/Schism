import { AbilityConfig, AbilityTargets, AbilityRange } from "./Ability";
import { damageOnce, damageOverTime } from "./AbilityPresets";

export const Ghoul1:AbilityConfig = {
    name:           "Claw",
    internalName:   "ghoul1",
    description:    "",
    manaCost:       2,
    targets:        AbilityTargets.ENEMIES_ONLY,
    affects:        AbilityTargets.ENEMIES_ONLY,
    range:          AbilityRange.NEAR,
    maxTargets:     1,
    recharge:       3,
    affect: (caster, target, relationship) => {
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 2,
            critMult: 1.10
        });

        return true;
    }
};

export const GraveKnight1:AbilityConfig = {
    name:           "Stab",
    internalName:   "graveknight1",
    description:    "",
    manaCost:       3,
    targets:        AbilityTargets.ENEMIES_ONLY,
    affects:        AbilityTargets.ENEMIES_ONLY,
    range:          AbilityRange.NEAR,
    maxTargets:     1,
    recharge:       3,
    affect: (caster, target, relationship) => {
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 4,
            critMult: 1.25
        });

        return true;
    }
};

export const Lich1:AbilityConfig = {
    name:           "Shadow Bolt",
    internalName:   "lich1",
    description:    "",
    manaCost:       3,
    targets:        AbilityTargets.ENEMIES_ONLY,
    affects:        AbilityTargets.ENEMIES_ONLY,
    range:          AbilityRange.FAR,
    maxTargets:     1,
    recharge:       4,
    affect: (caster, target, relationship) => {
        if(target.rollDodge())
            return false;

        damageOnce({
            caster,
            target,
            baseDamage: 2,
            critMult: 1.25
        });

        return true;
    }
};

export const Lich2:AbilityConfig = {
    name:           "Decay",
    internalName:   "lich2",
    description:    "",
    manaCost:       5,
    targets:        AbilityTargets.ENEMIES_ONLY,
    affects:        AbilityTargets.ENEMIES_ONLY,
    range:          AbilityRange.FAR,
    maxTargets:     1,
    recharge:       8,
    affect: (caster, target, relationship) => {
        if(target.rollDodge())
            return false;

        damageOverTime({
            caster,
            target,
            baseDamage: 3,
            dotTotal: 6,
            ticks: 3,
            critMult: 1.25,
        });

        return true;
    }
};