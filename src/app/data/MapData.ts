export type MapDifficulty = {difficulty:string, levels:[number, number], value:number};

export const MapTypes:{mapType:string}[] = [
    {mapType: "Test"}
];

export const MapDifficulties:MapDifficulty[] = [
    {difficulty: "Training", levels: [1, 4], value: 1},
    {difficulty: "Standard", levels: [3, 6], value: 2},
    {difficulty: "Veteran", levels: [5, 8], value: 3},
    {difficulty: "Elite", levels: [7, 10], value: 4},
    {difficulty: "Suicidal", levels: [9, 10], value: 5}
]

export const NpcRanks:{[rank:number]: {rank:string}} = {
    1: {rank: "Minion"},
    2: {rank: "Elite"},
    3: {rank: "Boss"},
    4: {rank: "Elite Boss"}
};