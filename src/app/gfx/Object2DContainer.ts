import { Object2D, Object2DParams } from "./Object2D";

export interface Object2DContainerParams extends Object2DParams{
}

export class Object2DContainer extends Object2D{
    private _drawList:Object2D[];
    private _children:Map<string, Object2D>;

    constructor(params:Object2DContainerParams={}){
        super(params);

        this._drawList = [];
        this._children = new Map();
    }

    public draw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):boolean{
        if(!this.visible){
            return false;
        }

        this.triggerBeforeDraw(ctx, offsetX, offsetY);

        ctx.save();
        ctx.globalAlpha = this.alpha;
        this.drawChildren(ctx, offsetX, offsetY, ticks);
        ctx.restore();

        this.triggerAfterDraw(ctx, offsetX, offsetY);

        return true;
    }

    public drawChildren(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):void{
        const {x, y} = this.drawBox;

        for(let child of this._drawList){
            child.draw(ctx, offsetX + x, offsetY + y, ticks);
        }
    }

    public addChild(object:Object2D, index:number=-1):boolean{
        if(this.containsChild(object)){
            return false;
        }

        if(index >= 0){
            this._drawList.splice(index, 0, object);
        }
        else{
            this._drawList.push(object);
        }

        this._children.set(object.id, object);
        object.unsafeParentSet(this);
        return true;
    }

    public addChildren(objects:Iterable<Object2D>):void{
        for(let object of objects){
            this.addChild(object);
        }
    }

    public removeChild(object:Object2D):boolean{
        return this.removeChildAt(this.findChildIndex(object)) !== null;
    }

    public removeChildAt(index:number):Object2D{
        const child:Object2D = this.getChildAt(index);
        if(child){
            child.unsafeParentSet(null);
            this._children.delete(child.id);
            this._drawList.splice(index, 1);
            return child;
        }
        return null;
    }

    public removeChildren(objects?:Iterable<Object2D>):void{
        if(objects){
            for(let object of objects){
                this.removeChild(object);
            }
        }
        else{
            while(this.numChildren > 0){
                this.removeChildAt(this.numChildren - 1);
            }
        }
    }

    public containsChild(object:Object2D):boolean{
        return this._children.has(object.id);
    }

    public findChildIndex(object:Object2D):number{
        for(let i:number = 0; i < this.numChildren; i++){
            if(this.getChildAt(i) === object){
                return i;
            }
        }
        return -1;
    }

    public swapChildren(object1:Object2D, object2:Object2D):boolean{
        let a:number = -1;
        let b:number = -1;

        for(let i:number = 0; i < this.numChildren; i++){
            if(this.getChildAt(i) === object1){
                a = i;
            }
            else if(this.getChildAt(i) === object2){
                b = i;
            }

            if(a > -1 && b > -1){
                break;
            }
        }

        if(a > -1 && b > -1){
            this._drawList[a] = object2;
            this._drawList[b] = object1;
            return true;
        }
        return false;
    }

    public swapChildrenAt(index1:number, index2:number):boolean{
        const c1:Object2D = this.getChildAt(index1);
        const c2:Object2D = this.getChildAt(index2);

        if(c1 && c2){
            this._drawList[index1] = c2;
            this._drawList[index2] = c1;
            return true;
        }
        return false;
    }

    public depthSort():void{
        let a:Object2D = null;
        let b:Object2D = null;

        for(let i:number = 0; i < this.numChildren; i++){
            a = this.getChildAt(i);

            for(let j:number = i + 1; j < this.numChildren; j++){
                b = this.getChildAt(j);

                if(a.drawBox.bottom > b.drawBox.bottom){
                    this._drawList[i] = b;
                    this._drawList[j] = a;
                    a = b;
                }
            }
        }
    }

    public forEachChild(cb:(child:Object2D, i:number)=>void):void{
        this._drawList.forEach((val, i) => cb(val, i));
    }

    public forEachChildRecursive(cb:(child:Object2D, offsetX:number, offsetY:number)=>void){
        let {x, y} = this.drawBox;

        this.forEachChild(child => {
            cb(child, x, y);

            if(child instanceof Object2DContainer){
                child.forEachChildRecursive((c, offx, offy) => {
                    cb(c, x + offx, y + offy);
                });
            }
        });
    }

    public getChildAt(index:number):Object2D{
        return this._drawList[index] || null;
    }

    public get numChildren():number{
        return this._drawList.length;
    }
}