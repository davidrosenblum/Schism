import * as React from "react";
import { Button, MenuContainer } from "./core";
import { store } from "../Client";
import { PlayerSelectFigure } from "./PlayerSelectFigure";
import { requestLogout } from "../requests/AccountRequests";
import { requestPlayerList } from "../requests/PlayerListRequests";

export const PlayerSelect = () => {
    React.useEffect(() => {
        requestPlayerList();
    }, []);

    const checkDisabled = ():boolean => {
        const {playerList, account} = store.getState();

        const {
            pendingCreate, pendingSelect, pendingDelete
        } = playerList;

        const {pendingLogout} = account;

        return pendingCreate || pendingSelect || pendingDelete || pendingLogout;
    };

    const onLogout = () => {
        if(!checkDisabled())
            requestLogout();
    };

    const {
        pendingList, list
    } = store.getState().playerList;

    const loading:boolean = (pendingList || !list);
    const disabled:boolean = checkDisabled();

    return (
        <MenuContainer>
            {
                loading ? (
                    <div className="text-center">
                        Loading...
                    </div>
                ) : (
                    <PlayerSelectFigure
                        disabled={disabled}
                        list={list}
                    />
                )
            }
            <br/>
            <div className="text-center">
                <Button type="button" disabled={disabled} onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </MenuContainer>
    );
};