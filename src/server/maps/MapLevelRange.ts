import { MapDifficulty } from "./MapInstance";

export class MapLevelRange{
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