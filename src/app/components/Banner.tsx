import * as React from "react";
import * as logo from "../assets/images/ui_logo.png";
import "./Banner.css";

export const Banner = () => {
    return (
        <header className="banner">
            <img
                src={logo}
                height={225}
            />
        </header>
    );
};