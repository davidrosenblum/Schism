export class Clock{
    private _initTime:bigint;
    private _prevTime:bigint;

    /**
     * Constructs a Clock object.
     */
    constructor(){
        this._initTime = process.hrtime.bigint();
        this._prevTime = this._initTime;
    }

    /**
     * Gets the current timestamp and updates the prevTime.
     * @returns The timestamp.
     */
    private now():bigint{
        this._prevTime = process.hrtime.bigint();
        return this.prevTime;
    }

    /**
     * Getter for the delta between now and last time a delta getter was called.
     * Updes the prevTime.
     * @returns The delta time.
     */
    public getDelta():bigint{
        const prev:bigint = this.prevTime;
        return this.now() - prev;
    }

    /**
     * Gets the time delta between now and clock creation.
     * Updates the prevTime.
     * @returns The delta time.
     */
    public getElapsedTime():bigint{
        return this.now() - this.initTime;
    }

    /**
     * Getter for the timestamp when this clock was created.
     * @returns The timestamp.
     */
    public get initTime():bigint{
        return this._initTime;
    }

    /**
     * Getter for the last timestamp when a delta getter was called.
     * @returns The timestamp.
     */
    public get prevTime():bigint{
        return this._prevTime;
    }
}