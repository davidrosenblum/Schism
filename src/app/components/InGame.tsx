import * as React from "react";
import { Button } from "./core";
import { HudChat } from "./HudChat";
import { HudPlayerStats } from "./HudPlayerStats";
import { HudTargetStats } from "./HudTargetStats";
import { store } from "../Client";
import { requestMapLeave } from "../requests/MapListRequests";
import "./InGame.css";

export const InGame = () => {
    const canvasRef = React.useRef<HTMLCanvasElement>();
    
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const h:number = parseInt(params.get("h"));
        if(h)
            canvasRef.current.style.width = `${h * (1.77777)}px`;
            canvasRef.current.style.height = `${h}px`;
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
                <canvas ref={canvasRef}/>
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