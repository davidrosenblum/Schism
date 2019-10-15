import { Reducer } from "redux";
import { AccountActions, AccountActionTypes } from "../actions/AccountActions";

export interface AccountState{
    pendingAccount:boolean;
    pendingLogin:boolean;
    pendingLogout:boolean;
    modalOpen:boolean;
}

const accountState:AccountState = {
    pendingAccount: false,
    pendingLogin: false,
    pendingLogout: false,
    modalOpen: false
};

export const accountReducer:Reducer<AccountState, AccountActions> = (state=accountState, action):AccountState => {
    switch(action.type){
        case AccountActionTypes.SET_ACCOUNT_PENDING:
            return {...state, pendingAccount: action.pending};

        case AccountActionTypes.SET_LOGIN_PENDING:
            return {...state, pendingLogin: action.pending};

        case AccountActionTypes.SET_LOGOUT_PENDING:
            return {...state, pendingLogout: action.pending};

        case AccountActionTypes.SET_ACCOUNT_MODAL_OPEN:
            return {...state, modalOpen: action.open};

        default:
            return state;
    }
};