import { AnimatedSprite } from "./AnimatedSprite";
import { frame } from "websocket";

export interface AnimationKeyFrame{
    x:number;
    y:number;
    width:number;
    height:number;
    frames:number;
}

export type AnimationLibrary = {[animation:string]: AnimationKeyFrame[]};

export interface AnimationJson{
    frames: {[anim:string]: AnimationFrameJson}
    meta: {
        app:string;
        version:string;
        image:"string";
        format:string;
        size:{w:number, h:number}
        scale:number
    }
}

export interface AnimationFrameJson{
    frame:{x:number, y:number, w:number, h:number};
    rotated:boolean;
    trimmed:boolean;
    sourceSize:{w:number, h:number};
}

export class AnimationLoader{
    public static loadJson(data:AnimationJson, options:{[anim:string]: {frameCount?:number}}={}):AnimationLibrary{
        const {frames} = data;
        const animLib:AnimationLibrary = {};

        let animName:string;
        let keyFrame:AnimationKeyFrame;

        for(let frameName in frames){
            keyFrame = this.loadJsonFrame(frames[frameName]);
            animName = this.extractAnimName(frameName);

            if(animName in animLib === false){
                animLib[animName] = [];
            }
            
            animLib[animName].push(keyFrame);
        }

        let frameCount:number;

        for(let anim in animLib){
            frameCount = (anim in options) ? options[anim].frameCount : AnimatedSprite.FRAMES_PER_ANIM; 
            animLib[anim].forEach(frame => frame.frames = Math.round(frameCount / animLib[anim].length));
        }

        return animLib;
    }

    private static loadJsonFrame(jsonFrame:AnimationFrameJson):AnimationKeyFrame{
        const { 
            x, y, w, h
        } = jsonFrame.frame;

        return {
            x,
            y,
            width: w,
            height: h,
            frames: 1
        };
    }

    private static extractAnimName(frameName:string):string{
        const buf:string[] = [];

        for(let i:number = 0; i < frameName.length; i++){
            if(frameName[i] === " "){
                break;
            }
            
            buf.push(frameName[i]);
        }

        return buf.join("");
    }

    private static extractFrameNum(frameName:string):number{
        const buf:string[] = [];

        for(let i:number = frameName.length - 1; i >= 0; i--){
            if(frameName[i] === " "){
                break;
            }

            buf.push(frameName[i]);
        }

        return parseInt(buf.join(""));
    }
}