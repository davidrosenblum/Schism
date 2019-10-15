import { AssetLoader } from "./AssetLoader";
import { Object2DContainer, Object2DContainerParams } from "./Object2DContainer";

export interface SpriteParams extends Object2DContainerParams{
    imageSrc:string;
}

export class Sprite extends Object2DContainer{
    private static readonly emptyImage:HTMLImageElement = document.createElement("img");

    private _image:HTMLImageElement;

    constructor(params:SpriteParams){
        super(params);

        this._image = Sprite.emptyImage;
        this.setImage(params.imageSrc);
    }

    public draw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):boolean{
        if(!this.visible){
            return false;
        }

        this.triggerBeforeDraw(ctx, offsetX, offsetY);

        const x:number = this.drawBox.x + offsetX;
        const y:number = this.drawBox.y + offsetY;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.image, x, y, this.drawBox.width, this.drawBox.height);
        ctx.restore();

        this.drawChildren(ctx, offsetX, offsetY, ticks);
        this.triggerAfterDraw(ctx, offsetX, offsetY);
        return true;
    }

    public setImage(src:string, cb?:(err?:ErrorEvent)=>void):void{
        AssetLoader.loadImage(src, (err, img) => {
            if(img){
                this._image = img;
            }

            if(cb){
                cb(err);
            }
        });
    }

    public get image():HTMLImageElement{
        return this._image;
    }
}