import * as React from "react";
import { connect } from "react-redux";
import { Button } from "./core";
import { HudChat } from "./HudChat";
import HudPlayerStats from "./HudPlayerStats";
import HudTargetStats from "./HudTargetStats";
import { AppState } from "../reducers";
import { requestMapLeave } from "../requests/MapListRequests";
import "./InGame.css";

type Props = StateFromProps;

export const InGame = (props:Props) => {
    const canvasRef = React.useRef<HTMLCanvasElement>();
    
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const h:number = parseInt(params.get("h"));
        if(h)
            canvasRef.current.style.width = `${h * (1.77777)}px`;
            canvasRef.current.style.height = `${h}px`;
    }, []);

    const onExit = () => {
        if(!props.pendingLeave){
            requestMapLeave();
        }
    };

    const disabled:boolean = props.pendingLeave;

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

interface StateFromProps{
    pendingLeave:boolean;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    pendingLeave: state.mapList.pendingLeave
});

export default connect(mapStateToProps)(InGame);