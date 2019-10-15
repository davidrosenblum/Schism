import * as React from "react";
import { Button, Input, MenuContainer, Select } from "./core";
import { store } from "../Client";
import { showPlayerSelect } from "../actions/MenuActions";
import { Archetypes } from "../data/ArchetypeData";
import { requestPlayerCreate } from "../requests/PlayerListRequests";

export const PlayerCreate = () => {
    const [name, setName] = React.useState("");
    const [archetypeIndex, setArchetypeIndex] = React.useState(1);

    const onName = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setName(evt.target.value);
    };

    const onArchetype = (evt:React.ChangeEvent<HTMLSelectElement>) => {
        setArchetypeIndex(parseInt(evt.target.value));
    };

    const onCancel = () => {
        if(!store.getState().playerList.pendingCreate){
            store.dispatch(showPlayerSelect());
        }
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        requestPlayerCreate(name, archetypeIndex);
    };

    const atOptions = Object.entries(Archetypes).map(([key, val], i) => {
        return (
            <option key={i} value={key}>
                {val.archetype}
            </option>
        );
    });

    const {
        description, role, icon, archetype
    } = Archetypes[archetypeIndex];

    const disabled:boolean = store.getState().playerList.pendingCreate;

    return (
        <MenuContainer>
            <form onSubmit={onSubmit}>
                <div>
                    <Input
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={onName}
                        disabled={disabled}
                        required
                    />
                </div>
                <br/>
                <div>
                    <Select value={archetypeIndex} onChange={onArchetype} disabled={disabled}>
                        {atOptions}
                    </Select>
                </div>
                <br/>
                <div>
                    <div className="text-center">
                        {archetype}
                    </div>
                    <div>
                        Role: {role}
                    </div>
                    <div>
                        {description}
                    </div>
                </div>
                <br/>
                <div className="text-center">
                    <img
                        src={icon}
                        height={128}
                        title={archetype}
                        onContextMenu={
                            evt => {
                                evt.preventDefault();
                                return false;
                            }
                        }
                    />
                </div>
                <br/>
                <div className="text-center">
                    <Button type="submit" disabled={disabled}>
                        Create
                    </Button>
                    &nbsp;
                    <Button type="button" disabled={disabled} onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </MenuContainer>
    );
};