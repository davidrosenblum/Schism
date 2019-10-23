import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, Store } from "redux";
import App from "./components/App";
import { rootReducer, AppState } from "./reducers";
import "./index.css";

export const store:Store<AppState> = createStore(rootReducer);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);