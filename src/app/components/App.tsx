import * as React from "react";
import { connect } from "react-redux";
import AboutModal from "./AboutModal";
import AccountModal from "./AccountModal";
import AlertModal from "./AlertModal";
import CurrentMenu from "./CurrentMenu";
import Banner from "./Banner";
import Footer from "./Footer";
import { showDevMap } from "../actions/MenuActions";
import { GfxTestManager } from "../game/GfxTestManager";
import { AppState } from "../reducers";
import { Dispatch } from "redux";

type Props = StateFromProps & DispatchFromProps;

export const App = (props:Props) => {
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if(params.get("test") === "true"){
            GfxTestManager.runTestMode();
        }
        else if(params.get("dev_map") === "true"){
            props.showDevMap();
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

interface StateFromProps{
}

const mapStateToProps = (state:AppState):StateFromProps => ({
});

interface DispatchFromProps{
    showDevMap:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    showDevMap: () => dispatch(showDevMap())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);