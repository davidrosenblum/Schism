import { MapTileLayer, MapLocation } from "./MapInstance";

export enum Direction{
    NORTH, SOUTH, EAST, WEST, NORTH_EAST, SOUTH_EAST, NORTH_WEST, SOUTH_WEST, NONE
}

export class MapPathFinder{
    private _data:MapTileLayer;

    /**
     * Constructs a Map Path Finder object
     * @param collisionLayer    map layout collision data
     */
    constructor(collisionLayer:MapTileLayer){
        this._data = collisionLayer;
    }

    /**
     * Finds all the paths to take to reach the destination (ends at destination or where stuck)
     * @param src   source location
     * @param dest  destination location
     * @returns array of in-order locations to traverse
     */
    public findPath(src:MapLocation, dest:MapLocation):MapLocation[]{
        const paths:MapLocation[] = [];
        let currLocation:MapLocation = src;
        let nextLocation:MapLocation = null;

        while(src.row !== dest.row && src.col !== dest.col){
            // find next position
            nextLocation = this.findNextStep(currLocation, dest);

            // if path didn't change, it must be stuck (out of options)
            if(nextLocation.row === currLocation.row && nextLocation.col === currLocation.col)
                break;

            // store location
            paths.push(nextLocation);
            // current is next (prepare for next iteration)
            currLocation = nextLocation;
        }

        return paths;
    }

    /**
     * Gets the next adjacent cell to move towards
     * @param src   source location
     * @param dest  destination location
     * @returns the next location to move to
     */
    public findNextStep(src:MapLocation, dest:MapLocation):MapLocation{
        const {row, col} = src;
        const direction:Direction = this.findNextDirection(src, dest);

        switch(direction){
            case Direction.NORTH:
                return {row: row - 1, col};
            case Direction.SOUTH:
                return {row: row + 1, col};
            case Direction.EAST:
                return {row, col: col - 1};
            case Direction.WEST:
                return {row, col: col + 1};
            case Direction.NORTH_EAST:
                return {row: row - 1, col: col - 1};
            case Direction.SOUTH_EAST:
                return {row: row + 1, col: col + 1};
            case Direction.NONE:
            default:
                return {row, col};
        }
    }

    /**
     * Gets an enumerated value that represents the direction that must traveled for 'src' to get to 'dest'
     * @param src   source locaion
     * @param dest  destination location
     * @returns the direction that must be traveled so 'src' can reach 'dest'
     */
    public findNextDirection(src:MapLocation, dest:MapLocation):Direction{
        const n:boolean = src.row > dest.row;
        const s:boolean = src.row < dest.row;
        const e:boolean = src.col > dest.col;
        const w:boolean = src.col < dest.col;

        if(n){
            if(e)
                return Direction.NORTH_EAST;
            else if(w)
                return Direction.NORTH_WEST;
            return Direction.NORTH;
        }
        else if(s){
            if(e)
                return Direction.SOUTH_EAST;
            else if(w)
                return Direction.SOUTH_WEST;
            return Direction.SOUTH;
        }
        else{
            if(e)
                return Direction.EAST;
            else if(w)
                return Direction.WEST;
        }
        return Direction.NONE;
    }
}