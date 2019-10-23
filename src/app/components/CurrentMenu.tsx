import * as React from "react";
import { connect } from "react-redux";
import Login from "./Login";
import PlayerCreate from "./PlayerCreate";
import PlayerSelect from "./PlayerSelect";
import Overview from "./Overview";
import InGame from "./InGame";
import MapCreate from "./MapCreate";
import DevMapMaker from "./DevMapMaker";
import { Menu } from "../actions/MenuActions";
import { AppState } from "../reducers";


type Props = StateFromProps;

export const CurrentMenu = (props:Props) => {
    const {menu} = props;

    switch(menu){
        case "login":
            return <Login/>;

        case "player-create":
            return <PlayerCreate/>;

        case "player-select":
            return <PlayerSelect/>;

        case "overview":
            return <Overview/>;

        case "map-create":
            return <MapCreate/>;

        case "in-game":
            return <InGame/>;

        case "dev-map":
            return <DevMapMaker/>;

        default:
            return null;
    }
};

interface StateFromProps{
    menu:Menu;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    menu: state.menu.menu
});

export default connect(mapStateToProps)(CurrentMenu);