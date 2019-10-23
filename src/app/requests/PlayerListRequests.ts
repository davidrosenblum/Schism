import { store } from "..";
import { setPlayerSelectPending, setPlayerListPending, setPlayerDeletePending, setPlayerCreatePending } from "../actions/PlayerListActions";
import { GameSocket } from "../game/GameSocket";

export const requestPlayerList = ():void => {
    if(!store.getState().playerList.pendingList){
        GameSocket.getPlayerList();
        store.dispatch(setPlayerListPending(true));
    }
};

export const requestPlayerCreate = (name:string, archetype:number):void => {
    if(!store.getState().playerList.pendingCreate){
        GameSocket.createPlayer(name, archetype);
        store.dispatch(setPlayerCreatePending(true));
    }
};

export const requestPlayerDelete = (name:string):void => {
    if(!store.getState().playerList.pendingDelete){
        GameSocket.deletePlayer(name);
        store.dispatch(setPlayerDeletePending(true));
    }
};

export const requestPlayerSelect = (name:string):void => {
    if(!store.getState().playerList.pendingSelect){
        GameSocket.selectPlayer(name);
        store.dispatch(setPlayerSelectPending(true));
    }
};