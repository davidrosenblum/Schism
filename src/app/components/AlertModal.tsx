import * as React from "react";
import { Modal } from "./core";
import { store } from "../Client";
import { hideAlertModal } from "../actions/AlertModalActions";

export const AlertModal = () => {
    const onModalClose = () => {
        store.dispatch(hideAlertModal());
    };

    const {
        modalOpen, header, body, footer
    } = store.getState().alertModal;

    return (
        <Modal open={modalOpen} header={header} footer={footer} onClose={onModalClose}>
            <div className="text-center">
                {body}
            </div>
        </Modal>
    );
};