import { Box } from "./Box";
import { Object2D } from "./Object2D";
import { Renderer } from "./Renderer";

export class Scroller{
    private _bounds:Box;
    private _scroll:Box;
    private _renderer:Renderer;

    constructor(renderer:Renderer, bounds:Box){
        this._bounds = bounds.clone();
        this._scroll = new Box(renderer.canvas.width, renderer.canvas.height);
        this._renderer = renderer;
    }

    private updateRenderer():void{
        this._renderer.offsetX = -this._scroll.x;
        this._renderer.offsetY = -this._scroll.y;
    }

    public lookAt(x:number, y:number):void{
        const dx:number = x + this._scroll.width / 2;
        const dy:number = y + this._scroll.height / 2;

        this.reset();

        this.scrollLeft(Math.abs(dx));
        this.scrollUp(Math.abs(dy));
    }

    public reset():void{
        this._scroll.x = 0;
        this._scroll.y = 0;
        this.updateRenderer();
    }
    
    public smartScrollUp(y:number, distance:number):void{
        if(this._scroll.centerY > y){
            this.scrollUp(distance);
        }
    }

    public smartScrollDown(y:number, distance:number):void{
        if(this._scroll.centerY < y){
            this.scrollDown(distance);
        }
    }

    public smartScrollLeft(x:number, distance:number):void{
        if(this._scroll.centerX > x){
            this.scrollLeft(distance);
        }
    }

    public smartScrollRight(x:number, distance:number):void{
        if(this._scroll.centerX < x){
            this.scrollRight(distance);
        }
    }

    public scrollUp(distance:number):void{
        this._scroll.y -= distance;
        if(this._scroll.y < this._bounds.y){
            this._scroll.y = this._bounds.y;
        }
        this.updateRenderer();
    }

    public scrollDown(distance:number):void{
        this._scroll.y += distance;
        if(this._scroll.bottom > this._bounds.bottom){
            this._scroll.y = this._bounds.bottom - this._scroll.height;
        }
        this.updateRenderer();
    }

    public scrollLeft(distance:number):void{
        this._scroll.x -= distance;
        if(this._scroll.x < this._bounds.x){
            this._scroll.x = this._bounds.x;
        }
        this.updateRenderer();
    }

    public scrollRight(distance:number):void{
        this._scroll.x += distance;
        if(this._scroll.right > this._bounds.right){
            this._scroll.x = this._bounds.right - this._scroll.width;
        }
        this.updateRenderer();
    }
}