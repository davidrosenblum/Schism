export const rng = (min:number, max:number):number => {
    return Math.random() * (max - min) + min;
};

export const rngDec = (min:number, max:number, fracDigits:number):number => {
    return parseFloat(rng(min, max).toFixed(fracDigits));
};

export const rngInt = (min:number, max:number):number => {
    return Math.trunc(rng(min, max));
};

export const randomIndex = <T>(array:Array<T>):T => {
    const index:number = Math.floor(Math.random() * array.length);
    return array[index];
}