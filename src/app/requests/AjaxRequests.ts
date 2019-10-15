import { store } from "../Client";
import { setAccountPending } from "../actions/AccountActions";

export const requestAccount = (username:string, password:string, cb:(err?:string, res?:string)=>void):void => {
    if(store.getState().account.pendingAccount){
        cb("Awaiting account response.");
        return;
    }

    const url:string = `${getAjaxOrigin()}/accounts/create`;

    fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({username, password})
    }).then(res => {
        if(res.status !== 404){
            res.text().then(text => res.ok ? cb(null, text) : cb(text));
        }
        else{
            cb("Server unavailable.");
        }
    }).catch(() => {
        cb("Server unavailable.");
    }).finally(() => {
        store.dispatch(setAccountPending(false));
    });

    store.dispatch(setAccountPending(true));
};

export const getAjaxOrigin = ():string => {
    const port:number = parseInt(new URLSearchParams(window.location.search).get("port")) || parseInt(window.location.port);

    if(window.location.origin.includes("localhost")){
        return `https://localhost:${port}`;
    }
    return window.location.origin;
};