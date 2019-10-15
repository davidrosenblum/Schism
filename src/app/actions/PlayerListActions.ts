import { PlayerListItem } from "../data/Payloads";

export enum PlayerListActionTypes{
    SET_PLAYER_CREATE_PENDING = "SET_PLAYER_CREATE_PENDING",
    SET_PLAYER_DELETE_PENDING = "SET_PLAYER_DELETE_PENDING",
    SET_PLAYER_SELECT_PENDING = "SET_PLAYER_SELECT_PENDING",
    SET_PLAYER_LIST_PENDING = "SET_PLAYER_LIST_PENDING",
    SET_PLAYER_LIST_DATA = "SET_PLAYER_LIST_DATA"
}

export interface SetPlayerCreatePending{
    type:PlayerListActionTypes.SET_PLAYER_CREATE_PENDING;
    pending:boolean;
}

export interface SetPlayerDeletePending{
    type:PlayerListActionTypes.SET_PLAYER_DELETE_PENDING;
    pending:boolean;
}

export interface SetPlayerSelectPending{
    type:PlayerListActionTypes.SET_PLAYER_SELECT_PENDING;
    pending:boolean;
}

export interface SetPlayerListPending{
    type:PlayerListActionTypes.SET_PLAYER_LIST_PENDING,
    pending:boolean;
}

export interface SetPlayerListData{
    type:PlayerListActionTypes.SET_PLAYER_LIST_DATA;
    data:PlayerListItem[];
}

export type PlayerListActions = (
    SetPlayerCreatePending | SetPlayerDeletePending | SetPlayerSelectPending | SetPlayerListPending | SetPlayerListData
);

export const setPlayerCreatePending = (pending:boolean):SetPlayerCreatePending => {
    return {
        type:PlayerListActionTypes.SET_PLAYER_CREATE_PENDING,
        pending
    };
};

export const setPlayerDeletePending = (pending:boolean):SetPlayerDeletePending => {
    return {
        type:PlayerListActionTypes.SET_PLAYER_DELETE_PENDING,
        pending
    };
};

export const setPlayerSelectPending = (pending:boolean):SetPlayerSelectPending => {
    return {
        type:PlayerListActionTypes.SET_PLAYER_SELECT_PENDING,
        pending
    };
};

export const setPlayerListPending = (pending:boolean):SetPlayerListPending => {
    return {
        type:PlayerListActionTypes.SET_PLAYER_LIST_PENDING,
        pending
    };
};

export const setPlayerListData = (data:PlayerListItem[]):SetPlayerListData => {
    return {
        type:PlayerListActionTypes.SET_PLAYER_LIST_DATA,
        data
    };
};