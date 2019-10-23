import { store } from "..";
import { setLoginPending, setLogoutPending } from "../actions/AccountActions";
import { GameSocket } from "../game/GameSocket";

export const requestLogin = (username:string, password:string):void => {
    if(!store.getState().account.pendingLogin){
        GameSocket.connect(() => {
            GameSocket.login(username, password);
        });
        store.dispatch(setLoginPending(true));
    }
};

export const requestLogout = ():void => {
    if(!store.getState().account.pendingLogout){
        GameSocket.logout();
        store.dispatch(setLogoutPending(true));
    }
};