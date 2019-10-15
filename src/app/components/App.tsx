import * as React from "react";
import { CurrentMenu } from "./CurrentMenu";
import { AccountModal } from "./AccountModal";
import { AlertModal } from "./AlertModal";
import { AboutModal } from "./AboutModal";
import { Banner } from "./Banner";
import { Footer } from "./Footer";
import { store } from "../Client";
import { showDevMap } from "../actions/MenuActions";
import { GfxTestManager } from "../game/GfxTestManager";

export const App = () => {
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if(params.get("test") === "true"){
            GfxTestManager.runTestMode();
        }
        else if(params.get("dev_map") === "true"){
            store.dispatch(showDevMap());
        }
    }, []);

    return (
        <div>
            <Banner/>
            <CurrentMenu/>
            <AccountModal/>
            <AlertModal/>
            <AboutModal/>
            <Footer/>
        </div>
    );
};