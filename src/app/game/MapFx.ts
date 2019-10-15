import { AnimatedSprite, AnimatedSpriteParams } from "../gfx/AnimatedSprite";

export interface MapFxParams extends AnimatedSpriteParams{
    id:string;
}

export class MapFx extends AnimatedSprite{
    private _fxId:string;

    constructor(params:MapFxParams){
        super(params);

        this._fxId = params.id;
    }

    public get fxId():string{
        return this._fxId;
    }
}