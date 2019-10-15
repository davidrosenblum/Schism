import { Object2D, Object2DParams } from "./Object2D";

export interface TextFieldParams extends Object2DParams{
    text?:string;
    maxWidth?:number;
    font?:string;
    fillStyle?:string;
    strokeStyle?:string;
}

export class TextField extends Object2D{
    private static readonly measureCtx:CanvasRenderingContext2D = document.createElement("canvas").getContext("2d");

    public static defaultFont:string = "15px arial";
    public static defaultFillStyle:string = "white";
    public static defaultStrokeStyle:string = "black";

    public text:string;
    public maxWidth:number;
    public font:string;
    public fillStyle:string;
    public strokeStyle:string;

    constructor(params:TextFieldParams){
        super(params);

        const {
            text="", maxWidth=undefined, font=TextField.defaultFont,
            fillStyle=TextField.defaultFillStyle, strokeStyle=TextField.defaultStrokeStyle
        } = params;

        this.text =         text;
        this.maxWidth =     maxWidth;
        this.font =         font;
        this.fillStyle =    fillStyle;
        this.strokeStyle =  strokeStyle;
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
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeText(this.text, x, y, this.maxWidth);
        ctx.fillText(this.text, x, y, this.maxWidth);
        ctx.restore();

        this.triggerAfterDraw(ctx, offsetX, offsetY);
        return true;
    }

    public centerText():boolean{
        if(this.parent){
            this.drawBox.x = (this.parent.drawBox.width - this.textWidth) / 2;
            // this.drawBox.y = (this.parent.drawBox.height - this.textHeight) / 2;
            return true;
        }
        return false;
    }

    public get textWidth():number{
        TextField.measureCtx.font = this.font;
        return TextField.measureCtx.measureText(this.text).width;
    }

    public get textHeight():number{
        return parseFloat(this.font);
    }
}