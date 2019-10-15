import { CollisionGrid } from "./CollisionGrid";
import { Object2DContainer } from "./Object2DContainer";
import { Sprite } from "./Sprite";

export type GetTile = (id:number, layer:number)=>Sprite;
export type OnTile = (evt:{tile:Sprite, layer:number, row:number, col:number, id:number})=>void;

export interface GeneratedMapData{
    mapWidth:number;
    mapHeight:number;
    collisionGrid:CollisionGrid;
}

export interface LoadParams{
    layout:number[][][];
    cellSize:number;
    groundOffset:number;
    containers:Object2DContainer[];
    getTile:GetTile;
    onTile?:OnTile;
}

export interface LoadLayerParams{
    layer:number[][];
    layerIndex:number;
    cellSize:number;
    groundOffset:number;
    container:Object2DContainer;
    getTile:GetTile;
    getGMD:boolean;
    onTile?:OnTile;
}

export class MapLoader{
    public static load(params:LoadParams):GeneratedMapData{
        const {
            layout, cellSize, getTile, containers, groundOffset, onTile
        } = params;

        if(layout.length > containers.length){
            throw new Error(`MapLoader - number of layout layers must less than or equal the number of containers.`);
        }

        let gmd:GeneratedMapData;

        layout.forEach((layer, layerIndex) => {
            const layerGmd = this.loadLayer({
                layer,
                layerIndex,
                cellSize,
                groundOffset,
                getTile,
                container:  containers[layerIndex],
                getGMD:     layerIndex === 1,
                onTile
            });

            if(layerGmd)
                gmd = layerGmd;
        });

        return gmd;
    }

    public static loadLayer(params:LoadLayerParams):GeneratedMapData{
        const {
            layer, layerIndex, cellSize, container, getTile, getGMD, groundOffset, onTile
        } = params;

        const groundLevel:number = cellSize + groundOffset;

        const grid:CollisionGrid = getGMD ? new CollisionGrid(cellSize) : null;

        let tile:Sprite;
        let longestRow:number = -1;

        for(let row:number = 0; row < layer.length; row++){
            for(let col:number = 0; col < layer[row].length; col++){
                tile = getTile(layer[row][col], layerIndex);

                if(!tile){
                    continue;
                }

                tile.drawBox.x = col * cellSize;
                tile.drawBox.y = row * cellSize;

                if(tile.drawBox.height < groundLevel){
                    tile.drawBox.y += (groundLevel - tile.drawBox.height);
                    // tile.drawBox.y -= (tile.drawBox.height - groundOffset);
                }
                else if(tile.drawBox.height > groundLevel){
                    tile.drawBox.y -= (tile.drawBox.height - cellSize);
                }

                if(grid){
                    grid.storeAt(row, col, tile);
                }

                if(container){
                    container.addChild(tile);
                }

                if(onTile){
                    onTile({tile, row, col, layer: layerIndex, id: layer[row][col]});
                }
            }

            longestRow = Math.max(longestRow, layer[row].length);
        }

        if(getGMD){
            return {
                mapWidth:       longestRow * cellSize,
                mapHeight:      layer.length * cellSize,
                collisionGrid:  grid
            };
        }
        return null;
    }
}