/** @format */

import { Modal } from 'react-bootstrap';
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Guestcheckout extends Component {
  handleRedirection = () => {
    const { location: {pathname} } = this.props;
    localStorage.setItem('redirectionUrl', pathname);
  };
  render() {
    const { show } = this.props;
    return (
      <div>
        <Modal
          show={show}
          onHide={this.props.handleClose}
          className='authorizemodal autorize-modal'
        >
          <Modal.Header closeButton>
            <Modal.Title
              id='contained-modal-title'
              style={{ fontSize: '16px' }}
            >
              {/* You're currently browsing as Guest User,
              <div>Why not join us for free?</div> */}
              Join or Login now to manage donations on your account dashboard.
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='Container'>
              <Row>
                <Col sm={12} className='text-center'>
                  <div className='guest-user-pop-up'>
                    <Link
                      to={{
                        pathname: '/join',
                        state: {
                          urlToredirect: this.props.location
                            ? this.props.location.pathname
                            : null,
                        },
                      }}
                    >
                      <button
                        className='btn btn-donate-big btn-pay'
                        type='submit'
                        onClick={this.handleRedirection}
                      >
                        Join/Login
                      </button>
                    </Link>
                    <button
                      className='btn btn-back'
                      onClick={this.props.handleGuest}
                    >
                      Continue as guest
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default Guestcheckout;
