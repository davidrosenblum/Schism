/**
 * Generates a random float within the given range
 * @param min   smallest in range (inclusive)
 * @param max   largest in range (inclusive)
 * @returns random float in the range
 */
export const rng = (min:number, max:number):number => {
    return Math.random() * (max - min) + min;
};

/**
 * Generates a random float within the given range with a controlled amount of decimal places
 * @param min           smallest in range (inclusive)
 * @param max           largest in range (inclusive)
 * @param fracDigits    number of decimal places
 */
export const rngDec = (min:number, max:number, fracDigits:number):number => {
    return parseFloat(rng(min, max).toFixed(fracDigits));
};

/**
 * Generates a random intenger within the given range
 * @param min   smallest in range (inclusive)
 * @param max   largest in range (inclusive)
 * @returns random integer in the range
 */
export const rngInt = (min:number, max:number):number => {
    return Math.trunc(rng(min, max));
};

/**
 * Picks a random index from the array
 * @param array array to pick an index from
 * @returns index number
 */
export const randomIndex = (array:Array<any>):number => {
    return Math.floor(Math.random() * array.length);
};

/**
 * Picks a random element from an array
 * @param array array to pick an element from
 */
export const randomElement = <T>(array:Array<T>):T => {
    const index:number = randomIndex(array);
    return array[index];
}