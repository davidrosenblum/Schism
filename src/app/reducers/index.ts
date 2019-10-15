import { Reducer, combineReducers } from "redux";
import { AbilityState, abilityReducer } from "./AbilityReducer";
import { AccountState, accountReducer } from "./AccountReducer";
import { AlertModalState, alertModalReducer } from "./AlertModalReducer";
import { GameStatsState, gameStatsReducer } from "./GameStatsReducer";
import { MenuState, menuReducer } from "./MenuReducer";
import { PlayerListState, playerListReducer } from "./PlayerListReducer";
import { MapListState, mapListReducer } from "./MapListReducer";

export interface AppState{
    ability:AbilityState;
    account:AccountState;
    alertModal:AlertModalState;
    gameStats:GameStatsState;
    mapList:MapListState;
    menu:MenuState;
    playerList:PlayerListState;
}

export const rootReducer:Reducer<AppState> = combineReducers({
    ability: abilityReducer,
    account: accountReducer,
    alertModal: alertModalReducer,
    gameStats: gameStatsReducer,
    mapList: mapListReducer,
    menu: menuReducer,
    playerList: playerListReducer
});