export enum GameStatsActionTypes{
    SET_PLAYER_DATA = "SET_PLAYER_DATA",
    SET_TARGET_DATA = "SET_TARGET_DATA"
}

export interface SetPlayerData{
    type:GameStatsActionTypes.SET_PLAYER_DATA;
    data:any;
}

export interface SetTargetData{
    type:GameStatsActionTypes.SET_TARGET_DATA;
    data:any;
}

export type GameStatsActions = (
    SetPlayerData | SetTargetData
);

export const setPlayerData = (data:any):SetPlayerData => {
    return {
        type: GameStatsActionTypes.SET_PLAYER_DATA,
        data
    };
};

export const setTargetData = (data:any):SetTargetData => {
    return {
        type: GameStatsActionTypes.SET_TARGET_DATA,
        data
    };
};