import * as React from "react";
import "./Button.css";

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
}

export const Button = React.forwardRef((props:React.PropsWithChildren<Props>, ref:React.Ref<HTMLButtonElement>) => {
    const {children, className="", ...attributes} = props;

    const classNames:string = `core ${className}`.trim();

    return (
        <button ref={ref} className={classNames} {...attributes}>
            {children}
        </button>
    );
});