import * as React from "react";
import { connect } from "react-redux";
import { Button, MenuContainer } from "./core";
import { MapListTable } from "./MapListTable";
import { requestLogout } from "../requests/AccountRequests";
import { AppState } from "../reducers";

type Props = StateFromProps;

export const Overview = (props:Props) => {
    const checkDisabled = ():boolean => props.pendingLogout || props.pendingJoin;

    const onLogout = () => {
        if(!checkDisabled())
            requestLogout();
    };

    const disabled:boolean = checkDisabled();

    return (
        <MenuContainer>
            <div>
                <MapListTable
                    disabled={disabled}
                />
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

interface StateFromProps{
    pendingLogout:boolean;
    pendingJoin:boolean;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    pendingLogout: state.account.pendingLogout,
    pendingJoin: state.mapList.pendingJoin
});

export default connect(mapStateToProps)(Overview);