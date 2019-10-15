import { MapListItem } from "../data/Payloads";

export enum MapListActionTypes{
    SET_MAP_CREATE_PENDING = "SET_MAP_CREATE_PENDING",
    SET_MAP_JOIN_PENDING = "SET_MAP_JOIN_PENDING",
    SET_MAP_LEAVE_PENDING = "SET_MAP_LEAVE_PENDING",
    SET_MAP_LIST_PENDING = "SET_MAP_LIST_PENDING",
    SET_MAP_LIST_DATA = "SET_MAP_LIST_DATA"
}

export interface SetMapCreatePending{
    type:MapListActionTypes.SET_MAP_CREATE_PENDING;
    pending:boolean;
}

export interface SetMapJoinPending{
    type:MapListActionTypes.SET_MAP_JOIN_PENDING;
    pending:boolean;
}

export interface SetMapLeavePending{
    type:MapListActionTypes.SET_MAP_LEAVE_PENDING;
    pending:boolean;
}

export interface SetMapListPending{
    type:MapListActionTypes.SET_MAP_LIST_PENDING;
    pending:boolean;
}

export interface SetMapListData{
    type:MapListActionTypes.SET_MAP_LIST_DATA;
    data:MapListItem[];
}

export type MapListActions = (
    SetMapCreatePending | SetMapJoinPending | SetMapLeavePending | SetMapListPending | SetMapListData
);

export const setMapCreatePending = (pending:boolean):SetMapCreatePending => {
    return {
        type: MapListActionTypes.SET_MAP_CREATE_PENDING,
        pending
    };
};

export const setMapJoinPending = (pending:boolean):SetMapJoinPending => {
    return {
        type: MapListActionTypes.SET_MAP_JOIN_PENDING,
        pending
    };
};

export const setMapLeavePending = (pending:boolean):SetMapLeavePending => {
    return {
        type: MapListActionTypes.SET_MAP_LEAVE_PENDING,
        pending
    };
};

export const setMapListPending = (pending:boolean):SetMapListPending => {
    return {
        type: MapListActionTypes.SET_MAP_LIST_PENDING,
        pending
    };
};

export const setMapListData = (data:MapListItem[]):SetMapListData => {
    return {
        type: MapListActionTypes.SET_MAP_LIST_DATA,
        data
    };
};