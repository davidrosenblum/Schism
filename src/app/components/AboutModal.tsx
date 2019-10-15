import * as React from "react";
import { Modal } from "./core";
import { store } from "../Client";
import { setAboutModalOpen } from "../actions/MenuActions";
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

export const AboutModal = () => {
    const onClose = () => {
        store.dispatch(setAboutModalOpen(false));
    };

    const {aboutOpen} = store.getState().menu;

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