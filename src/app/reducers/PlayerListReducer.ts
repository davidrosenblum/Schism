import { Reducer } from "redux";
import { PlayerListActions, PlayerListActionTypes } from "../actions/PlayerListActions";
import { PlayerListItem } from "../data/Payloads";

export interface PlayerListState{
    pendingList:boolean;
    pendingCreate:boolean;
    pendingDelete:boolean;
    pendingSelect:boolean;
    list:PlayerListItem[];
}

export const playerList:PlayerListState = {
    pendingList: false,
    pendingCreate: false,
    pendingDelete: false,
    pendingSelect: false,
    list: null
};

export const playerListReducer:Reducer<PlayerListState, PlayerListActions> = (state=playerList, action):PlayerListState => {
    switch(action.type){
        case PlayerListActionTypes.SET_PLAYER_CREATE_PENDING:
            return {...state, pendingCreate: action.pending};

        case PlayerListActionTypes.SET_PLAYER_DELETE_PENDING:
            return {...state, pendingDelete: action.pending};

        case PlayerListActionTypes.SET_PLAYER_SELECT_PENDING:
            return {...state, pendingSelect: action.pending};

        case PlayerListActionTypes.SET_PLAYER_LIST_PENDING:
            return {...state, pendingList: action.pending};

        case PlayerListActionTypes.SET_PLAYER_LIST_DATA:
            return {...state, list: action.data};

        default:
            return state;
    }
};