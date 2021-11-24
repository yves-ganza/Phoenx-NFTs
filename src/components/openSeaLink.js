import React from "react";
import {Modal} from "react-bootstrap";

export default function OpenSeaLink(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    WooHoo! Your NFT was Minted
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Check it out on OpenSea</h4>
                <a href={props.link} rel='noreferrer' target='_blank'>View Your NFT</a>
            </Modal.Body>
        </Modal>
    );
}