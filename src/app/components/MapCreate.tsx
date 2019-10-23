import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Input, MenuContainer, Select } from "./core";
import { showOverview } from "../actions/MenuActions";
import { MapTypes, MapDifficulties } from "../data/MapData";
import { requestMapCreate } from "../requests/MapListRequests";
import { AppState } from "../reducers";

type Props = StateFromProps & DispatchFromProps;

export const MapCreate = (props:Props) => {
    const [mapTypeIdx, setMapTypeIdx] = React.useState(0);
    const [difficultyIdx, setDifficultyIdx] = React.useState(0);
    const [customName, setCustomName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onMapType = (evt:React.ChangeEvent<HTMLSelectElement>) => {
        const index:number = parseInt(evt.target.value);
        setMapTypeIdx(index);
    };

    const onDifficulty = (evt:React.ChangeEvent<HTMLSelectElement>) => {
        const index:number = parseInt(evt.target.value);
        setDifficultyIdx(index);
    };

    const onCustomName = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setCustomName(evt.target.value);
    };

    const onPassword = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
    };

    const onCancel = () => {
        if(!props.pendingCreate)
            props.showOverview();
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const {mapType} = MapTypes[mapTypeIdx];
        const {value} = MapDifficulties[difficultyIdx];
        requestMapCreate(mapType, value, customName, password);
    };

    const mapOptions = MapTypes.map((val, i) => {
        return (
            <option key={i} value={i}>
                {val.mapName}
            </option>
        );
    });

    const difficultyOptions = MapDifficulties.map((val, i) => {
        return (
            <option key={i} value={i}>
                {val.difficulty}
            </option>
        );
    });

    const {enemyType} = MapTypes[mapTypeIdx];
    const [enemyLvlMin, enemyLvlMax] = MapDifficulties[difficultyIdx].levels;

    const disabled:boolean = props.pendingCreate;
    
    return (
        <MenuContainer>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Map Type</label>
                    <Select value={mapTypeIdx} disabled={disabled} onChange={onMapType}>
                        {mapOptions}
                    </Select>
                </div>
                <br/>
                <div>
                    <label>Difficulty</label>
                    <span style={{float: "right"}}>
                        ({enemyType} enemies levels {enemyLvlMin}-{enemyLvlMax})
                    </span>
                    <Select value={difficultyIdx} disabled={disabled} onChange={onDifficulty}>
                        {difficultyOptions}
                    </Select>
                </div>
                <br/>
                <div>
                    <label>Public Name</label>
                    <Input
                        type="text"
                        value={customName}
                        onChange={onCustomName}
                        disabled={disabled}
                        maxLength={15}
                        required
                    />
                </div>
                <br/>
                <div>
                    <label>Optional Password</label>
                    <Input
                        type="text"
                        value={password}
                        onChange={onPassword}
                        disabled={disabled}
                        maxLength={15}
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

interface StateFromProps{
    pendingCreate:boolean;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    pendingCreate: state.mapList.pendingCreate
});

interface DispatchFromProps{
    showOverview:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    showOverview: () => dispatch(showOverview())
});

export default connect(mapStateToProps, mapDispatchToProps)(MapCreate);