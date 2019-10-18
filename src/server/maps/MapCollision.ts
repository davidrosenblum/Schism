import { MapTileLayer, MapInstance, MapLocation } from "./MapInstance";
import { Object2D } from "../entities/Object2D";

export class MapCollision{
    private _grid:Object2D[][];

    /**
     * Constructs a Map Collision object
     * @param collisionLayer    map layout collision data
     */
    constructor(collisionLayer:MapTileLayer){
        this.buildGrid(collisionLayer);
    }

    /**
     * Helper method for creating and setting a usable grid representation of the collision data
     * @param collisionLayer map collision layer data
     */
    private buildGrid(collisionLayer:MapTileLayer):void{
        // map tile scale
        const scale:number = MapInstance.TILE_SCALE;

        // grid is a matrix
        this._grid = new Array(collisionLayer.length);

        // populate each row
        collisionLayer.forEach((row, i) => {
            this._grid[i] = new Array(row.length);

            // populate each column, each grid cell represents the corresponding map collision cell
            row.forEach((val, j) => {
                this._grid[i][j] = (val === 0) ? null : (
                    new Object2D({
                        width:  scale,
                        height: scale,
                        x: j * scale,
                        y: i * scale
                    })
                );
            });
        });
    }

    /**
     * Gets a collision box that is the size of a map grid cell positioned at the object's relative cell
     * @param object object to create a collision box for
     */
    public getCollisionBox(object:Object2D):Object2D{
        const scale:number = MapInstance.TILE_SCALE;
        return new Object2D({
            width: Math.min(object.width, scale),
            height: scale,
            x: object.x,
            y: object.bottom - scale
        })
    }

    /**
     * Gets an array of collidable objects around a grid location (9 elements, can be null!)
     * @param location location to get nearby collision objects
     */
    public getCollidablesNear(location:MapLocation):Object2D[]{
        const {row, col} = location;
        return [
            this.getAt({row: row - 1, col: col - 1}),
            this.getAt({row: row - 1, col}),
            this.getAt({row: row - 1, col: col + 1}),
            this.getAt({row, col: col - 1}),
            this.getAt({row, col}),
            this.getAt({row, col: col + 1}),
            this.getAt({row: row + 1, col: col - 1}),
            this.getAt({row: row + 1, col}),
            this.getAt({row: row + 1, col: col + 1}),
        ];
    }

    /**
     * Gets the collision object at the location
     * @param location location to check
     */
    public getAt(location:MapLocation):Object2D{
        const {row, col} = location;
        return (row in this._grid) ? (this._grid[row][col] || null) : null;
    }
}