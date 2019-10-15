import { MapInstance, MapDifficulty } from "./MapInstance";
import { MAP1_LAYOUT } from "./MapLayouts";
import { NPC } from "../entities/NPC";
import { NPCFactory } from "../entities/NPCFactory";

interface Config{
    difficulty:MapDifficulty;
    customName:string;
    password?:string;
}

const mapTypes:{[type:string]: (configuration:Config)=>MapInstance} = {
    "Test": config => {
        return new MapInstance({
            ...config,
            type:               "Test",
            enemyFaction:       "Undead",
            playerSpawn:        {row: 3, col: 3},
            populationLimit:    4,
            tileLayout:         MAP1_LAYOUT
        });
    }
};

export class MapInstanceFactory{
    public static create(type:string, difficulty:MapDifficulty, customName:string, password?:string):MapInstance{
        if(type in mapTypes){
            return mapTypes[type]({difficulty, customName, password});
        }
        return null;
    }
}