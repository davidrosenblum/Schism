import { store } from "..";
import { setTargetData, setPlayerData } from "../actions/GameStatsActions";
import { GameManager } from "../game/GameManager";

export const processStatsUpdate = (payload:any):void => {
    GameManager.updateStats(payload);
    
    if(payload.id === GameManager.playerId){
        store.dispatch(setPlayerData({
            ...store.getState().gameStats.playerStats,
            ...payload
        }));
    }

    if(payload.id === GameManager.targetId){
        store.dispatch(setTargetData({
            ...store.getState().gameStats.targetStats,
            ...payload
        }));
    }
};

export const processChat = (payload:any):void => {
    const {chat, from, error} = payload;

    if(!error){
        const text:string = from ? `${from}: ${chat}` : chat;
        chatBuffer.write(text);
    }
};

export const chatBuffer = {
    buffer: [],
    onData: null,
    write: (text:string) => {
        chatBuffer.buffer.push(text);
        if(chatBuffer.onData){
            chatBuffer.onData(chatBuffer.read());
        }
    },
    read: () => {
        const text:string = chatBuffer.buffer.join("\n");
        chatBuffer.buffer = [];
        return text;
    }
};