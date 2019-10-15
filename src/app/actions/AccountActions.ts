export enum AccountActionTypes{
    SET_ACCOUNT_PENDING = "SET_ACCOUNT_PENDING",
    SET_LOGIN_PENDING = "SET_LOGIN_PENDING",
    SET_LOGOUT_PENDING = "SET_LOGOUT_PENDING",
    SET_ACCOUNT_MODAL_OPEN = "SET_ACCOUNT_MODAL_OPEN"
}

export interface SetAccountPending{
    type:AccountActionTypes.SET_ACCOUNT_PENDING;
    pending:boolean;
}

export interface SetLoginPending{
    type:AccountActionTypes.SET_LOGIN_PENDING;
    pending:boolean;
}

export interface SetLogoutPending{
    type:AccountActionTypes.SET_LOGOUT_PENDING;
    pending:boolean;
}

export interface SetAccountModalOpen{
    type:AccountActionTypes.SET_ACCOUNT_MODAL_OPEN;
    open:boolean;
}

export type AccountActions = (
    SetAccountPending | SetLoginPending | SetLogoutPending | SetAccountModalOpen
);

export const setAccountPending = (pending:boolean):SetAccountPending => {
    return {
        type:AccountActionTypes.SET_ACCOUNT_PENDING,
        pending
    };
};

export const setLoginPending = (pending:boolean):SetLoginPending => {
    return {
        type:AccountActionTypes.SET_LOGIN_PENDING,
        pending
    };
};

export const setLogoutPending = (pending:boolean):SetLogoutPending => {
    return {
        type:AccountActionTypes.SET_LOGOUT_PENDING,
        pending
    };
};

export const setAccountModalOpen = (open:boolean):SetAccountModalOpen => {
    return {
        type:AccountActionTypes.SET_ACCOUNT_MODAL_OPEN,
        open
    };
};