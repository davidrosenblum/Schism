import * as React from "react";
import { Button } from "./core";
import { Archetypes } from "../data/ArchetypeData";
import { PlayerListItem } from "../data/Payloads";
import { Keyboard } from "../gfx/Keyboard";
import { requestPlayerDelete, requestPlayerSelect } from "../requests/PlayerListRequests";
import "./PlayerSelectFigure.css";


const PLAYER_LIST_LENGTH:number = 6;

interface Props{
    disabled:boolean;
    list:PlayerListItem[]
    showPlayerCreate:()=>void;
}

export const PlayerSelectFigure = (props:React.PropsWithChildren<Props>) => {
    const [index, setIndex] = React.useState(0);
    const prevRef = React.useRef<HTMLButtonElement>();
    const nextRef = React.useRef<HTMLButtonElement>();
    const mainRef = React.useRef<HTMLButtonElement>();

    React.useEffect(() => {
        const keyboard = new Keyboard(document.body);
        
        keyboard.onKey = (evt) => {
            if(evt.key == "ArrowLeft")
                prevRef.current.click();
            else if(evt.key === "ArrowRight")
                nextRef.current.click();
            else if(evt.key === "Enter")
                mainRef.current.click();
        };

        return () => keyboard.stop();
    });

    const onPrev = () => {
        if(!props.disabled){
            const prev:number = index - 1;
            setIndex(prev >= 0 ? prev : PLAYER_LIST_LENGTH - 1);
        }
    };

    const onNext = () => {
        if(!props.disabled){
            const next:number = index + 1;
            setIndex(next < PLAYER_LIST_LENGTH ? next : 0);
        }
    };

    const onCreate = () => {
        if(!props.disabled)
            props.showPlayerCreate();
    };

    const selectTab = (index:number) => {
        if(!props.disabled)
            setIndex(index);
    };

    const selectPlayer = (name:string) => {
        if(!props.disabled)
            requestPlayerSelect(name);
    };

    const deletePlayer = (name:string) => {
        if(!props.disabled)
            requestPlayerDelete(name);
    };

    const {disabled, list} = props;

    const playerData = list[index] || null;

    const tabs = new Array(PLAYER_LIST_LENGTH);
    for(let i:number = 0, selected:string, empty:string; i < tabs.length; i++){
        selected = (i === index) ? "selected" : "not-selected";
        empty = (i in list) ? "not-empty" : "empty";
        tabs[i] = (
            <span key={i} className={`player-tab ${selected} ${empty}`} onClick={() => selectTab(i)}>
                {i+1}
            </span>
        )
    }

    return (
        <figure className="player-figure">
            <div className="player-data">
                <div>
                    {playerData ? playerData.name : "Empty Slot"}
                    {
                        playerData ? (
                            <span
                                className="player-delete"
                                title={`Delete ${playerData.name}`}
                                onClick={() => deletePlayer(playerData.name)}
                            >
                                &times;
                            </span>
                        ) : null
                    }
                </div>
                <div>
                    {
                        playerData ? (
                            `Level ${playerData.level} ${Archetypes[playerData.archetype].archetype}`
                        ) : <span>&nbsp;</span>
                    }
                </div>
            </div>
            <br/>
            <div className="text-center">
                <Button ref={prevRef} disabled={disabled} onClick={onPrev}>
                    &larr;
                </Button>
                &nbsp;
                <Button ref={mainRef} disabled={disabled} onClick={playerData ? () => selectPlayer(playerData.name) : onCreate}>
                    {playerData ? "Select" : "Create"}
                </Button>
                &nbsp;
                <Button ref={nextRef} disabled={disabled} onClick={onNext}>
                    &rarr;
                </Button>
            </div>
            <br/>
            <div className="text-center">
                {tabs}
            </div>
        </figure>
    )
};

export default PlayerSelectFigure;