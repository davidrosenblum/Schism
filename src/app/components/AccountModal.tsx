import * as React from "react";
import { Button, Input, Modal } from "./core";
import { store } from "../Client";
import { setAccountModalOpen } from "../actions/AccountActions";
import { requestAccount } from "../requests/AjaxRequests";

export const AccountModal = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pwConfirm, setPwConfirm] = React.useState("");
    const [message, setMessage] = React.useState("");

    const onUsername = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(evt.target.value);
    };

    const onPassword = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPassword(evt.target.value);
    };

    const onPwConfirm = (evt:React.ChangeEvent<HTMLInputElement>) => {
        setPwConfirm(evt.target.value);
    };

    const onModalClose = () => {
        store.dispatch(setAccountModalOpen(false));
    };

    const onSubmit = (evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();

        if(password !== pwConfirm){
            setMessage("Passwords do not match.");
            return;
        }

        requestAccount(username, password, (err, res) => {
            setMessage(err || res);
            
            if(!err){
                setUsername("");
                setPassword("");
                setPwConfirm("");
            }
        });
    };

    const {modalOpen} = store.getState().account;

    const disabled:boolean = store.getState().account.pendingAccount;

    return (
        <Modal open={modalOpen} className="text-center" header="Account Registration" onClose={onModalClose}>
            <div>
                {message}
            </div>
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
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={pwConfirm}
                        onChange={onPwConfirm}
                        disabled={disabled}
                        maxLength={20}
                        required
                    />
                </div>
                <br/>
                <div>
                    <Button type="submit" disabled={disabled}>
                        Submit
                    </Button>
                </div>
            </form>
        </Modal>
    );
};