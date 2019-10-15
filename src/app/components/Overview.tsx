import * as React from "react";
import { Button, MenuContainer } from "./core";
import { MapListTable } from "./MapListTable";
import { store } from "../Client";
import { requestLogout } from "../requests/AccountRequests";

export const Overview = () => {
    const checkDisabled = ():boolean => {
        const {account, mapList} = store.getState();
        return account.pendingLogout || mapList.pendingJoin;
    };

    const onLogout = () => {
        if(!checkDisabled()){
            requestLogout();
        }
    };

    const disabled:boolean = checkDisabled();

    return (
        <MenuContainer>
            <div>
                <MapListTable disabled={disabled}/>
            </div>
            <br/>
            <div className="text-center">
                <Button type="button" disabled={disabled} onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </MenuContainer>
    );
};