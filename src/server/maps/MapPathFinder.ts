import { MapInstance } from "./MapInstance";
import { MapPathGraph } from "./MapPathGraph";


export class MapPathFinder{
    private _map:MapInstance;
    private _graph:MapPathGraph;

    constructor(map:MapInstance){
        this._map = map;
        this._graph = map.getPathGraph();
    }

    public 
}


