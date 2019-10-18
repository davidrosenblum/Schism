import { MapDifficulty, MapTileLayer, MapInstance } from "./MapInstance";
import { NPCFactory } from "../entities/NPCFactory";
import { Unit } from "../entities/Unit";
import { rngInt } from "../utils/RNG";

export class MapNPCs{
    /**
     * Populates a map with NPCs based on the map difficulty and enemy faction
     * @param map       map instance that holds npc type data (faction, difficulty) and will be populated
     * @param npcLayout 2d array representing enemy locations and type
     */
    public static populateNPCs(map:MapInstance, npcLayout:MapTileLayer):void{
        // get min-max levels based on difficulty
        const [minLvl, maxLvl] = this.getLevelRange(map.difficulty);

        // prep for loop
        let npcIndex:number, npc:Unit, level:number;

        // iterate over npc 2d array
        for(let row:number = 0; row < npcLayout.length; row++){
            for(let col:number = 0; col < npcLayout[row].length; col++){
                // get index (cell value)
                npcIndex = npcLayout[row][col] - 1; // -1 because array index

                // 0 means no npc
                if(npcIndex < 0){
                    continue;
                }

                // pick a random level in the difficulty range
                level = rngInt(minLvl, maxLvl);
                // create the npc
                npc = NPCFactory.createFromFaction(map.enemyFaction, npcIndex, {level});

                // add successfully created npcs to the map
                if(npc){
                    map.addUnit(npc, {row, col});
                }
            }
        }
    }

    /**
     * Gets the level range (array format) for the given enumerated map difficulty.
     * @param difficulty map difficulty
     * @returns [min, max] level range
     */
    public static getLevelRange = (difficulty:MapDifficulty):[number, number] => {
        switch(difficulty){
            case MapDifficulty.TRAINING:
                return [1, 4];
    
            case MapDifficulty.STANDARD:
                return [3, 6];
    
            case MapDifficulty.VETERAN:
                return [5, 8];
    
            case MapDifficulty.ELITE:
                return [7, 10];
    
            case MapDifficulty.SUICIDAL:
                return [9, 10];
    
            default:
                return [1, 1];
        }
    };
}