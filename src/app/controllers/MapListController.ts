import { store } from "..";
import { showAlertModal } from "../actions/AlertModalActions";
import { setMapLeavePending, setMapJoinPending, setMapCreatePending, setMapListData, setMapListPending } from "../actions/MapListActions";
import { showOverview, showGame } from "../actions/MenuActions";
import { AssetsManager } from "../game/AssetsManager";
import { GameManager } from "../game/GameManager";

export const processMapList = (payload:any):void => {
    const {list=[], error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Map List Error", body: error}));
    }
    else{
        store.dispatch(setMapListData(list));
    }

    store.dispatch(setMapListPending(false));
};

export const processMapCreate = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Map Create Error", body: error}));
    }

    store.dispatch(setMapCreatePending(false));
};

export const processMapJoin = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Map Join Error", body: error}));
    }
    else{
        store.dispatch(showGame());
        
        AssetsManager.loadAssets(() => {
            GameManager.loadMap(payload, document.querySelector("canvas"))
        });
    }

    store.dispatch(setMapJoinPending(false));
};

export const processMapLeave = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Map Leave Error", body: error}));
    }
    else{
        AssetsManager.purgeAssetCache();
        GameManager.unloadMap();
        store.dispatch(showOverview());
    }

    store.dispatch(setMapLeavePending(false));
};