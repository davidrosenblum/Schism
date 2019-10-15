import * as React from "react";
import "./MenuContainer.css";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
}

export const MenuContainer = (props:React.PropsWithChildren<Props>) => {
    const {children} = props;

    const className:string = `core menu ${props.className || ""}`;

    return (
        <div {...props} className={className}>
            {children}
        </div>
    );
};