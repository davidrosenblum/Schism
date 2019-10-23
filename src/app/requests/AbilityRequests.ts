import { store } from "..";
import { setAbilityCastPending } from "../actions/AbilityActions";
import { GameManager } from "../game/GameManager";
import { GameSocket } from "../game/GameSocket";

export const requestAbilityCast = (abilityName:string):void => {
    if(!store.getState().ability.pendingAbilityCast){
        GameSocket.castAbility(abilityName, GameManager.targetId);
        store.dispatch(setAbilityCastPending(true));
    }
};