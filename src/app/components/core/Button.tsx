import * as React from "react";
import "./Button.css";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
}

export const Button = (props:React.PropsWithChildren<Props>) => {
    const {children} = props;

    const className:string = `core ${props.className || ""}`;

    return (
        <button {...props} className={className}>
            {children}
        </button>
    );
};