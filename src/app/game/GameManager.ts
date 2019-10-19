import { GameEntity } from "./GameEntity";
import { GameEntityFactory } from "./GameEntityFactory";
import { MapTileFactory } from "./MapTileFactory";
import { store } from "../Client";
import { setTargetData } from "../actions/GameStatsActions";
import { MapJoinData } from "../data/Payloads";
import { AnimatedSprite } from "../gfx/AnimatedSprite";
import { Box } from "../gfx/Box";
import { CollisionGrid } from "../gfx/CollisionGrid";
import { Object2DContainer } from "../gfx/Object2DContainer";
import { Facing } from "../gfx/GameObject";
import { Keyboard } from "../gfx/Keyboard";
import { MapLoader } from "../gfx/MapLoader";
import { Renderer } from "../gfx/Renderer";
import { Scroller } from "../gfx/Scroller";
import { MapFxFactory } from "./MapFxFactory";
import { GameSocket } from "./GameSocket";
import { requestAbilityCast } from "../requests/AbilityRequests";


export const CANVAS_WIDTH:number = 960;
export const CANVAS_HEIGHT:number = 540;

export const TILE_SIZE:number = 64;
export const GROUND_OFFSET:number = 16;

class GameManagerType{
    private _layers:Object2DContainer[];
    private _renderer:Renderer;
    private _keyboard:Keyboard;
    private _scroller:Scroller;
    private _mapBounds:Box;
    private _collisionGrid:CollisionGrid;
    private _ents:Map<string, GameEntity>;
    private _objects:Map<string, any>;
    private _fxs:Map<string, AnimatedSprite>;
    private _player:GameEntity;
    private _target:GameEntity;
    private _ready:boolean;
    private _taskBuffer:Function[];

    public clientId:string;

    constructor(){
        this._layers =      [new Object2DContainer(), new Object2DContainer(), new Object2DContainer()];
        this._renderer =    null;
        this._keyboard =    null;
        this._scroller =    null;
        this._mapBounds =   null;
        this._ents =        new Map();  // different characters
        this._objects =     new Map();  // interactable map objects
        this._fxs =         new Map();  // spell fxs
        this._player =      null;
        this._target =      null;
        this._ready =       false;
        this._taskBuffer =  [];

        this.clientId =     null;
    }

    public loadMap(data:MapJoinData, canvas?:HTMLCanvasElement):void{
        const {
            tileLayout, units, objects
        } = data;

        const gmd = MapLoader.load({
            layout:         tileLayout,
            cellSize:       TILE_SIZE,
            groundOffset:   GROUND_OFFSET, 
            containers:     this._layers,
            getTile:        MapTileFactory.create
        });

        const {
            collisionGrid, mapWidth, mapHeight
        } = gmd; 

        this._mapBounds = new Box(mapWidth, mapHeight);
        this._collisionGrid = collisionGrid;

        this._keyboard = new Keyboard();
        this._keyboard.onKey = this.onKey;

        this._renderer = new Renderer(CANVAS_WIDTH, CANVAS_HEIGHT, canvas);
        this._scroller = new Scroller(this._renderer, this._mapBounds);

        units.forEach(unit => this.createEntity(unit));
        objects.forEach(object => this.createObject(object));

        this._ready = true;
        this._taskBuffer.forEach(task => task());
        this._taskBuffer = [];

        this._renderer.beforeRender = this.onRenderFrame;
        this._renderer.render(this._layers);
    }

    public unloadMap():void{
        this._ready = false;
        this._taskBuffer = [];

        this._renderer.stop();
        this._renderer.beforeRender = null;
        this._renderer = null;

        this._keyboard.stop();
        this._keyboard.onKey = null;
        this._keyboard = null;

        this._scroller = null;
        this._mapBounds = null;
        this._collisionGrid = null;
        this._player = null;
        this._target = null;

        this.selectTarget(null);

        this.background.removeChildren();
        this.scene.removeChildren();
        this.foreground.removeChildren();

        this._ents.clear();
        this._objects.clear();
        this._fxs.clear();
    }

    public createEntity(data:any):boolean{
        if(!this._ready){
            this._taskBuffer.push(() => this.createEntity(data));
            return;
        }

        if(this._ents.has(data.id)){
            return;
        }

        const type:string = data.type === "player" ? `player${data.archetype}` : data.type;
        const ent:GameEntity = GameEntityFactory.create(type, data);
        if(ent){
            this._ents.set(ent.gameId, ent);
            this.scene.addChild(ent);
            ent.onClick = () => this.selectTarget(ent);
            this.scene.depthSort();

            if(data.ownerId === GameManager.clientId){
                this._player = ent;
                this._scroller.lookAt(this._player.drawBox.centerX, this._player.drawBox.centerY);
            }

            return true;
        }
        return false;
    }

    public deleteEntity(id:string):boolean{
        if(!this._ready){
            this._taskBuffer.push(() => this.deleteEntity(id));
            return;
        }

        const ent:GameEntity = this._ents.get(id);
        if(ent){
            this._ents.delete(id);
            ent.remove();

            if(this._player && ent === this._player)
                this._player = null;

            if(this._target && ent === this._target)
                this.selectTarget(null);

            return true;
        }
        return false;
    }

    public updateEntity(data:any):boolean{
        if(!this._ready){
            this._taskBuffer.push(() => this.updateEntity(data));
            return;
        }

        const ent:GameEntity = this._ents.get(data.id);
        if(ent){
            ent.setState(data);
            this.scene.depthSort();
            return true;
        }
        return false;
    }

    public updateStats(data:any):boolean{
        if(!this._ready){
            this._taskBuffer.push(() => this.updateStats(data));
            return;
        }

        const ent:GameEntity = this._ents.get(data.id);
        if(ent){
            ent.setStats(data);
            return true;
        }
        return false;
    }

    public createObject(data:any):void{

    }

    public deleteObject(id:string):void{
        const object:any = this._objects.get(id);
        if(object){
            this._objects.delete(id);
            object.remove();
        }
    }

    public createFx(data:any):void{
        const target:AnimatedSprite = this._ents.get(data.targetId);
        if(!target)
            return;
        
        const fx:AnimatedSprite = MapFxFactory.create(
            data.type,
            {...data, width: target.drawBox.width, height: target.drawBox.height}
        );

        if(!fx)
            return;

        this._fxs.set(data.id, fx);
        target.addChild(fx);

        fx.onAnimFinish = (evt) => {
            if(evt.anim === data.type){
                this._fxs.delete(data.id);
                fx.remove();
                fx.onAnimFinish = null;
            }
        };
        fx.playAnimation(data.type);
    }

    private selectTarget(ent:GameEntity):void{
        if(this._target)
            this._target.beforeDraw = null;

        if(ent){
            store.dispatch(setTargetData(ent.getState()));

            ent.beforeDraw = (ctx, ox, oy) => {
                const pfaction:string = this._player ? this._player.getState().faction : "";

                const x:number = ent.drawBox.x + ox - 5;
                const y:number = ent.drawBox.y + oy - 5;
                const w:number = ent.drawBox.width + 10;
                const h:number = ent.drawBox.height + 10;

                ctx.save();
                ctx.strokeStyle = (ent.getState().faction === pfaction) ? "green" : "red";
                ctx.strokeRect(x, y, w, h);
                ctx.restore();
            };
        }
        else{
            store.dispatch(setTargetData(null));
        }

        this._target = ent;
    }

    public toggleGrid():void{
        if(this._renderer.showGrid){
            this._renderer.showGrid = null;
        }
        else{
            this._renderer.showGrid = {
                rows: 25, cols: 25, tileSize: TILE_SIZE
            };
        }
    }

    private onRenderFrame = ():void => {
        if(this._keyboard.numActiveKeys === 0 || document.activeElement instanceof HTMLInputElement || !this._player){
            return;
        }

        const prevFacing:Facing = this._player.facing;
        let moved:boolean = false;

        if(this._keyboard.isKeyDown("w")){
            this._player.moveUp(this._collisionGrid, this._mapBounds, this._scroller);
            this._player.facing = prevFacing;
            this._player.playAnimation("run");
            moved = true;
        }
        else if(this._keyboard.isKeyDown("s")){
            this._player.moveDown(this._collisionGrid, this._mapBounds, this._scroller);
            this._player.facing = prevFacing;
            this._player.playAnimation("run");
            moved = true;
        }

        if(this._keyboard.isKeyDown("a")){
            this._player.moveLeft(this._collisionGrid, this._mapBounds, this._scroller);
            this._player.playAnimation("run");
            moved = true;
        }
        else if(this._keyboard.isKeyDown("d")){
            this._player.moveRight(this._collisionGrid, this._mapBounds, this._scroller);
            this._player.playAnimation("run");
            moved = true;
        }

        if(moved){
            GameSocket.playerUpdate(this._player.getSyncState());
            this._player.parent.depthSort();
        }
    }

    private onKey = (evt:KeyboardEvent):void => {
        if(evt.target instanceof HTMLInputElement === false){
            const isAbKey:boolean = evt.key === "1" || evt.key === "2" || evt.key === "3" || evt.key === "4";

            if(this._player && isAbKey){
                const keyToNum:number = parseInt(evt.key);
                const index:number = isNaN(keyToNum) ? 0 : (keyToNum - 1);

                if(index in this._player.abilities){
                    requestAbilityCast(this._player.abilities[index].internalName);
                }
            }
            else if(evt.key === "\\"){
                this.toggleGrid();
            }
            else if(evt.key === "0"){
                this._renderer.showHitBoxes = !this._renderer.showHitBoxes;
            }
        }

        if(this._player && this._player.playAnimation("idle")){
            GameSocket.playerUpdate(this._player.getSyncState());
            this._player.parent.depthSort();
        }
    }

    public get playerId():string{
        return this._player ? this._player.gameId : null;
    }

    public get targetId():string{
        return this._target ? this._target.gameId : null;
    }

    private get background():Object2DContainer{
        return this._layers[0];
    }

    private get scene():Object2DContainer{
        return this._layers[1];
    }

    private get foreground():Object2DContainer{
        return this._layers[2];
    }

    public get inGame():boolean{
        return this._ready;
    }
}

export const GameManager = new GameManagerType();