import * as React from "react";
import { Button, MenuContainer } from "./core";
import { store } from "../Client";
import { showPlayerCreate } from "../actions/MenuActions";
import { Archetypes } from "../data/ArchetypeData";
import { requestLogout } from "../requests/AccountRequests";
import { requestPlayerSelect, requestPlayerList, requestPlayerDelete } from "../requests/PlayerListRequests";
import "./PlayerSelect.css";

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
        if(!checkDisabled()){
            requestLogout();
        }
    };

    const onCreate = () => {
        if(!checkDisabled()){
            store.dispatch(showPlayerCreate());
        }
    };

    const selectPlayer = (name:string) => {
        if(!checkDisabled()){
            requestPlayerSelect(name);
        }
    };

    const deletePlayer = (name:string) => {
        if(!checkDisabled()){
            requestPlayerDelete(name);
        }
    };

    const {
        pendingList, list
    } = store.getState().playerList;

    if(pendingList || !list){
        return <div>Loading...</div>;
    }

    const disabled:boolean = checkDisabled();

    const cells = list.map((val, i) => {
        const {name, level, archetype} = val;

        return (
            <figure key={i} className="player-container">
                <div>
                    {name}
                </div>
                <div>
                    Level {level} &nbsp;
                    {Archetypes[archetype] ? Archetypes[archetype].archetype : "Unknown Archetype?"}
                </div>
                <br/>
                <div>
                    <Button type="button" disabled={disabled} onClick={() => selectPlayer(name)}>
                        Select
                    </Button>
                    &nbsp;
                    <Button type="button" disabled={disabled} onClick={() => deletePlayer(name)}>
                        Delete
                    </Button>
                </div>
            </figure>
        );
    });

    while(cells.length < 6){
        cells.push(
            <figure key={cells.length} className="player-container">
                <div>
                    Empty Slot
                </div>
                <br/>
                <div>
                    <Button type="button" disabled={disabled} onClick={onCreate}>
                        Create
                    </Button>
                </div>
            </figure>
        )
    }

    return (
        <MenuContainer>
            <div>
                {cells}
            </div>
            <div className="text-center">
                <Button type="button" disabled={disabled} onClick={onLogout}>
                    Logout
                </Button>
            </div>
        </MenuContainer>
    );
};