/** @format */

import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';


const InfoConfirmationPopUp = ({
  show,
  fundraiserName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div>
      <Modal
        show={show}
        onHide={onCancel}
        className='authorizemodal info-confirmation-modal autorize-modal'
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title' style={{ fontSize: '16px' }}>
            Allow {fundraiserName} to contact you ?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='Container'>
            <Row>
              <Col sm={12} className='text-center'>
                <div className='guest-user-pop-up'>
                  <button
                    className='btn btn-donate-big btn-pay'
                    type='submit'
                    onClick={onConfirm}
                  >
                    Yes, share my Info
                  </button>
                  <button className='btn btn-back' onClick={onCancel}>
                    Continue as Anonymous
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default InfoConfirmationPopUp;
