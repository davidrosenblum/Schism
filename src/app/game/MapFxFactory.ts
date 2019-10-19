import { AssetsManager } from "./AssetsManager";
import { AnimationLibrary, AnimationLoader } from "../gfx/AnimationLoader";
import { AnimatedSprite } from "../gfx/AnimatedSprite";

export interface MapFxParams{
    id:string;
    width:number;
    height:number;
}

interface FxPartialData{
    imageSrc:string;
    animations:AnimationLibrary;
}

const fxTypes:{[fxType:string]: ()=>FxPartialData} = {
    "levelup": () => ({
        imageSrc: AssetsManager.getImageSrc("fx_levelup"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("fx_levelup"))
    }),
    "rez": () => ({
        imageSrc: AssetsManager.getImageSrc("fx_rez"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("fx_rez"), {"rez": {frameCount: 90}})
    }),
};

export class MapFxFactory{
    public static create(type:string, params:MapFxParams):AnimatedSprite{
        if(type in fxTypes === false)
            return null;

        const {imageSrc, animations} = fxTypes[type]();

        const fx:AnimatedSprite = new AnimatedSprite({
            ...params,
            imageSrc,
            animations
        });

        fx.playAnimation(type);

        return fx;
    }
}