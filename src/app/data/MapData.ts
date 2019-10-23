export type MapDifficulty = {difficulty:string, levels:[number, number], value:number};

export const MapTypes:{mapName:string, mapType:number, enemyType:string}[] = [
    {
        mapName: "W0-E0: Test",
        enemyType: "Undead",
        mapType: 0
    },
    {
        mapName: "W1-E1: The Hellgate",
        enemyType: "Undead",
        mapType: 1
    },
    {
        mapName: "W1-E2: The Burning Graves",
        enemyType: "Undead",
        mapType: 2
    },
    {
        mapName: "W1-E3: The Necropolis",
        enemyType: "Undead",
        mapType: 3
    },
];

export const MapDifficulties:MapDifficulty[] = [
    {
        difficulty: "Training",
        levels: [1, 4],
        value: 1
    },
    {
        difficulty: "Standard",
        levels: [3, 6],
        value: 2
    },
    {   difficulty: "Veteran",
        levels: [5, 8],
        value: 3
    },
    {
        difficulty: "Elite",
        levels: [7, 10],
        value: 4
    },
    {
        difficulty: "Suicidal",
        levels: [9, 10],
        value: 5
    }
]

export const NpcRanks:{[rank:number]: {rank:string}} = {
    1: {rank: "Minion"},
    2: {rank: "Elite"},
    3: {rank: "Boss"},
    4: {rank: "Elite Boss"}
};