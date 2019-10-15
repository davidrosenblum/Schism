import { Sprite, SpriteParams } from "./Sprite";
import { AnimationKeyFrame, AnimationLibrary } from "./AnimationLoader";

export interface AnimatedSpriteParams extends SpriteParams{
    animations?:AnimationLibrary;
    defaultAnimation?:string;
}

export class AnimatedSprite extends Sprite{
    public static readonly FRAMES_PER_ANIM:number = 60;

    private _animations:AnimationLibrary
    private _currFrame:number;
    private _currAnim:string;
    private _framesLeft:number;
    
    constructor(params:AnimatedSpriteParams){
        super(params);

        this._animations = {};
        this._currFrame = 0;
        this._currAnim = null;
        this._framesLeft = 0;

        const {
            animations, defaultAnimation
        } = params;

        if(animations){
            this.appendAnimations(animations);
        }

        if(defaultAnimation){
            this.playAnimation(defaultAnimation);
        }
    }

    public draw(ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number, ticks:number):boolean{
        if(!this.currentAnimation){
            return super.draw(ctx, offsetX, offsetY, ticks);    
        }

        if(!this.visible){
            return false;
        }

        this.updateAnimation(1); // change to ticks
        this.triggerBeforeDraw(ctx, offsetX, offsetY);


        const anim:AnimationKeyFrame = this.currAnimFrame;

        // const sx:number =  anim.width / this.drawBox.width;
        // const sy:number = anim.height / this.drawBox.height;

        let x:number = this.drawBox.x + offsetX;
        let y:number = this.drawBox.y + offsetY;
        // let w:number = this.drawBox.width * sx;
        // let h:number = this.drawBox.height * sy;

        // if(w !== this.drawBox.width)
        //     x -= (this.drawBox.width - w) / 2;

        // if(h !== this.drawBox.height)
        //     y -= Math.abs(this.drawBox.height - h);

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
            this.image, anim.x, anim.y, anim.width, anim.height,
            x, y, this.drawBox.width, this.drawBox.height
        );
        ctx.restore();

        this.drawChildren(ctx, offsetX, offsetY, ticks);
        this.triggerAfterDraw(ctx, offsetX, offsetY);
        return true;
    }

    private updateAnimation(ticks:number):void{
        this._framesLeft -= ticks;

        if(this._framesLeft <= 0){
            this.nextFrame();
            this.resetFramesLeft();
        }
    }

    private resetFramesLeft():void{
        this._framesLeft = this.currAnimFrame.frames;
    }

    public nextFrame():void{
        if(this.currentAnimation){
            if(++this._currFrame >= this.currAnimFrames.length){
                this._currFrame = 0;
            }
        }
    }

    public prevFrame():void{
        if(this.currentAnimation){
            if(--this._currFrame < 0){
                this._currFrame = this.currAnimFrames.length - 1;
            }
        }
    }

    public playAnimation(name:string):boolean{
        if(name in this._animations && this.currentAnimation !== name){
            this._currFrame = 0;
            this._currAnim = name;
            this.resetFramesLeft();
            return true;
        }
        return false;
    }

    public appendAnimations(data:{[name:string]: AnimationKeyFrame[]}):void{
        for(let animation in data){
            this.setAnimation(animation, data[animation]);
        }
    }

    public stopAnimation():void{
        this._currFrame = 0;
        this._currAnim = null;
    }

    public setAnimation(name:string, frames:AnimationKeyFrame[]):void{
        this._animations[name] = [...frames];
    }

    private get currAnimFrames():AnimationKeyFrame[]{
        return this._animations[this.currentAnimation];
    }

    private get currAnimFrame():AnimationKeyFrame{
        return this.currentAnimation ? this.currAnimFrames[this.currentFrame] : null;
    }

    public get currentFrame():number{
        return this._currFrame;
    }

    public get currentAnimation():string{
        return this._currAnim;
    }
}