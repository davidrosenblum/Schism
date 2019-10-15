export interface CombatStatChangeEvent{
    target:CombatStat;
    base?:number;
    current?:number;
    capacity?:number;
    hardCapacity?:number;
}

export class CombatStat{
    private _base:number;
    private _current:number;
    private _capacity:number;
    private _hardCapacity:number;
    private _lastClearModifiers:number;

    public onChange:(evt:CombatStatChangeEvent)=>void;

    constructor(base:number, hardCap?:number){
        this._base = base;
        this._current = base;
        this._capacity = base;
        this._hardCapacity = hardCap || 9999;
        this._lastClearModifiers = -1;

        this.onChange = null;
    }

    public modify(amount:number, durationSec:number=0):void{
        this._current += amount;
        this.enforceCapacity();
        this.triggerChange({current: this.current});

        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    this.modify(-amount);
                }
            }, durationSec * 1000);
        }
    }

    public modifyPercent(percentFloat:number, durationSec?:number):void{
        this.modify(this.capacity * percentFloat, durationSec);
    }

    public modifyCapacity(amount:number, durationSec:number=0):void{
        this._capacity += amount;
        this.enforceHardCapacity();
        this.triggerChange({capacity: this.capacity});


        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    this.modifyCapacity(-amount);
                }
            }, durationSec * 1000);
        }
    }

    public modifyCapacityPercent(percentFloat:number, durationSec?:number):void{
        this.modifyCapacity(this.capacity * percentFloat, durationSec);
    }

    public modifyCapacityKeepRatio(amount:number, durationSec?:number):void{
        const ratio:number = this.ratio;
        
        this._capacity += amount;
        this.enforceHardCapacity();
        
        this._current = this.capacity * ratio;
        this.enforceCapacity();

        this.triggerChange({capacity: this.capacity, current: this.current});

        if(durationSec > 0){
            setTimeout(() => {
                if(this && this._lastClearModifiers < Date.now()){
                    this.modifyCapacityKeepRatio(-amount);
                }
            }, durationSec * 1000);
        }
    }

    public modifyCapacityPercentKeepRatio(percentFloat:number, durationSec?:number):void{
        this.modifyCapacityKeepRatio(this.capacity * percentFloat, durationSec);
    }

    public refill():void{
        this._current = this.capacity;
        this.triggerChange({current: this.current});
    }

    public clearTempModifiers():void{
        this._lastClearModifiers = Date.now();
        
        this._current = this.base * (this._current / this._capacity);
        this._capacity = this.base;

        this.triggerChange({
            current: this.current,
            capacity: this.capacity
        });
    }

    public resetToBase():void{
        this._current = this.base;
        this._capacity = this.base;

        this.triggerChange({
            current: this.current,
            capacity: this.capacity
        });
    }

    private enforceCapacity():void{
        if(this._current > this._capacity){
            this._current = this._capacity;
        }
    }

    private enforceHardCapacity():void{
        if(this._capacity > this._hardCapacity){
            this._capacity = this._hardCapacity;
        }
    }

    private triggerChange(change:{base?:number, current?:number, capacity?:number, hardCapacity?:number}):void{
        if(this.onChange){
            this.onChange({target: this, ...change});
        }
    }

    public get base():number{
        return this._base;
    }

    public get current():number{
        return this._current;
    }

    public get capacity():number{
        return this._capacity;
    }

    public get hardCapacity():number{
        return this._hardCapacity;
    }

    public get ratio():number{
        return this.capacity > 0 ? (this.current / this.capacity) : 1;
    }
}