import { MapInstance } from "./MapInstance";
import { Entity2D } from "../entities/Entity2D";

type Direction = "left" | "right" | "up" | "down";

export class MapPathGraph{
    private _nodes:MapPathNode[];

    constructor(rawData:any[][]){
        this._nodes = [];
        this.createGraph(rawData);
    }

    private createGraph(rawData:any[][]):void{
        // create nodes
        rawData.forEach((row, rIdx) => {
            row.forEach((col, cIdx) => {
                if(col === 0)
                    this._nodes.push(this.createNode(rIdx, cIdx));
            });
        });

        // setup connections
        this._nodes.forEach((node1, i) => {
            this._nodes.forEach((node2, j) => {
                if(node1.data.x + MapInstance.TILE_SCALE === node2.data.x){
                    node1.setConnection("right", node2);
                    node2.setConnection("left", node1);
                }

                if(node1.data.y + MapInstance.TILE_SCALE === node2.data.y){
                    node1.setConnection("down", node2);
                    node2.setConnection("up", node1);
                }
            });
        });
    }

    private createNode(row:number, col:number):MapPathNode{
        const ent:Entity2D = new Entity2D({
            x:      col * MapInstance.TILE_SCALE,
            y:      row * MapInstance.TILE_SCALE,
            width:  MapInstance.TILE_SCALE,
            height: MapInstance.TILE_SCALE
        });

        return new MapPathNode(ent);
    }
}

export class MapPathNode{
    private _connections:Map<Direction, MapPathNode>;
    public data:Entity2D;

    constructor(data:Entity2D){
        this._connections = new Map();
        this.data = data;
    }

    public setConnection(direction:Direction, node:MapPathNode):void{
        this._connections.set(direction, node);
    }
}