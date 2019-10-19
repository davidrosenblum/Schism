export interface Point{
    x:number;
    y:number;
}

export class Box implements Point{
    public x:number;
    public y:number;
    public width:number;
    public height:number;

    constructor(width:number, height:number, x:number=0, y:number=0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public hitboxTest(target:Box):boolean{
        return this.x < target.right && target.x < this.right &&
            this.y < target.bottom && target.y < this.bottom;
    }

    public hitboxTestMany(targets:Iterable<Box>):Box{
        for(let target of targets){
            if(this.hitboxTest(target)){
                return target;
            }
        }
        return null;
    }

    public setPosition(x:number, y:number):void{
        this.x = x;
        this.y = y;
    }

    public setSize(width:number, height:number):void{
        this.width = width;
        this.height = height;
    }

    public clone(translateX:number=0, translateY:number=0):Box{
        const {
            x, y, width, height
        } = this;

        return new Box(width, height, x + translateX, y + translateY);
    }

    public toPoint():Point{
        return {
            x: this.x,
            y: this.y
        };
    }

    public get right():number{
        return this.x + this.width;
    }

    public get bottom():number{
        return this.y + this.height;
    }

    public get centerX():number{
        return this.x + this.width / 2;
    }

    public get centerY():number{
        return this.y + this.height /  2;
    }

    public get aspectRatio():number{
        return this.width / this.height;
    }
}