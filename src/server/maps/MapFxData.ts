import { TokenGenerator } from "../utils/TokenGenerator";

export type MapFxType = (
    "death" | "levelup" | "rez"
);

export interface MapFxParams{
    type:MapFxType;
    targetId:string;
    width:number;
    height:number;
}

export interface MapFxState{
    id:string;
    type:MapFxType;
    targetId:string;
    width:number;
    height:number;
}

export class MapFxData{
    private static readonly tokens:TokenGenerator = new TokenGenerator(8);

    private _id:string;
    private _type:MapFxType;
    private _targetId:string;
    private _width:number;
    private _height:number;

    /**
     * Construcs a Map FX Data object.
     * @param type      Enumerated map effect type.
     * @param duration  How long the effect lasts for (seconds).
     */
    constructor(params:MapFxParams){
        const {
            type, targetId, width, height
        } = params;

        this._id = MapFxData.tokens.nextToken();
        this._type = type;
        this._targetId = targetId;
        this._width = width;
        this._height = height;
    }

    /**
     * Gets an object that represents the state of the effect.
     * @return The state object.
     */
    public getState():MapFxState{
        const {
            id, type, targetId, width, height
        } = this;

        return {
            id, type, targetId, width, height
        };
    }

    /**
     * Getter for the effect guid.
     * @returns The effect guid.
     */
    public get id():string{
        return this._id;
    }

    /**
     * Getter for the effect type.
     * @returns The enumerated effect type.
     */
    public get type():MapFxType{
        return this._type;
    }

    /**
     * Getter for the target object id.
     * @returns The target object id.
     */
    public get targetId():string{
        return this._targetId;
    }

    /**
     * Getter for the width.
     * @returns The width.
     */
    public get width():number{
        return this._width;
    }

    /**
     * Getter for the height.
     * @returns The height.
     */
    public get height():number{
        return this._width;
    }
}