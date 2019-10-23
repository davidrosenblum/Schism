import { store } from "..";
import { setLoginPending, setLogoutPending } from "../actions/AccountActions";
import { showAlertModal } from "../actions/AlertModalActions";
import { showPlayerSelect, showLogin } from "../actions/MenuActions";
import { GameManager } from "../game/GameManager";

export const processLogin = (payload:any):void => {
    const {id, error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Login Error", body: error}));
    }
    else{
        store.dispatch(showPlayerSelect());
        GameManager.clientId = id;
    }

    store.dispatch(setLoginPending(false));
};

export const processLogout = (payload:any):void => {
    const {error} = payload;

    if(error){
        store.dispatch(showAlertModal({header: "Logout Error", body: error}));
    }
    else{
        store.dispatch(showLogin());
    }

    store.dispatch(setLogoutPending(false));
};