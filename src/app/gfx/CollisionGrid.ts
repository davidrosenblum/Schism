import { Object2D } from "./Object2D";

export class CollisionGrid{
    private _grid:Map<string, Object2D>;
    private _tileSize:number;

    constructor(tileSize:number){
        this._grid = new Map();
        this._tileSize = tileSize;
    }

    public storeAt(row:number, col:number, object:Object2D):void{
        this._grid.set(this.coordToKey(row, col), object);
    }

    public getAt(row:number, col:number):Object2D{
        return this._grid.get(this.coordToKey(row, col));
    }

    public getAdjacentAt(row:number, col:number):Object2D[]{
        return [
            this.getAt(row + 1, col + 1),
            this.getAt(row + 1, col),
            this.getAt(row + 1, col - 1),
            this.getAt(row, col + 1),
            this.getAt(row, col),
            this.getAt(row, col - 1),
            this.getAt(row - 1, col + 1),
            this.getAt(row - 1, col),
            this.getAt(row - 1, col - 1)
        ];
    }

    public getAdjacentTo(object:Object2D):Object2D[]{
        const row:number = Math.round(object.drawBox.y / this.tileSize);
        const col:number = Math.round(object.drawBox.x / this.tileSize);
        return this.getAdjacentAt(row, col);
    }

    public coordToKey(row:number, col:number):string{
        return `${row}-${col};`
    }

    public get tileSize():number{
        return this._tileSize;
    }
}