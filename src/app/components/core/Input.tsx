import * as React from "react";
import "./Input.css";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
}

export const Input = (props:Props) => {
    const {children} = props;

    const className:string = `core ${props.className || ""}`;

    return (
        <div className="core input-container">
            <input {...props} className={className}>
                {children}
            </input>
        </div>
    );
};