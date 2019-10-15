import * as React from "react";
import { Button } from "./core";
import { HudChat } from "./HudChat";
import { HudPlayerStats } from "./HudPlayerStats";
import { HudTargetStats } from "./HudTargetStats";
import { store } from "../Client";
import { requestMapLeave } from "../requests/MapListRequests";
import "./InGame.css";

export const InGame = () => {
    React.useEffect(() => {
        
    }, []);

    const onExit = () => {
        if(!store.getState().mapList.pendingLeave){
            requestMapLeave();
        }
    };

    const disabled:boolean = store.getState().mapList.pendingLeave;

    return (
        <div className="game-container">
            <div className="hud-nav-container">
                <Button type="button" disabled={disabled} onClick={onExit}>
                    Exit
                </Button>
            </div>
            <br/>
            <div className="canvas-container">
                <canvas/>
            </div>
            <br/>
            <div className="hud-container">
                <HudPlayerStats/>
                &nbsp;
                <HudChat/>
                &nbsp;
                <HudTargetStats/>
            </div>
        </div>
    )
};