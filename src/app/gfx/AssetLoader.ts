import { json } from "body-parser";

export interface LoadAssets{
    images?:string[];
    sounds?:string[];
    json?:string[];
}

export class AssetLoader{
    private static imageCache:Map<string, HTMLImageElement> = new Map();
    private static soundCache:Map<string, HTMLAudioElement> = new Map();
    private static jsonCache:Map<string, any> = new Map();

    public static loadImage(src:string, cb?:(err?:ErrorEvent, image?:HTMLImageElement)=>void):void{
        if(this.imageCache.has(src)){
            if(cb){
                cb(null, this.imageCache.get(src));
            }
            return;
        }

        const img:HTMLImageElement = document.createElement("img");

        img.addEventListener("load", () => {
            this.imageCache.set(src, img);

            if(cb){
                cb(null, img);
            }
        });

        img.addEventListener("error", err => {
            if(cb){
                cb(err);
            }
        });

        img.setAttribute("src", src);
    }

    public static loadSound(src:string, cb?:(err?:ErrorEvent, audio?:HTMLAudioElement)=>void):void{
        if(this.soundCache.has(src)){
            if(cb){
                cb(null, this.soundCache.get(src));
            }
            return;
        }

        const audio:HTMLAudioElement = document.createElement("audio");

        audio.addEventListener("load", () => {
            this.soundCache.set(src, audio);

            if(cb){
                cb(null, audio);
            }
        });

        audio.addEventListener("error", err => {
            if(cb){
                cb(err);
            }
        });

        audio.setAttribute("src", src);
    }

    public static loadJson<T=any>(src:string, cb?:(err?:ErrorEvent, json?:T)=>void):void{
        if(this.jsonCache.has(src)){
            if(cb){
                cb(null, this.jsonCache.get(src));
            }
            return;
        }

        fetch(src, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        }).then(res => {
            res.json().then(json => {
                this.jsonCache.set(src, json);

                if(cb){
                    cb(null, json);
                }
            }).catch(err => {
                if(err){
                    cb(err);
                }
            });
        }).catch(err => {
            if(cb){
                cb(err);
            }
        });
    }

    public static loadMany(params:LoadAssets, cb?:(errSrcs:string[])=>void):void{
        const {
            images=[], sounds=[], json=[]
        } = params;

        const total:number = images.length + sounds.length + json.length;

        if(!total){
            cb([]);
            return;
        }

        let errs:string[] = [];
        let done:number = 0;

        const onDone = (src:string, err?:ErrorEvent) => {
            if(err){
                errs.push(src);
            }

            if(++done === total && cb){
                cb(errs);
            }
        };

        images.forEach(src => this.loadImage(src, err => onDone(src, err)));
        sounds.forEach(src => this.loadSound(src, err => onDone(src, err)));
        json.forEach(src => this.loadJson(src, err => onDone(src, err)));
    }

    public static isImageCached(src:string):boolean{
        return this.imageCache.has(src);
    }

    public static isSoundCached(src:string):boolean{
        return this.soundCache.has(src);
    }

    public static isJsonCached(src:string):boolean{
        return this.jsonCache.has(src);
    }

    public static clearImageCache():void{
        this.imageCache.clear();
    }

    public static clearSoundCache():void{
        this.soundCache.clear();
    }

    public static clearJsonCache():void{
        this.jsonCache.clear();
    }

    public static getCachedImage(src:string):HTMLImageElement{
        return this.imageCache.get(src);
    }

    public static getCachedSound(src:string):HTMLAudioElement{
        return this.soundCache.get(src);
    }

    public static getCachedJson<T=any>(src:string):T{
        return this.jsonCache.get(src);
    }
    
    public static get numCachedImages():number{
        return this.imageCache.size;
    }

    public static get numCachedSounds():number{
        return this.soundCache.size;
    }

    public static get numCachedJson():number{
        return this.jsonCache.size;
    }
}