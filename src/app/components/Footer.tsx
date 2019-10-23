import * as React from "react";
import * as alchemy1 from "../assets/images/ui_alchemy_1.png";
import "./Footer.css";

const ICON_WIDTH:number = 64;

export const Footer = () => {
    return (
        <>
            <br/>
            <footer className="footer">
                <hr/>
                <div className="footer-items">
                    <img src={alchemy1} width={ICON_WIDTH}/>
                    &nbsp;
                    <span>
                        David Rosenblum | 2019
                    </span>
                    &nbsp;
                    <img src={alchemy1} width={ICON_WIDTH}/>
                </div>
            </footer>
        </>
    );
};

export default Footer;