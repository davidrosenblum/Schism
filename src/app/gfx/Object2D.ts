import { Box } from "./Box";
import { Object2DContainer } from "./Object2DContainer";

export interface Drawable{
    draw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):boolean;
}

export interface ClickEvent{
    target:Object2D;
    clicked:number;
    sceneClicked:number;
}

export interface Object2DParams{
    x?:number;
    y?:number;
    width?:number;
    height?:number;
    hitboxWidth?:number;
    hitboxHeight?:number;
}

export abstract class Object2D implements Drawable{
    private static nextId:number = 1;

    private _id:string;
    private _drawBox:Box;
    private _hitBox:Box;
    private _parent:Object2DContainer;
    private _alpha:number;

    public visible:boolean;
    public beforeDraw:(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number)=>void;
    public afterDraw:(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number)=>void;
    public onClick:(evt:ClickEvent)=>void;

    constructor(params:Object2DParams={}){
        const {
            x=0, y=0, width=1, height=1, hitboxWidth=width, hitboxHeight=height
        } = params;

        this._id =          (Object2D.nextId++).toString();
        this._drawBox =     new Box(width, height, x, y);
        this._hitBox =      new Box(hitboxWidth, hitboxHeight);
        this._parent =      null;
        this.visible =      true;
        this.beforeDraw =   null;
        this.afterDraw =    null;
        this.onClick =      null;
    }

    public abstract draw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):boolean;

    public drawHitbox(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number):void{
        const {x, y, width, height} = this.hitBox;
        ctx.strokeRect(x + offsetX, y + offsetY, width, height);
    }

    public remove():boolean{
        if(this.parent){
            return this.parent.removeChild(this);
        }
        return false;
    }

    public click(params?:{clicked:number, sceneClicked:number}):void{
        const {clicked=1, sceneClicked=1} = (params || {})
        if(this.onClick){
            this.onClick({target: this, clicked, sceneClicked});
        }
    }

    private positionHitbox():void{
        const {x, bottom, width} = this.drawBox;
        this._hitBox.x = x + (width - this._hitBox.width) / 2;
        this._hitBox.y = bottom - this._hitBox.height;
    }

    protected triggerBeforeDraw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number):void{
        if(this.beforeDraw){
            this.beforeDraw(ctx, offsetX, offsetY);
        }
    }

    protected triggerAfterDraw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number):void{
        if(this.afterDraw){
            this.afterDraw(ctx, offsetX, offsetY);
        }
    }

    public unsafeParentSet(parent:Object2DContainer):void{
        this._parent = parent;
    }

    public set alpha(val:number){
        if(val < 0)
            val = 0;
        if(val > 1)
            val = 1;

        this._alpha = val;
    }

    public get id():string{
        return this._id;
    }

    public get drawBox():Box{
        return this._drawBox;
    }

    public get hitBox():Box{
        this.positionHitbox();
        return this._hitBox;
    }

    public get parent():Object2DContainer{
        return this._parent;
    }

    public get alpha():number{
        return this._alpha;
    }
}