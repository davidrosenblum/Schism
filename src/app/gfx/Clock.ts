export class Clock{
    private _prevTime:number;
    private _initTime:number;

    /**
     * Constructs a Clock object.
     */
    constructor(){
        this._initTime = performance.now();
        this._prevTime = this._initTime;
    }

    /**
     * Gets the current timestamp and updates the prevTime.
     * @returns The timestamp.
     */
    private now():number{
        this._prevTime = performance.now();
        return this._prevTime;
    }

    /**
     * Gets the time between now and when the last delta getter was called.
     * Updates the prevTime.
     * @returns The delta time.
     */
    public getDelta():number{
        const prevTime:number = this.prevTime;
        return this.now() - prevTime;
    }

    /**
     * Gets the time between now and when the clock started.
     * Updates the prevTime.
     * @returns The delta time.
     */
    public getTimeElapsed():number{
        return this.now() - this.initTime;
    }

    /**
     * Getter for the timestamp of the last time a delta getter was called.
     * @returns The timestamp.
     */
    public get prevTime():number{
        return this._prevTime;
    }

    /**
     * Getter for the timestamp when this clock started.
     * @returns The timestamp.
     */
    public get initTime():number{
        return this._initTime;
    }
}