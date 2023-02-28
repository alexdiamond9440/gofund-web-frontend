/** @format */

import React, { Component } from 'react';
import 'rc-datepicker/lib/style.css';
import { Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import queryString from 'query-string';

import { instance } from '../../helpers/ipInstance';
import { donationValidator } from '../../helpers/donationValidator';
import CountryData from '../../common/countries.json';
import stateData from '../../common/state.json';
import { PaypalOnboarding } from 'components/Paypal/Onboarding/PaypalOnboarding';
import Loader from '../../components/Loader';
import AddAccountInfo from './AddAccountInfo';
import { UserContext } from 'contexts/UserContext';
// import { PaypalForm } from 'components/Paypal/PaypalForm';

const getStatesByCountryId = (countryId) => {
  return stateData.filter((state) => parseInt(state.countryid) === parseInt(countryId));
};

class DonationSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsFetching: false,
      file: '',
      routingNumber: '',
      accountNumber: '',
      ssn: '',
      personalIdNumber: '',
      ip: '',
      dateOfBirth: '',
      email: '',
      mobileNumber: '',
      fileData: Object,
      isSubmitted: false,
      imgError: '',
      isDataLoading: false,
      isMoreInfo: false,
      lgShow: false,
      errMsg: {},
      isError: true,
      isLoading: false,
      isPhotoIdUploading: false,
      paymentMethod: 'stripe',
      address: '',
      stateName: '',
      cityName: '',
      postalCode: '',
      stripeMobileNumber: '',
      stripeConnectedAccountStatus: null,
      paypalOnboardingStatus: null,
      paypalImage: '',
      paypalImageErr: '',
      paypalFileData: Object,
      paypalCountryId: '',
      paypalState: '',
      paypalCity: '',
      paypalStateOptions: [],
      isPersonalInputFieldBlur: '',
      isStripeLinkLoading: false,
      isPaypalLinkLoading: false,
      accountId: '',
      futureVerfication: [],
      isModalShow: false,
      previousAccountNumber: '',
      previousRoutingNumber: '',
      accountType: 'standard',
      isPaypalConnected: false
    };
  }
  componentDidMount() {
    const { search } = this.props.location;
    let queryParam = queryString.parse(search);
    const { regeneratelink } = queryParam;
    if (regeneratelink) {
      this.generateLink();
    }
    instance.get('').then((response) => {
      this.setState({ ip: response.data.ip });
    });
    this.getDonationData();
  }

  getDonationData = async () => {
    this.setState({ isDetailsFetching: true });
    const userData = this.context;
    try {
      const response = await axios.get(`/donations/donation-data?userId=${userData.userId}`);
      const {
        data: donationData,
        stripeConnectedAccountStatus,
        paypalOnboardingStatus,
        isPaypalConnected
      } = response.data;
      const { paypal_country } = donationData;
      const filteredCountry = CountryData.filter((country) => paypal_country === country.name)[0];
      const countryId = filteredCountry ? filteredCountry.id : '';
      const stateList = getStatesByCountryId(countryId);

      if (countryId) {
        this.setState({
          paypalStateOptions: stateList
        });
      }
      const { futureVerfication, externalAccount } = stripeConnectedAccountStatus;

      if (externalAccount && externalAccount.data && externalAccount.data.length) {
        let accountInfo = externalAccount.data.find((item) => item.default_for_currency === true);
        this.setState({
          previousAccountNumber: accountInfo.last4,
          previousRoutingNumber: accountInfo.routing_number
        });
      }
      if (
        futureVerfication &&
        futureVerfication.fields_needed &&
        futureVerfication.fields_needed.length
      ) {
        const data = {
          'legal_entity.address.city': 'Address',
          'legal_entity.address.line1': 'Address',
          'legal_entity.address.postal_code': 'Address',
          'legal_entity.address.state': 'Address',
          'legal_entity.personal_address.city': 'Address',
          'legal_entity.personal_address.line1': 'Address',
          'legal_entity.personal_address.postal_code': 'Address',
          'legal_entity.personal_address.state': 'Address',
          'legal_entity.personal_email': 'Email',
          'legal_entity.personal_phone_number': "Representative's phone number",
          'legal_entity.personal_id_number': 'SSN'
        };
        let tempData = [];
        futureVerfication.fields_needed.map((value) => {
          tempData = [...tempData, data[value]];
          return true;
        });
        tempData = [...new Set(tempData)];
        this.setState({
          futureVerfication: tempData
        });
      }
      this.setState({
        ssn: donationData.ssn || '',
        dateOfBirth: donationData.date_of_birth || '',
        file: donationData.identity_doc,
        email: donationData.paypal_email || '',
        mobileNumber: donationData.paypal_mobile || '',
        cityName: donationData.city || '',
        address: donationData.address || '',
        postalCode: donationData.postal_code || '',
        stripeMobileNumber: donationData.phone || '',
        stateName: donationData.state || '',
        paypalImage: donationData.paypal_photo_id || '',
        paypalCity: donationData.paypal_city || '',
        paypalCountryId: countryId || '',
        paypalState: donationData.paypal_state || '',
        stripeConnectedAccountStatus,
        paypalOnboardingStatus,
        isDetailsFetching: false,
        accountId: donationData.account_id,
        accountType: stripeConnectedAccountStatus.accountType,
        isPaypalConnected
      });
    } finally {
      this.setState({ isDetailsFetching: false });
    }
  };

  handleDobChange = (date) => {
    this.setState({ dateOfBirth: date });
  };

  handleChange = (event) => {
    const { paymentMethod } = this.state;
    const { name, value } = event.target;

    if (paymentMethod === 'stripe') {
      if (
        name === 'personalIdNumber' ||
        name === 'routingNumber' ||
        name === 'accountNumber' ||
        name === 'idNumber'
      ) {
        if (isNaN(value)) {
          return;
        }
      }
    }
    this.setState({
      [name]: value,
      errMsg: {
        ...this.state.errMsg,
        [name]: ''
      }
    });
    if (name === 'paypalCountryId') {
      this.setState({
        paypalStateOptions: getStatesByCountryId(value)
      });
    }
  };
  handleModelShow = () => {
    this.setState({ isModalShow: true });
  };
  handleModelClose = () => {
    this.setState({ isModalShow: false, accountNumber: '', routingNumber: '' });
  };

  onPersonalIdBlur = () => {
    this.setState({
      isPersonalInputFieldBlur: true
    });
  };

  onPersonalIdFocus = () => {
    this.setState({
      isPersonalInputFieldBlur: false
    });
  };

  updateStripeConnectedAccount = (data) => {
    const userData = this.context;
    axios
      .post('/donations/create-external-account', {
        ...data,
        userId: userData.userId
      })
      .then((response) => {
        toastr.success('Success', response.data.message);
        this.getDonationData();
        this.setState({
          isDataLoading: false,
          isModalShow: false,
          isLoading: false,
          stripeConnectedAccountStatus: response.data.stripeConnectedAccountStatus
        });
      })
      .catch((err) => {
        this.setState({ isDataLoading: false, isLoading: false });
        if (!err.response.data.error) {
          toastr.error('Error', err.response.data.message);
        } else {
          toastr.error('Error', err.response.data.error.message);
        }
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, paypalCity, mobileNumber, paypalState, paymentMethod, accountId, ip } =
      this.state;
    var that = this;
    const userData = this.context;

    if (paymentMethod === 'stripe') {
      const data = {
        routingNumber: that.state.routingNumber,
        accountNumber: that.state.accountNumber,
        accountId: accountId,
        ip: ip,
        userId: userData.userId
      };

      const valid = donationValidator({ ...data }, 'stripe');

      if (!valid.formIsValid) {
        this.setState({ errMsg: valid.errors, isLoading: false });
        return;
      }

      this.updateStripeConnectedAccount(data);

      this.setState({
        isSubmitted: true,
        isDataLoading: true
      });
    }
    if (paymentMethod === 'paypal') {
      const { paypalCountryId } = this.state;
      const filteredCountry = CountryData.filter(
        (country) => parseInt(paypalCountryId) === parseInt(country.id)
      )[0];
      const countryNameById = filteredCountry ? filteredCountry.name : '';

      const valid = donationValidator(
        {
          email,
          mobileNumber,
          paypalCity,
          paypalCountryId,
          paypalState,
          file: this.state.paypalImage
        },
        'paypal'
      );
      if (!valid.formIsValid) {
        this.setState({ errMsg: valid.errors, isLoading: false });
        return;
      }
      this.setState({
        isSubmitted: true,
        isDataLoading: true
      });
      axios
        .post('/donations/update_paypal_account', {
          email,
          mobileNumber,
          userId: userData.userId,
          paypal_photo_id: this.state.paypalImage,
          paypalCountry: countryNameById,
          paypalState,
          paypalCity
        })
        .then((response) => {
          toastr.success('Success', response.data.message);
          this.setState({ isDataLoading: false, isLoading: false });
        })
        .catch((err) => {
          this.setState({ isDataLoading: false, isLoading: false });
          if (!err.response.data.error) {
            toastr.error('Error', err.response.data.message);
          } else {
            toastr.error('Error', err.response.data.error.message);
          }
        });
    }
  };

  setThumb = (event) => {
    const {
      target: { name }
    } = event;
    if (name === 'paypalImage') {
      const imgData = event.target.files[0];
      this.setState({ isSubmitted: true });
      let img = new Image();
      img.src = imgData ? URL.createObjectURL(imgData) : '';
      img.onerror = () => {
        this.setState({
          paypalImageErr: 'You can upload only images of type jpg, jpeg, png, svg'
        });
        return;
      };
      img.onload = () => {
        this.setState({
          paypalImageErr: '',
          isPhotoIdUploading: true
        });
        const file = new FormData();
        file.append('file', imgData);
        this.setState({ file: '' });
        axios
          .post('/uploads/upload', file)
          .then((response) => {
            this.setState({
              paypalImage: response.data.data,
              paypalFileData: response.data.fileData,
              isPhotoIdUploading: false,
              paypalImageErr: '',
              errMsg: {
                ...this.state.errors,
                file: ''
              }
            });
          })
          .catch((err) => { });
        // }
      };
    } else {
      const imgData = event.target.files[0];
      this.setState({ isSubmitted: true });
      let img = new Image();
      img.src = imgData ? URL.createObjectURL(imgData) : '';
      img.onerror = () => {
        this.setState({
          imgError: 'You can upload only images of type jpg, jpeg, png, svg'
        });
        return;
      };
      img.onload = () => {
        this.setState({
          imgError: '',
          isLoading: true
        });
        const file = new FormData();
        file.append('file', imgData);
        this.setState({ file: '' });
        axios.post('/uploads/upload', file).then((response) => {
          this.setState({
            file: response.data.data,
            fileData: response.data.fileData,
            isLoading: false,
            imgError: '',
            errMsg: {
              ...this.state.errors,
              file: ''
            }
          });
        });
      };
    }
  };

  handlesetmethod = async (e) => {
    this.setState({
      paymentMethod: e.target.value
    });
  };

  getPaypalStatusBadge = () => {
    const { paypalOnboardingStatus, isPaypalConnected } = this.state;

    let message,
      label = '',
      className = 'failure',
      trigger = 'hover',
      placement = 'right';

    if (window.innerWidth <= 576) {
      trigger = 'click';
      placement = 'bottom';
    }

    switch (paypalOnboardingStatus) {
      case 'ACTIVE':
        label = 'Complete';
        message =
          'This account has provided the required information to fully onboard onto Paypal. They can accept payments and receive payouts.';
        className = 'success';
        break;
      default:
        message =
          'Provide more information in order to enable payments and payouts for this account.';
    }

    if (isPaypalConnected) {
      label = 'Complete';
      message =
        'This account has provided the required information to fully onboard onto Paypal. They can accept payments and receive payouts.';
      className = 'success';
    }
    const popoverRight = <Popover id="popover-positioned-right">{message}</Popover>;
    return (
      <OverlayTrigger trigger={trigger} placement={placement} overlay={popoverRight}>
        <span className={`badge badge-${className}`}>{label}</span>
      </OverlayTrigger>
    );
  };

  getStatusBadge = (status) => {
    const { futureVerfication } = this.state;
    let message,
      className,
      trigger = 'hover',
      placement = 'right';
    if (window.innerWidth <= 576) {
      trigger = 'click';
      placement = 'bottom';
    }

    switch (status) {
      case 'Enabled':
        message =
          'This account has provided enough information to process payments and receive payouts. More information will eventually be required when they process enough volume.';
        className = 'enabled';
        break;
      case 'Complete':
        message =
          'This account has provided the required information to fully onboard onto Stripe. They can accept payments and receive payouts.';
        className = 'success';
        break;

      case 'Restricted':
        message =
          'Provide more information in order to enable payments and payouts for this account.';
        className = 'failure';
        break;

      case 'Pending':
        message =
          'Payments and payouts are paused while Stripe tries to verify recently provided details about this account.';
        className = 'disabled';
        break;
      case 'Restricted soon':
        message = `Provide additional information in order to keep this account in good standing.
        `;
        className = 'restricted-soon';
        break;
      default:
        message =
          'Provide more information in order to enable payments and payouts for this account.';
    }
    const popoverRight = (
      <Popover id="popover-positioned-right">
        {status === 'Restricted soon' ? (
          <>
            <div>
              {message}
              <br />
              <br />
              <div>
                <b>INFORMATION NEEDED</b>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: futureVerfication.join('<br/>')
                }}></div>
            </div>
          </>
        ) : (
          message
        )}
      </Popover>
    );
    return (
      <OverlayTrigger trigger={trigger} placement={placement} overlay={popoverRight}>
        <span className={`badge badge-${className}`}>{status}</span>
      </OverlayTrigger>
    );
  };

  generateLink = async () => {
    try {
      this.setState({ isStripeLinkLoading: true });
      const { data: { data } = {} } = await axios.post('/users/generate-link');

      this.setState({ isLinkLoading: false });

      if (data && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      this.setState({ isStripeLinkLoading: false });
    }
  };

  generatePaypalLink = async () => {
    this.setState({
      isPaypalLinkLoading: true
    })
    try {
      const {
        data: { links }
      } = await axios.post('/payment/paypal/create-onboarding-link');
      const actionUrl = links.find((link) => link.rel === 'action_url');
      if (actionUrl) {
        window.location.href = actionUrl.href;
      }
    } catch (error) {
      this.setState({
        isError: true,
        isPaypalLinkLoading: false
      })
    }
  };

  createSession = async (e) => {
    e.preventDefault();
    await axios.post('/payment/create-session').then((resp) => {
      const { data: { data } = {} } = resp;
      window.location.href = data.url;
    });
  };
  render() {
    const {
      isDetailsFetching,
      errMsg,
      paymentMethod,
      stripeConnectedAccountStatus,
      paypalOnboardingStatus,
      isPaypalConnected,
      isStripeLinkLoading,
      futureVerfication,
      routingNumber,
      accountNumber,
      isModalShow,
      isDataLoading,
      previousAccountNumber,
      previousRoutingNumber,
      accountType,
      isPaypalLinkLoading
    } = this.state;

    const {
      capabilities = {},
      charges_enabled = false,
      details_submitted = false,
      payouts_enabled = false,
      verification = {}
    } = stripeConnectedAccountStatus || {};

    const isStripeRestricted = !charges_enabled || !payouts_enabled;
    const isRestrictedSoon =
      !isStripeRestricted && futureVerfication && futureVerfication.length > 0;

    const isStripeVerified =
      !isStripeRestricted &&
      !isRestrictedSoon &&
      verification &&
      verification.fields_needed &&
      !verification.fields_needed.length;

    const isStripePending =
      !isStripeRestricted &&
      capabilities &&
      capabilities.card_payments === 'pending' &&
      capabilities.platform_payments === 'pending';
    const isStripeEnabled = !isStripeRestricted && !isStripeVerified;

    let stripButtonLabel = "Connect";
    stripButtonLabel = isStripeVerified ? "Edit" : ((isStripePending || isRestrictedSoon || isStripeRestricted) ? "Finish Registration" : "Connect");

    let paypalButtonLabel = "Connect";
    paypalButtonLabel = paypalOnboardingStatus == "Active" || isPaypalConnected ? "Edit" : "Connect";

    return (
      <div className="col-md-10 col-sm-9 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1">GET PAID</div>
              {isDetailsFetching ? (
                <div className="project-card">
                  <Loader />
                </div>
              ) : (
                <div className="get-paid-now-wrapper">
                  <h1>How would you like to get paid?</h1>
                  <div className="row paid-main-wrap">
                    <div className="col-12">
                      <div>
                        <div className="pg-item">
                          <img src="assets/img/paypal.png" alt="Paypal" className='pg-icon' />
                          <div className='pg-desc'>
                            <div>
                              <div class="pg-name">Paypal{this.getPaypalStatusBadge()}</div>
                              <div className="pg-desc">Available Worldwide. 2 - 4 business days to receive money.</div>
                            </div>
                            <div>
                              <button
                                className="connectBtn is-paypal"
                                onClick={this.generatePaypalLink}
                                disabled={isPaypalLinkLoading}>
                                {isPaypalLinkLoading ? 'Loading....' : paypalButtonLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="pg-item">
                          <img src="assets/img/stripe.webp" alt="Stripe" className='pg-icon' />
                          <div className='pg-desc'>
                            <div>
                              <div class="pg-name">Direct Deposit
                                {isStripeRestricted && this.getStatusBadge('Restricted')}
                                {isRestrictedSoon && this.getStatusBadge('Restricted soon')}
                                {isStripePending && this.getStatusBadge('Pending')}
                                {isStripeEnabled && this.getStatusBadge('Enabled')}
                                {isStripeVerified && this.getStatusBadge('Complete')}</div>
                              <div className="pg-desc">Available in North America, Australia & Europe. 2 - 4 business days to
                                receive money.</div>
                            </div>
                            <div>
                              <button
                                className="connectBtn"
                                onClick={this.generateLink}
                                disabled={isStripeLinkLoading}>
                                {isStripeLinkLoading ? 'Loading....' : stripButtonLabel}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/*
                    <div className="col-md-6">
                      <div className="radio">
                        <label className="custom-redio">
                          <input
                            type="radio"
                            name="stripe"
                            value="stripe"
                            checked={paymentMethod === 'stripe'}
                            onChange={(e) => this.handlesetmethod(e)}
                          />
                          <div className="radiobtn" />
                          <div className="donationsettingtitle">
                            Direct Deposit
                            {isStripeRestricted && this.getStatusBadge('Restricted')}
                            {isRestrictedSoon && this.getStatusBadge('Restricted soon')}
                            {isStripePending && this.getStatusBadge('Pending')}
                            {isStripeEnabled && this.getStatusBadge('Enabled')}
                            {isStripeVerified && this.getStatusBadge('Complete')}
                          </div>
                          <div className="Description">
                            <span>
                              {' '}
                              Available in North America, Australia & Europe. 2 - 4 business days to
                              receive money.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="radio">
                        <label className="custom-redio">
                          <input
                            type="radio"
                            name="paypal"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={(e) => this.handlesetmethod(e)}
                          />
                          <div className="radiobtn" />
                          <div className="donationsettingtitle">
                            Paypal
                            {this.getPaypalStatusBadge()}
                          </div>
                          <div className="Description">
                            Paypal
                            <span> Available Worldwide. 2 - 4 business days to receive money.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    */}
                  </div>
                  {/*paymentMethod === 'stripe' && (
                    <>
                      {accountType === 'custom' && (
                        <>
                          <h4>Identity Verification</h4>
                          <hr className="divider" />
                        </>
                      )}
                      <div className="connect-onboard">
                        <p className="verification-note">
                          In order to enable payments and payouts please connect to Stripe.
                        </p>
                        <div className="connect-section">
                          <button
                            className="connectBtn"
                            onClick={this.generateLink}
                            disabled={isStripeLinkLoading}>
                            {isStripeLinkLoading ? 'Loading....' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    </>
                      )*/}
                  {stripeConnectedAccountStatus &&
                    accountType === 'custom' &&
                    paymentMethod === 'stripe' && (
                      <>
                        {(details_submitted &&
                          verification.errors &&
                          verification.errors.length &&
                          verification.errors[0].requirement !==
                          'legal_entity.verification.document') ? (
                          <div className="general-error-message">
                            <span>{verification.errors[0].reason}</span>
                          </div>
                        ) : null}
                        <div className="add-account">
                          <div>
                            <h4>
                              Bank accounts or debit cards
                              <span>
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id={'id'}>
                                      All payout will be converted into USD and sent to this account
                                    </Tooltip>
                                  }
                                  placement="top">
                                  <i className="fas fa-info-circle" />
                                </OverlayTrigger>
                              </span>
                            </h4>
                          </div>
                          <button className="connectBtn" onClick={this.handleModelShow}>
                            <i class="fa fa-plus" aria-hidden="true"></i> Add
                          </button>
                        </div>
                        <hr className="divider" />
                        {previousAccountNumber && (
                          <div className="account-info">
                            <div className="icon-box">
                              <i class="fa fa-university university-icon" aria-hidden="true"></i>
                            </div>
                            <div className="detail-section">
                              <div className="account-detail">{previousRoutingNumber}</div>
                              <div className="account-detail">{`XXXXXXXX${previousAccountNumber}`}</div>
                            </div>
                          </div>
                        )}
                        {!previousAccountNumber && (
                          <div className="not-found">
                            <i class="fa fa-university university-icon" aria-hidden="true"></i>
                            <div>No bank accounts or debit cards</div>
                            <div>
                              Please add a bank account or debit card to enable payouts for this
                              account.
                            </div>
                          </div>
                        )}
                        <AddAccountInfo
                          handleChange={this.handleChange}
                          handleSubmit={this.handleSubmit}
                          routingNumber={routingNumber}
                          accountNumber={accountNumber}
                          isDataLoading={isDataLoading}
                          handleModalClose={this.handleModelClose}
                          show={isModalShow}
                          errMsg={errMsg}
                        />
                      </>
                    )}
                  {/*paymentMethod === 'paypal' && <PaypalOnboarding status={paypalOnboardingStatus} />*/}
                  {/* {paymentMethod === 'paypal' && (
                    <PaypalForm
                      {...this.state}
                      loading={this.state.isDataLoading}
                      onSubmit={this.handleSubmit}
                      onChange={this.handleChange}
                      onThumbChange={this.setThumb}
                    />
                  )} */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DonationSetting.contextType = UserContext;

export default DonationSetting;
