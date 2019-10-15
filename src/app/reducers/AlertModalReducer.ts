import { Reducer } from "redux";
import { AlertModalActions, AlertModalActionTypes } from "../actions/AlertModalActions";

export interface AlertModalState{
    modalOpen:boolean;
    header:string;
    body:string;
    footer:string;
}

export const alertModal:AlertModalState ={ 
    modalOpen: false,
    header: null,
    body: null,
    footer: null
};

export const alertModalReducer:Reducer<AlertModalState, AlertModalActions> = (state=alertModal, action):AlertModalState => {
    switch(action.type){
        case AlertModalActionTypes.SHOW_ALERT_MODAL:
            return {...state, modalOpen: true, header: action.header, body:action.body, footer: action.footer};
        
        case AlertModalActionTypes.HIDE_ALERT_MODAL:
            return {...state, modalOpen: false, header: null, body: null, footer: null};

        default:
            return state;
    }
};