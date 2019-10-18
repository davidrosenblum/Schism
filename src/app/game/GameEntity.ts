import { GameEntityStats, GameEntityStatsState, GameEntityStatsUpdate } from "./GameEntityStats";
import { AbilityState } from "../data/Payloads";
import { GameObject, GameObjectParams, Facing } from "../gfx/GameObject";
import { TextField } from "../gfx/TextField";

export interface GameEntityParams extends GameObjectParams, GameEntityStatsUpdate{
    id:string;
    type:string;
    abilities:AbilityState[];
}

export interface GameEntityState extends GameEntitySyncState, GameEntityStatsState{
    type:string;
}

export interface GameEntityUpdate extends GameEntityStatsUpdate{
    x?:number;
    y?:number;
    anim?:string;
    facing?:Facing;
    moveSpeed?:number;
}

export interface GameEntitySyncState{
    id:string;
    x:number;
    y:number;
    anim:string;
    facing:string;
}

export class GameEntity extends GameObject{
    private _gameId:string;
    private _type:string;
    private _nameTag:TextField;
    private _stats:GameEntityStats;
    private _abilities:AbilityState[];
    private _internalAnim:string;

    constructor(params:GameEntityParams){
        super(params);

        const {
            id, type, name, abilities, defaultAnimation, faction
        } = params;

        this._gameId =          id;
        this._type =            type;
        this._nameTag =         null;
        this._stats =           new GameEntityStats(params);
        this._abilities =       abilities
        this._internalAnim =    null;

        this.setNameTag(name);

        if(defaultAnimation){
            this.playAnimation(defaultAnimation);
        }
    }

    private beforeNameTagDraw = (ctx:CanvasRenderingContext2D, offsetX:number, offsetY:number):void => {
        const {
            faction, health, healthCap, mana, manaCap
        } = this._stats.getState();

        const w:number = this.drawBox.width;
        const h:number = 5;
        const y2:number = offsetY - h;  // health
        const y1:number = y2 - h;       // mana

        ctx.save();

        ctx.strokeStyle = "black"
        ctx.strokeRect(offsetX, y1, w, h);

        ctx.fillStyle = (faction === "Players") ? "darkgreen" : "darkred";
        ctx.fillRect(offsetX, y1, w, h);

        ctx.fillStyle = (faction === "Players") ? "lime" : "red";
        ctx.fillRect(offsetX, y1, Math.max(w * (health / healthCap), 0), h);

        ctx.fillStyle = "blue";
        ctx.fillRect(offsetX, y2, w, h);

        ctx.fillStyle = "royalblue";
        ctx.fillRect(offsetX, y2, Math.max(w * (mana / manaCap), 0), h);

        ctx.strokeStyle = "black";
        ctx.strokeRect(offsetX, y1, w, h);
        ctx.strokeRect(offsetX, y2, w, h);

        ctx.restore();
    }

    public playAnimation(animName:string):boolean{
        if(super.playAnimation(`${this.facing}_${animName}`)){
            this._internalAnim = animName; // used for sync - serer wants idle not left_idle (ex)
            return true;
        }
        return false;
    }

    public setNameTag(name?:string):void{
        if(this._nameTag){
            this._nameTag.remove();
            this._nameTag.beforeDraw = null;
            this._nameTag = null;
        }

        if(name){
            this._nameTag = new TextField({text: name, y: -15});
            this._nameTag.beforeDraw = this.beforeNameTagDraw;
            this.addChild(this._nameTag);
            this._nameTag.centerText();
        }
    }

    public setState(update:GameEntityUpdate):void{
        if(typeof update.x === "number") 
            this.drawBox.x = update.x;

        if(typeof update.y === "number")
            this.drawBox.y = update.y;

        if(typeof update.facing === "string")
            this.facing = update.facing;

        if(typeof update.moveSpeed === "number")
            this.moveSpeed = update.moveSpeed;

        if(typeof update.anim === "string")
            this.playAnimation(update.anim);
    }

    public setStats(update:GameEntityStatsUpdate):void{
        this._stats.setState(update);
    }

    public getState():GameEntityState{
        return {
            ...this.getSyncState(),
            ...this._stats.getState(),
            type: this.type
        };
    }

    public getSyncState():GameEntitySyncState{
        const {
            gameId, facing
        } = this;

        return {
            id: gameId, x: this.drawBox.x, y: this.drawBox.y, anim: this._internalAnim, facing
        };
    }

    public get gameId():string{
        return this._gameId;
    }

    public get type():string{
        return this._type;
    }

    public get nameTag():TextField{
        return this._nameTag;
    }

    public get abilities():AbilityState[]{
        return this._abilities;
    }
}