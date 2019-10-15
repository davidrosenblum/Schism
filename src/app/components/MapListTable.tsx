import * as React from "react";
import { Input, Button, Table } from "./core";
import { store } from "../Client";
import { showMapCreate } from "../actions/MenuActions";
import { MapDifficulties } from "../data/MapData";
import { MapListItem } from "../data/Payloads";
import { requestMapList, requestMapJoin } from "../requests/MapListRequests";
import "./MapListTable.css";

interface Props{
    disabled?:boolean;
}

export const MapListTable = (props:Props) => {
    const [filter, setFilter] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [selectedMap, setSelectedMap] = React.useState<MapListItem>(null);

    React.useEffect(() => {
        requestMapList();
    }, []);

    React.useEffect(() => {
        setPassword("");
    }, [selectedMap]);

    const onFilter = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setFilter(evt.target.value.toLowerCase());
    };

    const onPassword = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
    };

    const onRefresh = () => {
        requestMapList();
    };

    const onCreate = () => {
        if(!store.getState().mapList.pendingJoin){
            store.dispatch(showMapCreate());
        }
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if(selectedMap){
            requestMapJoin(selectedMap.id, password);
        }
    };

    const {pendingList, list} = store.getState().mapList;

    if(pendingList || !list){
        return <div>Loading...</div>;
    }

    if(!pendingList && list && !list.length){
        return (
            <div className="text-center">
                <div>There are currently no maps to join.</div>
                <br/>
                <div>
                    <Button type="button" onClick={onRefresh}>
                        Refresh
                    </Button>
                    &nbsp;
                    <Button type="button" onClick={onCreate}>
                        Create
                    </Button>
                </div>
            </div>
        );
    }

    // const difficulties = Object.values(MapDifficulties).map((val, i) => {
    //     const {difficulty, levels} = val;
    //     const [min, max] = levels;

    //     return (
    //         <div key={i}>
    //             {difficulty}: enemy levels {min}-{max}
    //         </div>
    //     )
    // });

    const filteredList = list.filter(val => {
        return val.customName.toLowerCase().includes(filter) ||
            val.type.toLowerCase().includes(filter) ||
            val.population.toString().includes(filter) ||
            val.populationLimit.toString().includes(filter)
    });

    const rows = filteredList.slice(0, 20).map((val, i) => {
        const {
            type, customName, difficulty, population, populationLimit, id
        } = val;

        const selectedTr:boolean = selectedMap && selectedMap.id === id;
        const cname:string = `map-list-item ${selectedTr ? "selected" : ""}`.trim();

        return (
            <tr key={i} className={cname} onClick={() => setSelectedMap(val)}>
                <td>{type}</td>
                <td>{customName}</td>
                <td>{MapDifficulties[difficulty - 1].difficulty}</td>
                <td>{population} / {populationLimit}</td>
                {/* <td>
                    <Button type="button" disabled={disabled} onClick={() => setSelectedMap(val)}>
                        Select
                    </Button>
                </td> */}
            </tr>
        );
    });

    const disabled:boolean = props.disabled || false;

    return (
        <form onSubmit={onSubmit}>
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>Map Type</th>
                            <th>Name</th>
                            <th>Difficulty</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                <br/>
                <div>
                    <Button type="button" disabled={disabled} onClick={onRefresh}>
                        Refresh
                    </Button>
                    &nbsp;
                    <Button type="button" disabled={disabled} onClick={onCreate}>
                        Create
                    </Button>
                </div>
            </div>
            <br/>
            <div>
                {
                    selectedMap ? (
                        <>
                        <div>
                            Do you want to join {selectedMap.customName} ({selectedMap.type})?
                        </div>
                        <div>
                            {
                                selectedMap.hasPassword ? (
                                    <>
                                        <br/>
                                        <Input
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={onPassword}
                                            disabled={disabled}
                                            required
                                        />
                                    </>
                                ) : null
                            }
                        </div>
                        <br/>
                        <div>
                            <Button type="submit" disabled={disabled}>
                                Join
                            </Button>
                        </div>
                        </>
                    ) : (
                        <div>
                            Please select a map from the table below.
                        </div>
                    )
                }
            </div>
            <br/>
            <div>
                Found {list.length} maps (showing {rows.length}).
                {/* {filteredList.length} */}
            </div>
            <br/>
            <div>
                <Input
                    type="text"
                    placeholder="Filter"
                    value={filter}
                    onChange={onFilter}
                    disabled={disabled}
                />
            </div>
        </form>
    );
};