import { MapInstance, MapDifficulty, MapType } from "./MapInstance";
import { MAP1_LAYOUT } from "./MapLayouts";

// map configruation from user
interface Config{
    difficulty:MapDifficulty;
    customName:string;
    password?:string;
}

// preset maps
const mapTypes:Map<MapType, (config:Config)=>MapInstance> = new Map([
    [MapType.TEST, config => {
        return new MapInstance({
            ...config,
            type:               MapType.TEST,
            enemyFaction:       "Undead",
            playerSpawn:        {row: 3, col: 3},
            populationLimit:    4,
            tileLayout:         MAP1_LAYOUT
        });
    }],
    [MapType.W1E1, config => {
        return new MapInstance({
            ...config,
            type:               MapType.W1E1,
            enemyFaction:       "Undead",
            playerSpawn:        {row: 3, col: 3},
            populationLimit:    4,
            tileLayout:         MAP1_LAYOUT
        });
    }],
    [MapType.W1E2, config => {
        return new MapInstance({
            ...config,
            type:               MapType.W1E2,
            enemyFaction:       "Undead",
            playerSpawn:        {row: 3, col: 3},
            populationLimit:    4,
            tileLayout:         MAP1_LAYOUT
        });
    }],
    [MapType.W1E3, config => {
        return new MapInstance({
            ...config,
            type:               MapType.W1E3,
            enemyFaction:       "Undead",
            playerSpawn:        {row: 3, col: 3},
            populationLimit:    4,
            tileLayout:         MAP1_LAYOUT
        });
    }]
]);

export class MapInstanceFactory{
    /**
     * Creates a map instance from the given parameters
     * @param type          map type (responsible for layout)
     * @param difficulty    map difficulty for enemy levels
     * @param customName    assigned public name for the map
     * @param password      optional map password
     * @returns the generated map instance
     */
    public static create(type:MapType, difficulty:MapDifficulty, customName:string, password?:string):MapInstance{
        if(mapTypes.has(type)){
            // map type exists, create the map with parameters
            return mapTypes.get(type)({difficulty, customName, password});
        }
        return null;
    }
}