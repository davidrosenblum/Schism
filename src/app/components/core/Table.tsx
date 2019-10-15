import * as React from "react";
import "./Table.css";

interface Props extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>{
}

export const Table = (props:React.PropsWithChildren<Props>) => {
    const {children} = props;

    const className:string = `core ${props.className || ""}`.trim();

    return (
        <div className="core table-container">
            <table {...props} className={className}>
                {children}
            </table>
        </div>
    );
};