import { Box } from "./Box";
import { Object2DContainer } from "./Object2DContainer";

export class Renderer{
    private _canvas:HTMLCanvasElement;
    private _ctx:CanvasRenderingContext2D;
    private _scenes:Iterable<Object2DContainer>;
    private _rendering:boolean;
    private _quality:ImageSmoothingQuality;
    private _lastFrameHandle;

    public showGrid:{rows:number, cols:number, tileSize:number};
    public showHitBoxes:boolean;
    public offsetX:number;
    public offsetY:number;
    public beforeRender:()=>void;
    public afterRender:()=>void;

    constructor(canvasWidth:number=550, canvasHeight:number=400, canvas?:HTMLCanvasElement){
        this._canvas =          canvas || document.createElement("canvas");
        this._ctx =             this._canvas.getContext("2d");
        this._scenes =          null;
        this._rendering =       false;
        this._quality =         "medium";
        this._lastFrameHandle = null;

        this.showGrid =         null;
        this.showHitBoxes =     false;
        this.offsetX =          0;
        this.offsetY =          0;
        this.beforeRender =     null;
        this.afterRender =      null;

        this.resize(canvasWidth, canvasHeight);
        this.canvas.addEventListener("click", this.onClick);
    }

    private onClick = (evt:MouseEvent):void => {
        // remove the renderer offset since that's not in the recursive call
        const mouse:Box = new Box(4, 4, evt.offsetX - this.offsetX - 2, evt.offsetY - this.offsetY - 2);

        let clicked:number = 0;
        let sceneClicked:number = 0;

        for(let scene of this._scenes){
            scene.forEachChildRecursive((child, offX, offY) => {
                if(child.drawBox.clone(offX, offY).hitboxTest(mouse)){
                    clicked++;
                    sceneClicked++;
                    child.click({clicked, sceneClicked});
                }
            });
            sceneClicked = 0;
        }
    }

    public resize(width:number, height:number):void{
        this.canvas.width = width;
        this.canvas.height = height;
    }

    private renderBoxes():void{
        for(let scene of this._scenes){
            scene.forEachChildRecursive((child, offX, offY) => {
                if(this.showHitBoxes){
                    child.drawHitbox(this.ctx, offX + this.offsetX, offY + this.offsetY);
                }

                // show something else?
            });
        }
    }

    private renderGrid():void{
        const {
            rows, cols, tileSize
        } = this.showGrid;

        let scaledRow:number;

        for(let row:number = 0; row < rows; row++){
            scaledRow = row * tileSize + this.offsetX;

            for(let col:number = 0; col < cols; col++){
                this.ctx.strokeRect(scaledRow, col * tileSize + this.offsetY, tileSize, tileSize);
            }
        }
    }

    private renderFrame():void{
        if(!this.isRendering){
            return;
        }

        if(this.beforeRender){
            this.beforeRender();
        }

        this.clearFrame();

        const {
            ctx, offsetX, offsetY
        } = this;

        let i:number = 0;
        for(let scene of this._scenes){
            scene.draw(ctx, offsetX, offsetY, 0);

            if(this.showGrid && ++i === 1){
                this.renderGrid();
            }
        }

        if(this.showHitBoxes){
            this.renderBoxes();
        }


        if(this.afterRender){
            this.afterRender();
        }

        this._lastFrameHandle = requestAnimationFrame(() => this.renderFrame());
    }

    public clearFrame():void{
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public render(scenes:Iterable<Object2DContainer>):boolean{
        if(this.isRendering){
            return false;
        }

        this._rendering = true;
        this._scenes = scenes;
        this.renderFrame();
        return true;
    }

    public stop():void{
        this._rendering = false;
        this._scenes = null;

        if(this._lastFrameHandle){
            cancelAnimationFrame(this._lastFrameHandle);
        }
    }

    public set quality(val:ImageSmoothingQuality){
        this._quality = val;
        this._ctx.imageSmoothingQuality = val;
    }

    public get canvas():HTMLCanvasElement{
        return this._canvas;
    }

    private get ctx():CanvasRenderingContext2D{ // public?
        return this._ctx;
    }

    public get quality():ImageSmoothingQuality{
        return this._quality;
    }

    public get isRendering():boolean{
        return this._rendering;
    }
}