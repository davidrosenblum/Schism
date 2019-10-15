import * as React from "react";
import "./Select.css";

interface Props extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>{
}

export const Select = (props:React.PropsWithChildren<Props>) => {
    const {children} = props;

    const className:string = `core ${props.className || ""}`;

    return (
        <div className="core select-container">
            <select {...props} className={className}>
                {children}
            </select>
        </div>
    )
};