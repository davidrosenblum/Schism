import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Input, MenuContainer } from "./core";
import { setAccountModalOpen } from "../actions/AccountActions";
import { setAboutModalOpen } from "../actions/MenuActions";
import { AppState } from "../reducers";
import { requestLogin } from "../requests/AccountRequests";
import "./Login.css";

type Props = StateFromProps & DispatchFromProps;

export const Login = (props:Props) => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [remember, setRemember] = React.useState(false);

    React.useEffect(() => {
        // remember username from local storage
        const prevUser = window.localStorage.getItem("username");
        if(prevUser){
            setUsername(prevUser);
            setRemember(true);
        }

        // query string overrides
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        const user:string = params.get("username")
        const pass:string = params.get("password");

        if(user)
            setUsername(user);
        if(pass)
            setPassword(pass);
    }, []);

    const onUsername = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(evt.target.value);
    };

    const onPassword = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
    };

    const onRemember = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setRemember(evt.target.checked);
    };

    const onCreate = () => {
        if(!props.pendingLogin)
            props.openAccountModal();
    };

    const onAbout = () => {
        if(!props.pendingLogin)
            props.openAboutModal();
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        requestLogin(username, password);

        if(remember)
            window.localStorage.setItem("username", username);
        else
            window.localStorage.removeItem("username");
    };

    const disabled:boolean = props.pendingLogin;

    return (
        <MenuContainer className="text-center">
            <form onSubmit={onSubmit}>
                <div>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={onUsername}
                        disabled={disabled}
                        maxLength={15}
                        required
                    />
                </div>
                <div className="remember-me-container">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={remember}
                        onChange={onRemember}
                    />
                    <label htmlFor="remember-me">Remember me</label>
                </div>
                <br/>
                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={onPassword}
                        disabled={disabled}
                        maxLength={20}
                        required
                    />
                </div>
                <br/>
                <div>
                    <Button type="submit" disabled={disabled}>
                        Login
                    </Button>
                    &nbsp;
                    <Button type="button" disabled={disabled} onClick={onCreate}>
                        Create
                    </Button>
                    &nbsp;
                    <Button type="button" disabled={disabled} onClick={onAbout}>
                        About
                    </Button>
                </div>
            </form>
        </MenuContainer>
    );
};

interface StateFromProps{
    pendingLogin:boolean;
}

const mapStateFromProps = (state:AppState):StateFromProps => ({
    pendingLogin: state.account.pendingLogin
});

interface DispatchFromProps{
    openAboutModal:()=>void;
    closeAboutModal:()=>void;
    openAccountModal:()=>void;
    closeAccountModal:()=>void;
}

const mapDispatchFromProps = (dispatch:Dispatch):DispatchFromProps => ({
    openAboutModal: () => dispatch(setAboutModalOpen(true)),
    closeAboutModal: () => dispatch(setAboutModalOpen(false)),
    openAccountModal: () => dispatch(setAccountModalOpen(true)),
    closeAccountModal: () => dispatch(setAccountModalOpen(false))
});

export default connect(mapStateFromProps, mapDispatchFromProps)(Login);