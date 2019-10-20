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

    public onAnimFinish:(evt:{target:AnimatedSprite, anim:string})=>void;
    
    constructor(params:AnimatedSpriteParams){
        super(params);

        this._animations = {};
        this._currFrame = 0;
        this._currAnim = null;
        this._framesLeft = 0;

        this.onAnimFinish = null;

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

        const arDraw:number = this.drawBox.aspectRatio;
        const arAnim:number = anim.width / anim.height;

        let x:number = this.drawBox.x + offsetX;
        let y:number = this.drawBox.y + offsetY;
        let w:number = this.drawBox.width;
        let h:number = this.drawBox.height;

        if(arDraw !== arAnim){
            if(anim.width < anim.height){
                // tall animation
                w = this.drawBox.height * arAnim;
                h = this.drawBox.height;
            }
            else{
                // wide animation
                w = this.drawBox.width;
                h = this.drawBox.width / arAnim;
            }

            // if(w !== this.drawBox.width)
                // w -= Math.abs(w - this.drawBox.width);

            if(h !== this.drawBox.height)
                h -= Math.abs(h - this.drawBox.height);
        }

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
            this.image, anim.x, anim.y, anim.width, anim.height,
            x, y, w, h
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

            if(this.currentFrame === (this.currAnimFrames.length - 1))
                this.triggerAnimFinish();
        }
    }

    private resetFramesLeft():void{
        this._framesLeft = this.currAnimFrame.frames;
    }

    private triggerAnimFinish():void{
        if(this.onAnimFinish){
            this.onAnimFinish({
                target: this,
                anim: this.currentAnimation
            });
        }
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