// change event
export interface CombatStatChangeEvent{
    target:CombatStat;
    base?:number;
    current?:number;
    capacity?:number;
    hardCapacity?:number;
}

export class CombatStat{
    public static defaultHardCap:number = 9999;

    private _base:number;
    private _current:number;
    private _capacity:number;
    private _hardCapacity:number;
    private _lastClearModifiers:number;

    public onChange:(evt:CombatStatChangeEvent)=>void;

    /**
     * Constructs a combat stats object
     * @param base      base value, stored and the initial current and capacity
     * @param hardCap   hard capacity, capacity can never exceed this value
     */
    constructor(base:number, hardCap?:number){
        this._base = base;
        this._current = base;
        this._capacity = base;
        this._hardCapacity = hardCap || CombatStat.defaultHardCap;
        this._lastClearModifiers = -1;

        this.onChange = null;
    }

    /**
     * Modifies the current value by a given value
     * @param amount        modifier
     * @param durationSec   modifier duration (optional)
     */
    public modify(amount:number, durationSec:number=0):void{
        // modify current value, enforce capacity, trigger update
        this._current += amount;
        this.enforceCapacity();
        this.triggerChange({current: this.current});

        // if there is a duration, set modifier remove timeout
        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    // remove modifier
                    this.modify(-amount);
                }
            }, durationSec * 1000);
        }
    }

    /**
     * Modifies the current value by a percentage
     * @param percentFloat  modifier percent
     * @param durationSec   modifier duration (optional)
     * @example modifyPercent(0.25, 5) // decreases current to 25% for 5s
     */
    public modifyPercent(percentFloat:number, durationSec?:number):void{
        this.modify(this.capacity * percentFloat, durationSec);
    }

    /**
     * Modifiers the capacity by a given value
     * @param amount        modifier
     * @param durationSec   modifier duration (optional)
     * @example modifyCapacity(5, 3) // modifies capacity by 5 for 3s
     */
    public modifyCapacity(amount:number, durationSec:number=0):void{
        // modify capacity, enforce hard cap, trigger update
        this._capacity += amount;
        this.enforceHardCapacity();
        this.triggerChange({capacity: this.capacity});

        // if there is a duration, set remove modifier timeout
        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    // remove modifier
                    this.modifyCapacity(-amount);
                }
            }, durationSec * 1000);
        }
    }

    /**
     * Modifies the capacity by a percentage and does not change current
     * @param percentFloat  modifier percent
     * @param durationSec   modifier duration (optional)
     * @example modifyCapacityPercent(1.10, 8) // increases capacity by 10% for 8s
     */
    public modifyCapacityPercent(percentFloat:number, durationSec?:number):void{
        this.modifyCapacity(this.capacity * percentFloat, durationSec);
    }

    /**
     * Modifies the capacity by a given value and scales current to preserve the current/capacity ratio
     * @param amount        modifier
     * @param durationSec   modifier duration (optional)
     * @example modifyCapacityKeepRatio(-15, 3) // decrease capacity by 15 for 3s and scales current
     */
    public modifyCapacityKeepRatio(amount:number, durationSec?:number):void{
        // store ratio
        const ratio:number = this.ratio;
        
        // modify capacity and enforce hard cap
        this._capacity += amount;
        this.enforceHardCapacity();
        
        // scale current and enforce capacity
        this._current = this.capacity * ratio;
        this.enforceCapacity();

        // trigger change
        this.triggerChange({capacity: this.capacity, current: this.current});

        // if there is a duration, set remove modifier timeout
        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    // remove modifier
                    this.modifyCapacityKeepRatio(-amount);
                }
            }, durationSec * 1000);
        }
    }

    /**
     * Modifies the capacity by a percentage and scales current to preserve the current/capacity ratio
     * @param percentFloat  modifier percent
     * @param durationSec   modifier duration (optional)
     * @example modifyCapacityPercentKeepRatio(1.25, 35);// increase current capacity by 25% for 35s and scales current
     */
    public modifyCapacityPercentKeepRatio(percentFloat:number, durationSec?:number):void{
        this.modifyCapacityKeepRatio(this.capacity * percentFloat, durationSec);
    }

    /**
     * Sets the current value to the capacity value
     */
    public refill():void{
        this._current = this.capacity;
        this.triggerChange({current: this.current});
    }

    /**
     * Resets capacity to base and scales current to the preserve the ratio and cancels all timed modifiers
     */
    public clearTempModifiers():void{
        this._lastClearModifiers = Date.now();
        
        this._current = this.base * (this._current / this._capacity);
        this._capacity = this.base;

        this.triggerChange({
            current: this.current,
            capacity: this.capacity
        });
    }

    /**
     * Resets the current and capacity to the base value
     */
    public resetToBase():void{
        this._current = this.base;
        this._capacity = this.base;

        this.triggerChange({
            current: this.current,
            capacity: this.capacity
        });
    }

    /**
     * Makes sure that the current value is less than / equal to capacity
     */
    private enforceCapacity():void{
        if(this._current > this._capacity){
            this._current = this._capacity;
        }
    }

    /**
     * Makes sure that the capacity is less than / equal to hard capacity
     */
    private enforceHardCapacity():void{
        if(this._capacity > this._hardCapacity){
            this._capacity = this._hardCapacity;
        }
    }

    /**
     * Triggers stat change listener
     * @param change the properties that have changed
     */
    private triggerChange(change:{base?:number, current?:number, capacity?:number, hardCapacity?:number}):void{
        if(this.onChange)
            this.onChange({target: this, ...change});
    }

    /**
     * Getter for the base value
     * @returns base value
     */
    public get base():number{
        return this._base;
    }

    /**
     * Getter for the current value
     * @returns current value
     */
    public get current():number{
        return this._current;
    }

    /**
     * Getter for current capacity
     * @returns capacity
     */
    public get capacity():number{
        return this._capacity;
    }

    /**
     * Getter the absolute maximum the capacity can be extened to
     * @returns capacity's capacity 
     */
    public get hardCapacity():number{
        return this._hardCapacity;
    }

    /**
     * Getter for the 'current' - 'capacity' ratio
     * @returns ratio between current and capacity
     */
    public get ratio():number{
        return this.capacity > 0 ? (this.current / this.capacity) : 1;
    }
}