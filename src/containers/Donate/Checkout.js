/** @format */

import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';
import PaypalCheckout from './PaypalCheckout';
import { frontUrl } from 'constants';
import { useHistory } from 'react-router-dom';
// stripe components
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { UserContext } from 'contexts/UserContext';
import PaypalCheckoutEmail from './PaypalCheckoutEmail';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripeClientSecret: null,
      show: true,
      cardNumber: '',
      expireDate: '',
      cvv: '',
      name: '',
      email: '',
      mobileNumber: '',
      nameError: '',
      emailError: '',
      stripeSessionLoading: false,
      openModalPopupForBasicInfo: true,
      orderMetadata: {}
    };
  }
  componentDidMount = () => {
    const { name, email } = this.state;
    const currentUser = this.context;

    this.setState({
      name: currentUser
        ? [
            this.props.profileData.profileInfo.first_name,
            this.props.profileData.profileInfo.last_name
          ].join(' ')
        : name,
      email: currentUser ? this.props.profileData.profileInfo.email : email
    });
  };

  handleStripeLoad = async () => {
    const {
      project,
      projectId,
      rewardId,
      directDonation,
      receiverId,
      totalAmount,
      tipAmount,
      tipPrecentage,
      isInfoSharable,
      comment,
      monthly
    } = this.props;

    const user = this.context;

    const { name, email, mobileNumber } = this.state;

    const data = {
      isSubscription: monthly,
      name,
      email,
      phone: mobileNumber,
      amount: totalAmount,
      tipPrecentage,
      tipAmount,
      projectId,
      project,
      rewardId,
      receiverId,
      directDonation,
      paymentBy: 'stripe',
      comment,
      isInfoSharable,
      ...(user ? { userId: user.userId } : {})
    };

    this.setState(() => ({ orderMetadata: data }));
    try {
      const response = await axios.post('/payment/stripe/create-payment-intent', data);
      this.setState(() => ({
        stripeClientSecret: response.data.clientSecret
      }));
    } catch (error) {}
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      ...this.state,
      [name]: value
    });
    if (!this.state.name) {
      this.setState({
        nameError: 'Please enter your name'
      });
    } else {
      this.setState({
        nameError: ''
      });
    }
  };

  handleModalClose = () => {
    const currentUser = this.context;
    this.setState({
      cardNumber: '',
      cvv: '',
      expireDate: '',
      name: currentUser ? this.props.profileData.profileInfo.first_name : '',
      expYear: '',
      mobileNumber: '',
      nameError: '',
      emailError: ''
    });
    if (!currentUser) {
      this.setState({
        name: '',
        email: ''
      });
    }
    this.props.handleClose();
  };

  handleStateForPopUp = () => {
    const { openModalPopupForBasicInfo } = this.state;
    this.setState({
      openModalPopupForBasicInfo: !openModalPopupForBasicInfo
    });
  };

  handleModal = () => {
    const { openModalPopupForBasicInfo, name } = this.state;
    let isNameError = 0;

    if (!name) {
      isNameError = 1;
    }

    if (isNameError === 1) {
      this.setState({
        nameError: 'Please enter your name'
      });
      return;
    }

    this.setState({
      nameError: '',
      openModalPopupForBasicInfo: !openModalPopupForBasicInfo
    });
  };

  render() {
    const { isStripeConnected, message, paypalMessage, isInfoSharable } = this.props;

    const { name, email, mobileNumber, nameError, stripeClientSecret, emailError, orderMetadata } =
      this.state;

    return (
      <div>
        {(!isInfoSharable || !this.state.openModalPopupForBasicInfo) && (
          <Modal
            show={this.props.show}
            onHide={this.handleModalClose}
            className="authorizemodal"
            backdrop={'static'}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                Your sponsorship will make a difference
              </Modal.Title>
            </Modal.Header>
            <StripeModalBody
              onLoad={this.handleStripeLoad}
              stripeClientSecret={stripeClientSecret}
              onInputChange={this.handleChange}
              isStripeConnected={isStripeConnected}
              message={message}
              paypalMessage={paypalMessage}
              name={name}
              email={email}
              mobileNumber={mobileNumber}
              amount={this.props.amount}
              orderMetadata={orderMetadata}
              {...this.props}
            />
          </Modal>
        )}
        {isInfoSharable && this.state.openModalPopupForBasicInfo && (
          <Modal
            show={this.props.show}
            onHide={this.handleModalClose}
            className="authorizemodal"
            backdrop={'static'}>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">
                Your sponsorship will make a difference
              </Modal.Title>
            </Modal.Header>
            <BasicInfoModalBody
              name={name}
              isLoggedIn={this.context}
              nameError={nameError}
              email={email}
              emailError={emailError}
              mobileNumber={mobileNumber}
              onInputChange={this.handleChange}
              onSubmit={this.handleModal}
            />
          </Modal>
        )}
      </div>
    );
  }
}

export const BasicInfoModalBody = ({
  name,
  nameError,
  email,
  isLoggedIn,
  emailError,
  mobileNumber,
  onInputChange,
  onSubmit
}) => {
  return (
    <Modal.Body>
      <h4 className="payment-info-heading ">Basic Information</h4>
      <div className="clearfix">
        <div className="form-group col-sm-12">
          <label htmlFor="name">Name</label>
          <span className="text-danger">*</span>
          <input
            type="text"
            className="form-control"
            placeholder="Ex. John"
            id="name"
            name="name"
            value={name}
            onChange={onInputChange}
          />
          {nameError ? <div className="text-danger">{nameError}</div> : ''}
        </div>
      </div>
      <div className="clearfix">
        <div className="form-group col-sm-12">
          <label htmlFor="name">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            id="email"
            name="email"
            disabled={isLoggedIn ? true : false}
            value={email}
            onChange={onInputChange}
          />
          {emailError ? <div className="text-danger">{emailError}</div> : ''}
        </div>
      </div>
      <div className="clearfix">
        <div className="form-group col-sm-12">
          <label>Mobile number</label>

          <InputMask
            mask="9999999999"
            className="form-control"
            name="mobileNumber"
            placeholder="xxx-xxx-xxxx"
            onChange={onInputChange}
            value={mobileNumber}
            maskChar={null}
          />
        </div>
      </div>

      <button className="btn btn-donate-big btn-next checkout-btn" onClick={onSubmit}>
        Next
        <i className="fa fa-arrow-right next-arrow"></i>
      </button>
    </Modal.Body>
  );
};

export const StripeModalBody = ({
  stripeClientSecret,
  onInputChange,
  onSubmit,
  isStripeConnected,
  isPaypalConnected,
  message,
  paypalMessage,
  name,
  comment,
  email,
  mobileNumber,
  amount,
  tipAmount,
  onLoad,
  receiverId,
  orderMetadata,
  planId,
  userId,
  user,
  projectName,
  ...props
}) => {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const history = useHistory();

  const options = {
    clientSecret: stripeClientSecret,
    appearance: stripeAppearance
  };
  const handlePaymentSuccessRedirect = (orderId) => {
    history.push({
      pathname: `/money-confirm/${orderId}`,
      state: {
        projectName,
        amount,
        userId,
        comment
      }
    });
  };
  return (
    <Modal.Body>
      <div className="authorize-form">
        <div className="form-group text-center clearfix">
          <div className="checkout-footer-btn">
            {isStripeConnected && stripeClientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <StripeSessionPay
                  onSuccessRedirect={handlePaymentSuccessRedirect}
                  clientSecret={stripeClientSecret}
                  amount={amount}
                />
              </Elements>
            )}
            {!stripeClientSecret && isStripeConnected && (
              <button className="btn btn-donate-big btn-pay" disabled>
                Please wait...
              </button>
            )}
            {!isStripeConnected && (
              <div className="custom-tooltip-wrap">
                <div className="tooltip-inner">
                  <div>{message}</div>
                </div>

                <div className="disabled-wrap">
                  <button
                    className={`btn btn-donate-big btn-pay ${
                      !isStripeConnected ? 'donate-disbaled-btn' : ''
                    }`}
                    disabled
                    type="button">
                    <FormattedAmount amount={amount} />
                    Sponsor
                  </button>
                </div>
              </div>
            )}
           <PaypalCheckout
              isStripeConnected={isStripeConnected}
              onSuccessRedirect={handlePaymentSuccessRedirect}
              amount={amount}
              tipAmount={tipAmount}
              message={paypalMessage}
              receiverId={receiverId}
              metadata={orderMetadata}
              planId={planId}
              isSubscription={props.monthly}
            />
            {/* <PaypalCheckoutEmail
              isStripeConnected={isStripeConnected}
              onSuccessRedirect={handlePaymentSuccessRedirect}
              amount={amount}
              receiverId={receiverId}
              metadata={orderMetadata}
              planId={planId}
              isSubscription={props.monthly}
            /> */}
          </div>
        </div>
      </div>
    </Modal.Body>
  );
};

const stripeAppearance = {
  theme: 'stripe'
};

export const StripeSessionPay = ({ clientSecret, amount, onSuccessRedirect }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          // setMessage('Something went wrong.');
          break;
      }
    });
  }, [clientSecret, stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${frontUrl}/money-confirm`
      },
      redirect: 'if_required'
    });

    if (!error) {
      onSuccessRedirect(paymentIntent.id);
      return;
    }
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occured.');
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <div className="custom-tooltip-wrap">
        <div className="disabled-wrap">
          <button
            className={`btn btn-donate-big btn-pay mt-4`}
            disabled={isLoading || !stripe || !elements}
            type="submit">
            <FormattedAmount amount={amount} />
            Sponsor
          </button>
        </div>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message pt-2 text-danger">{message}</div>}
    </form>
  );
};

export const FormattedAmount = ({ amount }) => {
  return (
    <span className="donate-amount-pay">
      {amount
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount)
        : '$0.00'}{' '}
    </span>
  );
};

Checkout.contextType = UserContext;

const mapStateToProps = (state) => {
  return {
    profileData: state.ProfileReducer
  };
};

export default connect(mapStateToProps)(Checkout);
