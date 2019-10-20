import { Object2D, Object2DParams, Object2DState, Object2DUpdate } from "./Object2D";
import { TokenGenerator } from "../utils/TokenGenerator";

/**
 * GameObject facing values
 */
export type Facing = "left" | "right";

/**
 * GameObject animation values
 */
export type Anim = "idle" | "run" | "attack";

/**
 * GameObject constructor parameters
 */
export interface GameObjectParams extends Object2DParams{
    name:string;
    type:string;
    ownerId:string;
    faction:string;
    moveSpeed?:number;
    anim?:Anim;
    facing?:Facing;
}

/**
 * GameObject state representation
 */
export interface GameObjectState extends Object2DState{
    id:string;
    ownerId?:string;
    name:string;
    type:string;
    faction:string;
    moveSpeed:number;
    anim:Anim;
    facing:Facing;
}

/**
 * Update data specific to the GameObject class
 */
export interface GameObjectData{
    moveSpeed?:number;
    anim?:Anim;
    facing?:Facing;
}

/**
 * GameObject update includes GameObject-specific and inherited update data
 */
export type GameObjectUpdate = GameObjectData & Object2DUpdate;

export class GameObject extends Object2D{
    private static readonly tokens:TokenGenerator = new TokenGenerator(12);

    private _id:string;
    private _ownerId:string;
    private _name:string;
    private _type:string;
    private _faction:string;
    private _moveSpeed:number;
    private _anim:Anim;
    private _facing:Facing;


    /**
     * Constructs a game object
     * @param params game object parameters
     */
    constructor(params:GameObjectParams){
        super(params);

        const {
            name, type, faction, ownerId="server", moveSpeed=1, anim="idle", facing="right"
        } = params;

        this._id =          GameObject.tokens.nextToken();
        this._ownerId =     ownerId;
        this._name =        name;
        this._type =        type;
        this._faction =     faction;
        this._moveSpeed =   moveSpeed;
        this._anim =        anim;
        this._facing =      facing;
    }

    /**
     * Changes the facing direction so this object is looking at the target
     * @param target object to look at
     */
    public lookAt(target:GameObject):void{
        if(this.isLeftOf(target))
            this.facing = "right";

        else if(this.isRightOf(target))
            this.facing = "left";
    }

    /**
     * Applies multiple updates (all fields are optional)
     * @param update            update object to safely merge with state
     * @param triggerUpdate     true/false if update event should be triggered
     */
    public setState(update:GameObjectUpdate, triggerUpdate:boolean=true):void{
        if(typeof update.anim === "string")
            this._anim = this.sanitizeAnim(update.anim);

        if(typeof update.facing === "string")
            this._facing = update.facing;

        if(typeof update.moveSpeed === "number")
            this._moveSpeed = update.moveSpeed;

        super.setState(update, triggerUpdate);
    }

    /**
     * Returns the anim if it is clean, otherwise the current value.
     * @param anim The unclean animation.
     * @returns Clean anim or current.
     */
    private sanitizeAnim(anim:string):Anim{
        if(anim !== "idle" && anim !== "run" && anim !== "attack")
            return this.anim;
        else
            return anim;
    }

    /**
     * Gets an object that represents the current state
     */
    public getState():GameObjectState{
        const {
            id, name, type, faction, ownerId, moveSpeed, anim, facing
        } = this;

        return {
            ...super.getState(), id, name, faction, ownerId, type, moveSpeed, anim, facing
        };
    }

    /**
     * Setter for the move speed, enforces positive value and triggers update
     */
    public set moveSpeed(val:number){
        val = Math.abs(val);
        this._moveSpeed = val;
        this.triggerUpdate<GameObjectUpdate>({moveSpeed: val});
    }

    /**
     * Setter for the new animatio, triggers update
     */
    public set anim(val:Anim){
        this._anim = this.sanitizeAnim(val);
        this.triggerUpdate<GameObjectUpdate>({anim: val});
    }

    /**
     * Setter for the new facing direction, triggers update
     */
    public set facing(val:Facing){
        this._facing = val;
        this.triggerUpdate<GameObjectUpdate>({facing: val});
    }

    /**
     * Getter for the object guid
     * @returns object guid
     */
    public get id():string{
        return this._id;
    }

    /**
     * Getter for the owner id (most cases server or clientId)
     * @returns owner id
     */
    public get ownerId():string{
        return this._ownerId;
    }

    /**
     * Getter for the proper name
     * @returns display name
     */
    public get name():string{
        return this._name;
    }

    /**
     * Getter for the entity type
     * @returns type
     */
    public get type():string{
        return this._type;
    }

    /**
     * Getter for the faction (team name)
     * @returns faction's display name
     */
    public get faction():string{
        return this._faction;
    }

    /**
     * Getter for the move speed
     * @returns movement speed
     */
    public get moveSpeed():number{
        return this._moveSpeed;
    }

    /**
     * Getter for the animation
     * @returns animation
     */
    public get anim():Anim{
        return this._anim;
    }

    /**
     * Getter for the facing direction
     * @returns facing direction
     */
    public get facing():Facing{
        return this._facing;
    }
}