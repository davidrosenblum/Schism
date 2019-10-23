import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "./core";
import { hideAlertModal } from "../actions/AlertModalActions";
import { AppState } from "../reducers";

type Props = StateFromProps & DispatchFromProps;

export const AlertModal = (props:Props) => {
    const onModalClose = () => props.closeAlertModal();

    const {
        modalOpen, header, body, footer
    } = props;

    return (
        <Modal open={modalOpen} header={header} footer={footer} onClose={onModalClose}>
            <div className="text-center">
                {body}
            </div>
        </Modal>
    );
};

interface StateFromProps{
    modalOpen:boolean;
    header:string;
    body:string;
    footer:string;
}

const mapStateToProps = (state:AppState):StateFromProps => ({
    ...state.alertModal
});

interface DispatchFromProps{
    closeAlertModal:()=>void;
}

const mapDispatchToProps = (dispatch:Dispatch):DispatchFromProps => ({
    closeAlertModal: () => dispatch(hideAlertModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal);