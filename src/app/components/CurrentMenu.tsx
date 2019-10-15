import * as React from "react";
import { store } from "../Client";
import { Login } from "./Login";
import { PlayerCreate } from "./PlayerCreate";
import { PlayerSelect } from "./PlayerSelect";
import { Overview } from "./Overview";
import { InGame } from "./InGame";
import { MapCreate } from "./MapCreate";
import { DevMapMaker } from "./DevMapMaker";

export const CurrentMenu = () => {
    const {menu} = store.getState().menu;

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