import { MapAI } from "./MapAI";
import { MapCollision } from "./MapCollision";
import { MapFxData, MapFxState } from "./MapFxData";
import { MapFxFactory } from "./MapFxFactory";
import { MapNPCs } from "./MapNPCs";
import { MapPathFinder } from "./MapPathFinder";
import { CombatEvent, DeathEvent } from "../entities/CombatObject";
import { UpdateEvent } from "../entities/Object2D";
import { NPC } from "../entities/NPC";
import { NpcFaction } from "../entities/NPCFactory";
import { Unit, UnitUpdate, UnitState } from "../entities/Unit";
import { User } from "../users/User";
import { UserUpdater } from "../users/UserUpdater";
import { TokenGenerator } from "../utils/TokenGenerator";

export type MapType = "Test";

export enum MapDifficulty{
    TRAINING = 1, STANDARD = 2, VETERAN = 3, ELITE = 4, SUICIDAL = 5
}

export type MapTileLayer = number[][];

export type MapTileLayout = MapTileLayer[];

export type MapLocation = {row:number, col:number};

export interface MapInstanceParams{
    type:MapType;
    tileLayout:MapTileLayout;
    playerSpawn:MapLocation;
    enemyFaction:NpcFaction;
    difficulty?:MapDifficulty;
    customName?:string;
    password?:string;
    populationLimit?:number;
}

export interface MapJoinData{
    tileLayout:MapTileLayout;
    objects:any[];
    units:UnitState[];
}

export interface MapSummary{
    id:string;
    type:string;
    customName:string;
    hasPassword:boolean;
    population:number;
    populationLimit:number;
    difficulty:number;
    enemyFaction:NpcFaction;
}

export type MapEmptyEvent = {target:MapInstance};

export class MapInstance{
    public static readonly TILE_SCALE:number = 64;
    public static readonly REZ_TIMEOUT:number = 10 * 1000;
    public static readonly REGEN_INTERVAL:number = 2 * 1000;

    private static readonly tokens:TokenGenerator = new TokenGenerator(8);

    private _id:string;
    private _type:MapType;
    private _playerSpawn?:MapLocation;
    private _layout:MapTileLayout;
    private _enemyFaction:NpcFaction;
    private _difficulty:MapDifficulty;
    private _customName:string;
    private _password:string;
    private _populationLimit:number;
    private _users:Map<string, User>;
    private _units:Map<string, Unit>;
    private _objects:Map<string, any>;
    private _effects:Map<string, MapFxData>;
    private _regenInterval:NodeJS.Timeout;
    private _ai:MapAI;
    private _collision:MapCollision;
    private _pathFinder:MapPathFinder;

    public onEmpty:(evt:MapEmptyEvent)=>void;

    constructor(params:MapInstanceParams){
        const {
            type, tileLayout, playerSpawn, enemyFaction,
            customName, password, populationLimit,
            difficulty
        } = params;

        this._id =          MapInstance.tokens.nextToken();
        this._type =        type;
        this._layout =      tileLayout;
        this._playerSpawn = playerSpawn || {row: 1, col: 1};

        this._difficulty =      difficulty || MapDifficulty.STANDARD;
        this._customName =      customName || type;
        this._password =        password || "";
        this._populationLimit = populationLimit || 4;
        this._enemyFaction =    enemyFaction;

        this._users =   new Map();
        this._units =   new Map();
        this._objects = new Map();
        this._effects = new Map();
        
        this._ai =          new MapAI(this);
        this._collision =   new MapCollision(this._layout[1]);
        this._pathFinder =  new MapPathFinder(this._layout[1]);

        this.onEmpty = null;

        MapNPCs.populateNPCs(this, tileLayout[3]);
        this.startRegenCycle();
    }

    public chatAll(chat:string, from?:string):void{
        this._users.forEach(user => UserUpdater.chat(user, chat, from));
    }

    public addUser(user:User, password?:string, cb?:(err?:string, data?:MapJoinData)=>void):void{
        if(this.isFull){
            if(cb) cb("Map at capacity.");
            return;
        }

        if(this._password && password !== this._password){
            if(cb) cb("Wrong password.");
            return;
        }

        if(this.hasUser(user)){
            if(cb) cb("Already in the map.")
            return;
        }

        this._users.set(user.id, user);

        if(cb) cb(null, this.getMapJoinData());

        this.addUnit(user.player, this._playerSpawn);
        user.player.onDeath = evt => this.onPlayerDeath(evt, user);

        this.chatAll(`${user.player.name} connected.`);
    }

    public removeUser(user:User, cb?:(err?:string)=>void):void{
        if(!this.hasUser(user)){
            if(cb) cb("Not in map.");
            return;
        }

        this._users.delete(user.id);
        if(cb) cb();

        this.removeUnit(user.player);
        this.chatAll(`${user.player.name} disconnected.`);   

        if(this.isEmpty && this.onEmpty){
            this.onEmpty({target: this});
        }
    }

    public addUnit(unit:Unit, location:MapLocation={row: 0, col: 0}):boolean{
        if(this.hasUnit(unit)){
            return false;
        }

        this._units.set(unit.id, unit);
        this.moveUnit(unit.id, location);

        unit.onUpdate = this.onUpdate as ()=>void;
        unit.onCombatUpdate = this.onCombatUpdate;
        unit.onDeath = this.onUnitDeath;

        const unitState:UnitState = unit.getState();
        this._users.forEach(u => UserUpdater.entityCreated(u, unitState));

        // if(unit.type === "player")
        //     this.createEffect(MapFxFactory.create("rez", unit.id));
        return true;
    }

    public removeUnit(unit:Unit):boolean{
        if(!this.hasUnit(unit)){
            return false;
        }

        unit.onUpdate = null;
        unit.onCombatUpdate = null;
        unit.onDeath = null;
        this._units.delete(unit.id);

        this._users.forEach(u => UserUpdater.entityDeleted(u, unit.id));
        return true;
    }

    public moveUnit(unitId:string, location:MapLocation):boolean{
        const unit:Unit = this._units.get(unitId);
        if(!unit){
            return false;
        }

        const {row, col} = location;

        unit.x = col * MapInstance.TILE_SCALE;
        unit.y = row * MapInstance.TILE_SCALE - unit.height;

        return true;
    }

    public createEffect(fx:MapFxData):boolean{
        if(!this._effects.has(fx.id)){
            this._effects.set(fx.id, fx);
            setTimeout(() => this._effects.delete(fx.id));

            const fxState:MapFxState = fx.getState();
            this._users.forEach(user => UserUpdater.createFx(user, fxState));
            return true;
        }
        return false;
    }

    public hasUser(user:User):boolean{
        return this._users.has(user.id);
    }

    public hasUnit(unit:Unit):boolean{
        return this._units.has(unit.id);
    }

    private onUpdate = (evt:UpdateEvent<Unit, UnitUpdate>) => {
        const {target, update} = evt;
        this._users.forEach(user => UserUpdater.entityUpdated(user, target.id, update));   
    }

    private onCombatUpdate = (evt:CombatEvent) => {
        const {target, data} = evt;
        this._users.forEach(user => UserUpdater.statsUpdated(user, target.id, data));
    }

    private onUnitDeath = (evt:DeathEvent):void => {
        const {target} = evt;
        this.removeUnit(target as Unit);

        if(target instanceof NPC){
            this._users.forEach(user => user.player.addXP(target.xpValue));
        }
    }

    private onPlayerDeath = (evt:DeathEvent, user:User):void => {
        const {target} = evt;
        this.removeUnit(target as Unit);
        this.chatAll(`${target.name} died (rez in ${MapInstance.REZ_TIMEOUT / 1000}s).`);

        setTimeout(() => {
            if(this && this._users.has(user.id)){
                this.addUnit(user.player, this._playerSpawn);
                this.createEffect(MapFxFactory.create("rez", user.player.id));
                this.chatAll(`${target.name} has been revived.`);

                user.player.health.refill();
                user.player.mana.refill();
                user.player.setState({facing: "right", anim: "idle"});
            }
        }, MapInstance.REZ_TIMEOUT);
    }

    public applySafeUserUpdate(user:User, update:any):boolean{
        const {
            id=null, x=undefined, y=undefined, anim=undefined, facing=undefined
        } = update;

        const safeUpdate = {x, y, anim, facing};

        const unit:Unit = this._units.get(id);
        if(unit){
            unit.setState(safeUpdate, false); // don't trigger update

            this._users.forEach(u => {
                if(u !== user){
                    UserUpdater.entityUpdated(u, unit.id, safeUpdate);
                }
            });
            return true;
        }
        return false;
    }

    private startRegenCycle():void{
        this._regenInterval = setInterval(() => {
            this._units.forEach(unit => {
                unit.health.modifyPercent(0.01);
                unit.mana.modifyPercent(0.01);
            });
        }, MapInstance.REGEN_INTERVAL);
    }

    public destroy():void{
        clearInterval(this._regenInterval);
        this._users.clear();
        this._units.clear();
        this._objects.clear();
        this._effects.clear();
        this.onEmpty = null;
        this.ai.destroy();
        this._ai = null
    }

    public getUnitLocation(unitId:string):MapLocation{
        const unit:Unit = this._units.get(unitId);
        return unit ? {
            row: Math.round(unit.bottom / MapInstance.TILE_SCALE),
            col: Math.round(unit.centerX / MapInstance.TILE_SCALE)
        } : null;
    }

    public getAllUnits():Unit[]{
        const units:Unit[] = new Array(this._units.size);

        let i:number = 0;
        this._units.forEach(unit => units[i++] = unit);

        return units;
    }

    public getUnit(id:string):Unit{
        return this._units.get(id);
    }

    public getSummary():MapSummary{
        const {
            id, type, population, hasPassword,
            populationLimit, difficulty, customName, enemyFaction
        } = this;

        return {
            id, type, population, populationLimit,
            customName, hasPassword, difficulty, enemyFaction
        };
    }

    private getMapJoinData():MapJoinData{
        let i:number = 0;
        let units:any[] = new Array(this._units.size);
        this._units.forEach(unit => units[i++] = unit.getState());
    
        i = 0;
        let objects:any[] = new Array(this._objects.size);
        this._objects.forEach(object => objects[i++] = object.getState());

        return {
            tileLayout: this._layout.slice(0, 3),
            units,
            objects
        };
    }

    public also(cb?:(it?:MapInstance)=>void):MapInstance{
        cb(this);
        return this;
    }

    public get id():string{
        return this._id;
    }

    public get type():MapType{
        return this._type;
    }

    public get difficulty():MapDifficulty{
        return this._difficulty;
    }

    public get customName():string{
        return this._customName;
    }

    public get enemyFaction():NpcFaction{
        return this._enemyFaction;
    }

    public get population():number{
        return this._users.size;
    }

    public get populationLimit():number{
        return this._populationLimit;
    }

    public get hasPassword():boolean{
        return this._password.length > 0;
    }

    public get isFull():boolean{
        return this.population >= this.populationLimit;
    }

    public get isEmpty():boolean{
        return this.population === 0;
    }

    public get ai():MapAI{
        return this._ai;
    }

    public get collision():MapCollision{
        return this._collision;
    }

    public get pathFinder():MapPathFinder{
        return this._pathFinder;
    }
}