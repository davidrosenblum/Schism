import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, MenuContainer } from "./core";
import PlayerSelectFigure from "./PlayerSelectFigure";
import { showPlayerCreate } from "../actions/MenuActions";
import { AppState } from "../reducers";
import { requestLogout } from "../requests/AccountRequests";
import { requestPlayerList } from "../requests/PlayerListRequests";

type Props = StateFromProps & DispatchFromProps;

export const PlayerSelect = (props:Props) => {
    React.useEffect(() => {
        requestPlayerList();
    }, []);

    const checkDisabled = ():boolean => {
        const {
            pendingCreate, pendingSelect, pendingDelete, pendingLogout
        } = props;

        return pendingCreate || pendingSelect || pendingDelete || pendingLogout;
    };

    const onLogout = () => {
        if(!checkDisabled())
            requestLogout();
    };

    const {
        pendingList, list, showPlayerCreate
    } = props;

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
                        showPlayerCreate={showPlayerCreate}
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

interface StateFromProps{
    pendingList:boolean;
    pendingDelete:boolean;
    pendingSelect:boolean;
    pendingCreate:boolean;
    pendingLogout:boolean;
    list:any;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    pendingList: state.playerList.pendingList,
    pendingDelete: state.playerList.pendingDelete,
    pendingSelect: state.playerList.pendingSelect,
    pendingCreate: state.playerList.pendingCreate,
    pendingLogout: state.account.pendingLogout,
    list: state.playerList.list
});

interface DispatchFromProps{
    showPlayerCreate:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    showPlayerCreate: () => dispatch(showPlayerCreate())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSelect);