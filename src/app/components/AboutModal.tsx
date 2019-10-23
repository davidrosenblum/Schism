import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "./core";
import { setAboutModalOpen } from "../actions/MenuActions";
import { AppState } from "../reducers";
import "./AboutModal.css";


const stack:[string, string][] = [
    ["MongoDB", "https://www.mongodb.com/"],
    ["Express", "https://expressjs.com/"],
    ["React/Redux", "https://reactjs.org/"],
    ["Node.js", "https://nodejs.org/en/about/"],
    ["Canvas", "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"],
    ["WebSockets", "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"],
    ["TypeScript", "http://www.typescriptlang.org/"],
    ["Webpack", "https://webpack.js.org/"],
];

type Props = StateFromProps & DispatchFromProps;

export const AboutModal = (props:Props) => {
    const onClose = () => props.closeAboutModal();

    const {aboutOpen} = props;

    const listItems = stack.map((tech, i) => {
        const [name, url] = tech;
        return (
            <li key={i}>
                <a href={url} target="_blank">
                    {name}
                </a>
            </li>
        );
    })

    return (
        <Modal open={aboutOpen} header={"About"} onClose={onClose}>
            <div className="about-container">
                <div>
                    Schism takes advantage of the MERN stack. 
                    <ul>
                        {listItems.slice(0, 4)}
                    </ul>
                </div>
                <div>
                    Other native APIs are used too.
                    <ul>
                        {listItems.slice(4, 6)}
                    </ul>
                </div>
                <div>
                    Module bundling and codebase managment.
                    <ul>
                        {listItems.slice(6)}
                    </ul>
                </div>
            </div>
        </Modal>
    )
};

interface StateFromProps{
    aboutOpen:boolean;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    aboutOpen: state.menu.aboutOpen
});

interface DispatchFromProps{
    closeAboutModal:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    closeAboutModal: () => dispatch(setAboutModalOpen(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);