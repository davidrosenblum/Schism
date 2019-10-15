export interface Entity2DParams{
    x?:number;
    y?:number;
    width:number;
    height:number;
}

export interface Entity2DState{
    x:number;
    y:number;
    width:number;
    height:number;
}

export interface Entity2DUpdate{
    x?:number;
    y?:number;
    width?:number;
    height?:number;
}

export interface UpdateEvent<T extends Entity2D, U>{
    target:T;
    update:U;
}

export class Entity2D{
    private _x:number;
    private _y:number;
    private _width:number;
    private _height:number;

    public onUpdate:<T extends Entity2D, U>(evt:UpdateEvent<T, U>)=>void;

    constructor(params:Entity2DParams){
        const {
            x=0, y=0, width, height
        } = params;

        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;

        this.onUpdate = null;
    }

    public hitboxTest(target:Entity2D):boolean{
        return this.x < target.right && target.x < this.right &&
            this.y < target.bottom && target.y < this.bottom;
    }

    public inRange(target:Entity2D, distance:number):boolean{
        const dblDistance:number = distance * 2;
        const rangeBox:Entity2D = new Entity2D({
            x: target.x - distance,
            y: target.y - distance,
            width: target.width + dblDistance,
            height: target.height + dblDistance
        });
        return this.hitboxTest(rangeBox);
    }

    public isLeftOf(target:Entity2D):boolean{
        // return this.right < target.x;
        return this.centerX < target.centerX;
    }

    public isRightOf(target:Entity2D):boolean{
        // return this.x > target.right;
        return this.centerX > target.centerX;
    }

    public isAbove(target:Entity2D):boolean{
        return this.centerY < target.centerY;
    }

    public isBelow(target:Entity2D):boolean{
        return this.centerY > target.centerY;
    }

    protected triggerUpdate<U extends Entity2DUpdate>(update:U):void{
        if(this.onUpdate){
            this.onUpdate<Entity2D, Entity2DUpdate>({
                target: this,
                update
            });
        }
    }

    public setState(update:Entity2DUpdate, triggerUpdate:boolean=true):void{
        if(typeof update.x === "number")
            this._x = update.x;

        if(typeof update.y === "number")
            this._y = update.y;
        
        if(typeof update.width === "number")
            this._width = update.width;

        if(typeof update.height === "number")
            this._height = update.height;

        if(triggerUpdate){
            this.triggerUpdate<Entity2DUpdate>(update);
        }
    }

    public getState():Entity2DState{
        const {
            x, y, width, height
        } = this;

        return {
            x, y, width, height
        };
    }

    public set x(val:number){
        this._x = val;
        this.triggerUpdate<Entity2DUpdate>({x: val});
    }

    public set y(val:number){
        this._y = val;
        this.triggerUpdate<Entity2DUpdate>({y: val});
    }

    public set width(val:number){
        this._width = val;
        this.triggerUpdate<Entity2DUpdate>({width: val});
    }

    public set height(val:number){
        this._height = val;
        this.triggerUpdate<Entity2DUpdate>({height: val});
    }

    public get x():number{
        return this._x;
    }

    public get y():number{
        return this._y;
    }

    public get width():number{
        return this._width;
    }

    public get height():number{
        return this._height;
    }

    public get centerX():number{
        return this.x + this.width / 2;
    }

    public get centerY():number{
        return this.y + this.height / 2;
    }

    public get bottom():number{
        return this.y + this.height;
    }

    public get right():number{
        return this.x + this.width;
    }
}