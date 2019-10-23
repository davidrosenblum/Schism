import { store } from "..";
import { setMapJoinPending, setMapLeavePending, setMapCreatePending, setMapListPending } from "../actions/MapListActions";
import { GameSocket } from "../game/GameSocket";

export const requestMapList = ():void => {
    if(!store.getState().mapList.pendingList){
        GameSocket.getMapList();
        store.dispatch(setMapListPending(true));
    }
};

export const requestMapCreate = (mapType:number, difficulty:number, customName:string, password:string):void => {
    if(!store.getState().mapList.pendingCreate){
        GameSocket.createMap(mapType, difficulty, customName, password);
        store.dispatch(setMapCreatePending(true));
    }
};

export const requestMapJoin = (mapId:string, password?:string):void => {
    if(!store.getState().mapList.pendingJoin){
        GameSocket.joinMap(mapId, password);
        store.dispatch(setMapJoinPending(true));
    }
};

export const requestMapLeave = ():void => {
    if(!store.getState().mapList.pendingLeave){
        GameSocket.leaveMap();
        store.dispatch(setMapLeavePending(true));
    }
};