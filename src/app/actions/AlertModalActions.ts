export enum AlertModalActionTypes{
    SHOW_ALERT_MODAL = "SET_ALERT_MODAL_OPEN",
    HIDE_ALERT_MODAL = "HIDE_ALERT_MODAL"
}

export interface ShowAlertModal{
    type:AlertModalActionTypes.SHOW_ALERT_MODAL,
    header:string;
    body:string;
    footer:string;
}

export interface HideAlertModal{
    type:AlertModalActionTypes.HIDE_ALERT_MODAL;
}

export type AlertModalActions = (
    ShowAlertModal | HideAlertModal
);

export const showAlertModal = ({header=null, body=null, footer=null}):ShowAlertModal => {
    return {
        type: AlertModalActionTypes.SHOW_ALERT_MODAL,
        header,
        body,
        footer
    };
};

export const hideAlertModal = ():HideAlertModal => {
    return {
        type: AlertModalActionTypes.HIDE_ALERT_MODAL
    };
};