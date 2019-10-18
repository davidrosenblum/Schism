/**
 * Object2D constructor parameters
 */
export interface Object2DParams{
    x?:number;
    y?:number;
    width:number;
    height:number;
}

/**
 * Object2D state representation
 */
export interface Object2DState{
    x:number;
    y:number;
    width:number;
    height:number;
}

/**
 * Update data specific to the Object2D class
 */
export interface Object2DUpdate{
    x?:number;
    y?:number;
    width?:number;
    height?:number;
}

/**
 * Generic Object2D update event
 */
export interface UpdateEvent<T extends Object2D, U>{
    target:T;
    update:U;
}

export class Object2D{
    private _x:number;
    private _y:number;
    private _width:number;
    private _height:number;

    public onUpdate:<T extends Object2D, U>(evt:UpdateEvent<T, U>)=>void;

    /**
     * Constructs a 2D object
     * @param params 2D object parameters
     */
    constructor(params:Object2DParams){
        const {
            x=0, y=0, width, height
        } = params;

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this.onUpdate = null;
    }

    /**
     * Checks if hitbox collision is occurring between this and the target object
     * @param target target object to check collision with
     * @return true/false if collision is occurring
     */
    public hitboxTest(target:Object2D):boolean{
        return this.x < target.right && target.x < this.right &&
            this.y < target.bottom && target.y < this.bottom;
    }

    /**
     * Triggers update listener
     * @param update update data to dispatch
     */
    protected triggerUpdate<U extends Object2DUpdate>(update:U):void{
        if(this.onUpdate){
            this.onUpdate<Object2D, Object2DUpdate>({
                target: this,
                update
            });
        }
    }

    /**
     * Checks if the target object is within the given range of this object
     * @param target    object to check if is in range or not
     * @param distance  distance allowed between objects
     * @returns true/false target in range
     */
    public inRange(target:Object2D, distance:number):boolean{
        const dblDistance:number = distance * 2;
        const rangeBox:Object2D = new Object2D({
            x: target.x - distance,
            y: target.y - distance,
            width: target.width + dblDistance,
            height: target.height + dblDistance
        });
        return this.hitboxTest(rangeBox);
    }

    /**
     * Checks if the target object is to the left of this object
     * @param target object to check
     * @returns true/false if the object is to the left of this object
     */
    public isLeftOf(target:Object2D):boolean{
        return this.centerX < target.centerX;
    }

    /**
     * Checks if the target object is to the right of this object
     * @param target object to check
     * @returns true/false if the object is to the right of this object
     */
    public isRightOf(target:Object2D):boolean{
        return this.centerX > target.centerX;
    }

    /**
     * Checks if the target object is above this object
     * @param target object to check
     * @returns true/false if object is above this object
     */
    public isAbove(target:Object2D):boolean{
        return this.centerY < target.centerY;
    }

    /**
     * Checks if the target is below this object
     * @param target object to check
     * @returns true/false if target object is beneath this object
     */
    public isBelow(target:Object2D):boolean{
        return this.centerY > target.centerY;
    }

    /**
     * Applies multiple updates (all fields are optional)
     * @param update        update object to safely merge with state
     * @param triggerUpdate true/false if update event should be triggered
     */
    public setState(update:Object2DUpdate, triggerUpdate:boolean=true):void{
        if(typeof update.x === "number")
            this._x = update.x;

        if(typeof update.y === "number")
            this._y = update.y;
        
        if(typeof update.width === "number")
            this._width = update.width;

        if(typeof update.height === "number")
            this._height = update.height;

        if(triggerUpdate)
            this.triggerUpdate<Object2DUpdate>(update);
    }

    /**
     * Gets an object that represents the state this 2D object
     * @returns state object
     */
    public getState():Object2DState{
        const {
            x, y, width, height
        } = this;

        return {
            x, y, width, height
        };
    }

    /**
     * Setter for the x-axis coordinate, triggers update
     */
    public set x(val:number){
        this._x = val;
        this.triggerUpdate<Object2DUpdate>({x: val});
    }

    /**
     * Setter for the y-axis coordinate, triggers update
     */
    public set y(val:number){
        this._y = val;
        this.triggerUpdate<Object2DUpdate>({y: val});
    }

    /**
     * Setter for the width, triggers update
     */
    public set width(val:number){
        this._width = val;
        this.triggerUpdate<Object2DUpdate>({width: val});
    }

    /**
     * Setter for the height, triggers update
     */
    public set height(val:number){
        this._height = val;
        this.triggerUpdate<Object2DUpdate>({height: val});
    }

    /**
     * Getter for the x-axis coordinate
     * @returns x-axis coordinate
     */
    public get x():number{
        return this._x;
    }

    /**
     * Getter for the y-axis coordinate
     * @returns y-axis coordinate
     */
    public get y():number{
        return this._y;
    }

    /**
     * Getter for the width
     * @returns width
     */
    public get width():number{
        return this._width;
    }

    /**
     * Getter for the height
     * @returns height
     */
    public get height():number{
        return this._height;
    }

    /**
     * Getter for the center x-axis coordinate
     * @returns center x-axis coordinate
     */
    public get centerX():number{
        return this.x + this.width / 2;
    }

    /**
     * Getter for the center y-axis coordinate
     * @returns center y-axis coordinate
     */
    public get centerY():number{
        return this.y + this.height / 2;
    }

    /**
     * Getter for the right x-axis coordinate of this object
     * @returns right x-axis coordinate
     */
    public get right():number{
        return this.x + this.width;
    }

    /**
     * Getter for the bottom y-axis coordinate of this object
     * @returns bottom y-axis coordinate
     */
    public get bottom():number{
        return this.y + this.height;
    }
}