import { AssetsManager } from "./AssetsManager";
import { TILE_SIZE, GROUND_OFFSET } from "./GameManager";
import { Sprite } from "../gfx/Sprite";

type TileFunc = ()=>Sprite;
type TileFuncDict = {[tileId:number]: TileFunc};

const layer1Tiles:TileFuncDict = {
    0: () => {
        return null;
    },
    1: () => {
       return new Sprite({
           imageSrc: AssetsManager.getImageSrc("ash"), width: TILE_SIZE, height: TILE_SIZE * 1.2,
           hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    2: () => {
        return new Sprite({
            imageSrc: AssetsManager.getImageSrc("molten_ash"), width: TILE_SIZE, height: TILE_SIZE,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    3: () => {
        return new Sprite({
            imageSrc: AssetsManager.getImageSrc("castle_floor_1"), width: TILE_SIZE, height: TILE_SIZE  * 1.2,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    4: () => {
        return new Sprite({
            imageSrc: AssetsManager.getImageSrc("castle_floor_2"), width: TILE_SIZE, height: TILE_SIZE * 1.2,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    8: () => {
        return new Sprite({
            imageSrc: AssetsManager.getImageSrc("lava"), width: TILE_SIZE, height: TILE_SIZE,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    9: () => {
        return new Sprite({imageSrc: "", width: TILE_SIZE, height: TILE_SIZE});
    }
};

const layer2Tiles:TileFuncDict = {
    0: () => {
        return null
    },
    2: () => {
        return new Sprite({
            imageSrc: AssetsManager.getImageSrc("castle_wall"), width: TILE_SIZE, height: TILE_SIZE * 2,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE
        });
    },
    9: () => {
        return new Sprite({
            imageSrc: "", width: TILE_SIZE, height: TILE_SIZE,
            hitboxWidth: TILE_SIZE, hitboxHeight: TILE_SIZE + GROUND_OFFSET
        });
    }
};

const layerTiles:TileFuncDict[] = [
    layer1Tiles, layer2Tiles
];

export class MapTileFactory{
    public static create(tileId:number, layer:number):Sprite{
        if(layer in layerTiles && tileId in layerTiles[layer]){
            return layerTiles[layer][tileId]();
        }
        return null;
    }
}