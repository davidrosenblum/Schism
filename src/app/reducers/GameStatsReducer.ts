import { UnitState } from "../data/Payloads";
import { Reducer } from "redux";
import { GameStatsActions, GameStatsActionTypes } from "../actions/GameStatsActions";

export interface GameStatsState{
    playerStats:UnitState;
    targetStats:UnitState;
}

export const gameStats:GameStatsState = {
    playerStats: null,
    targetStats: null
};

export const gameStatsReducer:Reducer<GameStatsState, GameStatsActions> = (state=gameStats, action):GameStatsState => {
    switch(action.type){
        case GameStatsActionTypes.SET_PLAYER_DATA:
            return {...state, playerStats: action.data};

        case GameStatsActionTypes.SET_TARGET_DATA:
            return {...state, targetStats: action.data};

        default:
            return state;
    }
}