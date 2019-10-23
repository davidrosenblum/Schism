import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { Button, Input, Modal } from "./core";
import { setAccountModalOpen } from "../actions/AccountActions";
import { AppState } from "../reducers";
import { requestAccount } from "../requests/AjaxRequests";

type Props = StateFromProps & DispatchFromProps;

export const AccountModal = (props:Props) => {
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

    const onModalClose = () => props.closeAccountModal();

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

    const {modalOpen, pendingAccount} = props;
    const disabled:boolean = pendingAccount;

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

interface StateFromProps{
    modalOpen:boolean;
    pendingAccount:boolean;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    modalOpen: state.account.modalOpen,
    pendingAccount: state.account.pendingAccount
});

interface DispatchFromProps{
    closeAccountModal:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    closeAccountModal: () => dispatch(setAccountModalOpen(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal);