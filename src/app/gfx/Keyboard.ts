export class Keyboard{
    private _keys:Map<string, boolean>;
    private _element:HTMLElement;

    public onKey:(evt:KeyboardEvent)=>void;

    constructor(element?:HTMLElement){
        this._keys = new Map();
        this._element = element || document.body;

        this.onKey = null;

        this._element.addEventListener("keyup", this.onKeyUp);
        this._element.addEventListener("keydown", this.onKeyDown);
    }

    public stop():void{
        this._element.removeEventListener("keyup", this.onKeyUp);
        this._element.removeEventListener("keydown", this.onKeyDown);
        this.onKey = null;
    }

    private onKeyUp = (evt:KeyboardEvent):void => {
        this.forceKeyUp(evt.key);
        
        if(this.onKey){
            this.onKey(evt);
        }
    }

    private onKeyDown = (evt:KeyboardEvent):void => {
        this.forceKeyDown(evt.key);
    }

    public forceKeyUp(key:string):void{
        this._keys.delete(key);
    }

    public forceKeyDown(key:string):void{
        this._keys.set(key, true);
    }

    public isKeyUp(key:string):boolean{
        return !this._keys.has(key);
    }

    public isKeyDown(key:string):boolean{
        return this._keys.has(key);
    }

    public anyKeysUp(keys:Iterable<string>):boolean{
        for(let key of keys){
            if(this.isKeyUp(key)){
                return true;
            }
        }
        return false;
    }

    public anyKeysDown(keys:Iterable<string>):boolean{
        for(let key of keys){
            if(this.isKeyDown(key)){
                return true;
            }
        }
        return false;
    }

    public allKeysUp(keys:Iterable<string>):boolean{
        return !this.anyKeysDown(keys);
    }

    public allKeysDown(keys:Iterable<string>):boolean{
        return !this.anyKeysUp(keys);
    }

    public get numActiveKeys():number{
        return this._keys.size;
    }
}