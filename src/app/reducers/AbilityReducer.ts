import { Reducer } from "redux";
import { AbilityActions, AbilityActionTypes } from "../actions/AbilityActions";

export interface AbilityState{
    pendingAbilityCast:boolean;
}

const ability:AbilityState = {
    pendingAbilityCast: false
};

export const abilityReducer:Reducer<AbilityState, AbilityActions> = (state=ability, action):AbilityState => {
    switch(action.type){
        case AbilityActionTypes.SET_ABILITY_CAST_PENDING:
            return {...state, pendingAbilityCast: action.pending};

        default:
            return state;
    }
};