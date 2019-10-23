import { store } from "..";
import { showAlertModal } from "../actions/AlertModalActions";
import { setPlayerData } from "../actions/GameStatsActions";
import { showPlayerSelect, showOverview } from "../actions/MenuActions";
import { setPlayerListPending, setPlayerListData, setPlayerCreatePending, setPlayerDeletePending, setPlayerSelectPending } from "../actions/PlayerListActions";
import { GameSocket } from "../game/GameSocket";

export const processPlayerList = (payload:any):void => {
    const {list=[], error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Player List Error", body: error}));
    }
    else{
        store.dispatch(setPlayerListData(list));
    }

    store.dispatch(setPlayerListPending(false));
};

export const processPlayerCreate = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Player Create Error", body: error}));
    }

    store.dispatch(setPlayerCreatePending(false));
};

export const processPlayerDelete = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Player Delete Error", body: error}));
    }
    else{
        GameSocket.getPlayerList();
    }

    store.dispatch(setPlayerDeletePending(false));
};

export const processPlayerSelect = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Player Select Error", body: error}));
    }
    else{
        store.dispatch(setPlayerData(payload));
        store.dispatch(showOverview());
    }

    store.dispatch(setPlayerSelectPending(false));
};