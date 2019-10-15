import { Reducer } from "redux";
import { MapListItem } from "../data/Payloads";
import { MapListActions, MapListActionTypes } from "../actions/MapListActions";

export interface MapListState{
    pendingCreate:boolean;
    pendingJoin:boolean;
    pendingLeave:boolean;
    pendingList:boolean;
    list:MapListItem[];
}

const mapList:MapListState = {
    pendingCreate: false,
    pendingJoin: false,
    pendingLeave: false,
    pendingList: false,
    list: null
};

export const mapListReducer:Reducer<MapListState, MapListActions> = (state=mapList, action):MapListState => {
    switch(action.type){
        case MapListActionTypes.SET_MAP_CREATE_PENDING:
            return {...state, pendingCreate: action.pending};

        case MapListActionTypes.SET_MAP_JOIN_PENDING:
            return {...state, pendingJoin: action.pending};

        case MapListActionTypes.SET_MAP_LEAVE_PENDING:
            return {...state, pendingLeave: action.pending};

        case MapListActionTypes.SET_MAP_LIST_PENDING:
            return {...state, pendingList: action.pending};

        case MapListActionTypes.SET_MAP_LIST_DATA:
            return {...state, list: action.data};
            
        default:
            return state;
    }
};