import { chatBuffer } from "./InGameController";
import { store } from "../Client";
import { setAbilityCastPending } from "../actions/AbilityActions";

export const processAbilityCast = (payload:any):void => {
    const {error} = payload;

    if(error){
        // chatBuffer.write(error);
    }

    store.dispatch(setAbilityCastPending(false));
};

export const processAbilityReady = (payload:any):void => {
    const {error} = payload;

    if(error){
        // do something?
    }

    // update game manager?
};