import * as React from "react";
import "./Modal.css";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    header?:string;
    body?:string;
    footer?:string;
    open:boolean;
    onClose:(evt:React.MouseEvent<HTMLDivElement>)=>void;
}

export const Modal = (props:React.PropsWithChildren<Props>) => {
    const onModalClick = (evt:React.MouseEvent<HTMLDivElement>) => {
        evt.stopPropagation();
    };

    const {
        children, header=null, footer=null, open, onClose
    } = props;

    const className:string = `core modal ${props.className || ""}`;

    return open ? (
        <>
            <div className="core modal-shadow"/>
            <div className="core modal-container" onClick={onClose}>
                <div {...props} className={className} onClick={onModalClick}>
                    <div className="core modal-header">
                        {header}
                        <span className="core modal-x" onClick={onClose}>
                            &times;
                        </span>
                    </div>
                    <div className="core modal-body">
                        {children}
                    </div>
                    {
                        footer ? (
                            <div className="core modal-footer">
                                {footer}
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </>
    ) : null;
};