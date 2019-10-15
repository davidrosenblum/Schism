import { AssetsManager } from "./AssetsManager";
import { GameEntity } from "./GameEntity";
import { TILE_SIZE } from "./GameManager";
import { UnitState } from "../data/Payloads";
import { AnimationLibrary, AnimationLoader } from "../gfx/AnimationLoader";
import { Facing } from "../gfx/GameObject";

interface PresetParams{
    type:string;
    imageSrc:string;
    animations?:AnimationLibrary;
}

const animOpts = {
    "left_idle": {frameCount: 30},
    "right_idle": {frameCount: 30},
    "left_run": {frameCount: 60},
    "right_run": {frameCount: 60}
};


const entsTypes:{[type:string]: ()=>PresetParams} = {
    "player1": () => ({
        type: "player",
        imageSrc: AssetsManager.getImageSrc("player_knight"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("player_knight"))
    }),
    "player2": () => ({
        type: "player",
        imageSrc: AssetsManager.getImageSrc("player_ranger"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("player_ranger"))
    }),
    "player3": () => ({
        type: "player",
        imageSrc: AssetsManager.getImageSrc("player_alchemist"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("player_alchemist"))
    }),
    "ghoul": () => ({
        type: "ghoul",
        imageSrc: AssetsManager.getImageSrc("enemy_ghoul"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("enemy_ghoul"))
    }),
    "grave_knight": () => ({
        type: "grave_knight",
        imageSrc: AssetsManager.getImageSrc("enemy_grave_knight"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("enemy_grave_knight"))
    }),
    "lich": () => ({
        type: "lich",
        imageSrc: AssetsManager.getImageSrc("enemy_lich"),
        animations: AnimationLoader.loadJson(AssetsManager.getAnimJson("enemy_lich"))
    })
};

export class GameEntityFactory{
    public static create(type:string, data:UnitState):GameEntity{
        if(type in entsTypes){
            const presetParams:PresetParams = entsTypes[type]();

            const ent:GameEntity = new GameEntity({
                ...data,
                ...presetParams,
                hitboxWidth: TILE_SIZE - 2,
                hitboxHeight: TILE_SIZE * 0.5,
                facing: data.facing as Facing
            });

            if(data.anim){
                ent.playAnimation(data.anim);
            }

            return ent;
        }
        return null;
    }
}