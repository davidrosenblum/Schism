import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Store } from "redux";
import { App } from "./components/App";
import { rootReducer, AppState } from "./reducers";
import "./Client.css";

export const store:Store<AppState> = createStore(rootReducer);

const render = () => {
    ReactDOM.render(<App/>, document.getElementById("root"));
};

store.subscribe(render);

render();