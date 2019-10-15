import { Entity2D, Entity2DParams, Entity2DState, Entity2DUpdate } from "./Entity2D";
import { TokenGenerator } from "../utils/TokenGenerator";

export type Facing = "left" | "right";
export type Anim = "idle" | "run" | "attack";

export interface GameEntityParams extends Entity2DParams{
    name:string;
    type:string;
    ownerId:string;
    faction:string;
    moveSpeed?:number;
    anim?:Anim;
    facing?:Facing;
}

export interface GameEntityState extends Entity2DState{
    id:string;
    ownerId?:string;
    name:string;
    type:string;
    faction:string;
    moveSpeed:number;
    anim:Anim;
    facing:Facing;
}

export interface GameEntityData{
    moveSpeed?:number;
    anim?:Anim;
    facing?:Facing;
}

export type GameEntityUpdate = Entity2DUpdate & GameEntityData;

export class GameEntity extends Entity2D{
    private static readonly tokens:TokenGenerator = new TokenGenerator(12);

    private _id:string;
    private _ownerId:string;
    private _name:string;
    private _type:string;
    private _faction:string;
    private _moveSpeed:number;
    private _anim:Anim;
    private _facing:Facing;


    constructor(params:GameEntityParams){
        super(params);

        const {
            name, type, faction, ownerId="server", moveSpeed=1, anim="idle", facing="right"
        } = params;

        this._id =          GameEntity.tokens.nextToken();
        this._ownerId =     ownerId;
        this._name =        name;
        this._type =        type;
        this._faction =     faction;
        this._moveSpeed =   moveSpeed;
        this._anim =        anim;
        this._facing =      facing;
    }

    public lookAt(target:GameEntity):void{
        if(this.isLeftOf(target))
            this.facing = "right";

        else if(this.isRightOf(target))
            this.facing = "left";
    }

    public setState(update:GameEntityUpdate, triggerUpdate:boolean=true):void{
        if(typeof update.anim === "string")
            this._anim = update.anim;

        if(typeof update.facing === "string")
            this._facing = update.facing;

        if(typeof update.moveSpeed === "number")
            this._moveSpeed = update.moveSpeed;

        super.setState(update, triggerUpdate);
    }

    public getState():GameEntityState{
        const {
            id, name, type, faction, ownerId, moveSpeed, anim, facing
        } = this;

        return {
            ...super.getState(), id, name, faction, ownerId, type, moveSpeed, anim, facing
        };
    }

    public set moveSpeed(val:number){
        val = Math.abs(val);
        this._moveSpeed = val;
        this.triggerUpdate<GameEntityUpdate>({moveSpeed: val});
    }

    public set anim(val:Anim){
        this._anim = val;
        this.triggerUpdate<GameEntityUpdate>({anim: val});
    }

    public set facing(val:Facing){
        this._facing = val;
        this.triggerUpdate<GameEntityUpdate>({facing: val});
    }

    public get id():string{
        return this._id;
    }

    public get ownerId():string{
        return this._ownerId;
    }

    public get name():string{
        return this._name;
    }

    public get type():string{
        return this._type;
    }

    public get faction():string{
        return this._faction;
    }

    public get moveSpeed():number{
        return this._moveSpeed;
    }

    public get anim():Anim{
        return this._anim;
    }

    public get facing():Facing{
        return this._facing;
    }
}