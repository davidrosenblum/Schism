import * as React from "react";
import "./Input.css";

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
}

export const Input = (props:Props) => {
    const {children, className, ...attributes} = props;
    
    const classNames:string[] = ["core", ...(className || "").split("")];

    return (
        <div className="core input-container">
            <input {...attributes} className={classNames.join(" ")}>
                {children}
            </input>
        </div>
    );
};