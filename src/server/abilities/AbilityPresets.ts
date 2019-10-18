import { Unit } from "../entities/Unit";

export interface DamageParams{
    caster:Unit;
    target:Unit;
    baseDamage:number;
    critMult:number;
}

export interface DoTParams extends DamageParams{
    dotTotal:number;
    ticks:number;
} 

export interface BuffDebuffParams{
    target:Unit;
    percent:number;
    durationSec?:number;
}

/**
 * Rolls for a critical bonus change
 * @param caster    unit rolling for critical
 * @param critMult  critical bonus multiplier (if critical occurs)
 * @returns critical multiplier (critMult or 1 depending on roll)
 */
const rollCrit = (caster:Unit, critMult:number):number => {
    return caster.rollCritical() ? critMult : 1;
};

const calcDamage = (caster:Unit, baseDamage:number, critMult:number):number => {
    // roll for critical bonus
    const critBonus:number = rollCrit(caster, critMult);

    // apply critical and level scale
    const damage:number = (baseDamage + caster.level) * critBonus;

    return damage;
};

/**
 * Unit takes damage 
 * @param params damage parameters
 */
export const damageOnce = (params:DamageParams) => {
    const {
        caster, target, baseDamage, critMult
    } = params;

    // calculate damage
    const damage:number = calcDamage(caster, baseDamage, critMult);
    
    // take damage
    target.takeDamage(damage);
};

/**
 * Unit takes damage upfront and subsequent incremental damage
 * @param params damage over time parameters
 */
export const damageOverTime = (params:DoTParams) => {
    const {
        caster, target, baseDamage, critMult,
        ticks, dotTotal
    } = params;

    // calculate initial damage
    const damage:number = calcDamage(caster, baseDamage, critMult);

    // calculate tick aggregate damage
    const tickDot:number = calcDamage(caster, dotTotal, critMult);

    // take damage over time
    target.takeDamageOverTime(damage, tickDot, ticks);
};

/**
 * Boosts a unit's health capacity, scales current health (permanent or temporary)
 * @param params health buff parameters
 */
export const buffHealth = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.health.modifyCapacityPercentKeepRatio(Math.abs(percent), durationSec);
};

/**
 * Boosts unit's mana capacity, scales current mana (permanent or temporary)
 * @param params mana buff parameters
 */
export const buffMana = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.mana.modifyCapacityPercentKeepRatio(Math.abs(percent), durationSec);
};

/**
 * Boosts a unit's resistance value (permanent or temporary)
 * @param params resistance buff parameters
 */
export const buffResistance = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.resistance.modifyCapacityKeepRatio(Math.abs(percent), durationSec);
};

/**
 * Boosts a unit's defense value (permanent or temporary)
 * @param params defense buff parameters
 */
export const buffDefense = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.defense.modifyCapacityKeepRatio(Math.abs(percent), durationSec);
};

/**
 * Reduces a unit's maximum health (permanent or temporary)
 * @param params health debuff parameters
 */
export const debuffHealth = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.health.modifyCapacityPercent(-Math.abs(percent), durationSec);
};

/**
 * Reduces a unit's maximum mana (permanent or temporary)
 * @param params mana debuff parameters
 */
export const debuffMana = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.mana.modifyCapacityPercent(-Math.abs(percent), durationSec);
};

/**
 * Reduces an unit's current resistance value (permanent or temporary)
 * @param params resistance debuff parameters
 */
export const debuffResistance = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.resistance.modifyCapacityKeepRatio(-Math.abs(percent), durationSec);
};

/**
 * Reduces an unit's current defense value (permanent or temporary)
 * @param params defense debuff parameters
 */
export const debuffDefense = (params:BuffDebuffParams) => {
    const {
        target, percent, durationSec
    } = params;

    target.defense.modifyCapacityKeepRatio(-Math.abs(percent), durationSec);
};

/**
 * Heals a percentage of the unit's max health
 * @param params healing parameters
 */
export const heal = (params:BuffDebuffParams) => {
    const {
        target, percent
    } = params;

    target.health.modifyPercent(percent);
};

/**
 * Restores a percentage of the unit's max mana
 * @param params mana restoration parameters
 */
export const giveMana = (params:BuffDebuffParams) => {
    const {
        target, percent
    } = params;

    target.mana.modifyPercent(percent);
};