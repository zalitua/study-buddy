import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function Success({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Success!</Modal.Title>
      </Modal.Header>
      <Modal.Body>You have succesfully signed up to StudyBuddy!</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Success;
