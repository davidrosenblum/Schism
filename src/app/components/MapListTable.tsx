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

    React.useEffect(() => {
        const {list} = store.getState().mapList;
        if(selectedMap && list && !list.find(val => val && val.id === selectedMap.id))
            setSelectedMap(null);
    });

    const onFilter = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setFilter(evt.target.value.toLowerCase());
    };

    const onPassword = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
    };

    const onRefresh = () => {
        if(!store.getState().mapList.pendingJoin)
            requestMapList();
    };

    const onCreate = () => {
        if(!store.getState().mapList.pendingJoin)
            store.dispatch(showMapCreate());
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if(selectedMap)
            requestMapJoin(selectedMap.id, password); 
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

    const filteredList = filter ? list.filter(val => {
        return val.customName.toLowerCase().includes(filter) ||
            val.type.toLowerCase().includes(filter) ||
            val.population.toString().includes(filter) ||
            val.populationLimit.toString().includes(filter)
    }) : list;

    const rows = filteredList.slice(0, 20).map((val, i) => {
        const {
            type, customName, difficulty, population, populationLimit, id
        } = val;

        const selectedTr:boolean = selectedMap && selectedMap.id === id;
        const cname:string = `map-list-item ${selectedTr ? "selected" : ""}`.trim();

        return (
            <tr key={i} className={cname} onClick={() => setSelectedMap(selectedMap === val ? null : val)}>
                <td>{type}</td>
                <td>{customName}</td>
                <td>{MapDifficulties[difficulty - 1].difficulty}</td>
                <td>{population}/{populationLimit}</td>
            </tr>
        );
    });

    const disabled:boolean = props.disabled || false;

    return (
        <form onSubmit={onSubmit}>
            <div>
                <Table className="map-list-table">
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
                <div className="text-center">
                    <Button type="submit" disabled={disabled || !selectedMap}>
                        Join
                    </Button>
                    &nbsp;
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
                    (selectedMap && selectedMap.hasPassword) ? (
                        <>
                            <div>{selectedMap.customName} is password protected.</div>
                            <br/>
                            <Input
                                placeholder="Enter map password"
                                value={password}
                                disabled={disabled}
                                onChange={onPassword}
                                maxLength={15}
                                required
                            />
                        </>
                    ) : null
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
                    maxLength={15}
                />
            </div>
        </form>
    );
};