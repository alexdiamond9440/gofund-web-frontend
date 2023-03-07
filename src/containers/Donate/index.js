/** @format */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Checkout from './Checkout';
import RewardGrid from './RewardGrid';
import Loader from '../../components/Loader';
import GuestCheckout from './GuestCheckout';
import { UserContext } from 'contexts/UserContext';
import { numberWithCommas } from 'helpers/numberWithCommas';

class Donate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pledge: false,
      show: true,
      guestShow: false,
      checked: false,
      rewardId: '',
      amount: '',
      error: '',
      project: '',
      loading: false,
      oneTime: true,
      monthly: false,
      payTip: 10,
      comment: '',
      toggle: true,
      isInfoSharable: true,
      isPaypalConnected: false,
      user: null,
      rewards: []
    };
  }

  componentDidMount = async () => {
    const { params } = this.props.match;

    const rewardId = params && params.rewardId ? parseInt(params.rewardId) : '';

    this.setState({ rewardId });
    if (params.projectUrl) {
      this.getProjectDetails({ rewardId, projectUrl: params.projectUrl });
    } else if (params.profileUrl) {
      this.getUserProfile({ rewardId, profileUrl: params.profileUrl });
    }
  };

  getUserProfile = async ({ rewardId, profileUrl }) => {
    const {
      data: { userData }
    } = await axios.get(`/profile/get-user-profile?profileUrl=${profileUrl}`);

    if (!userData.rewards) {
      this.setState({
        amount: 10,
        rewardId: 0
      });
    } else {
      if (userData.rewards) {
        const reward = JSON.parse(userData.rewards).find((item) => item.id === rewardId);
        if (reward) {
          this.setState({ amount: reward.donate_amount });
        }
      }
    }

    this.setState({
      user: userData,
      isPaypalConnected: userData.is_paypal_connected,
      loading: false,
      rewards: userData.rewards ? JSON.parse(userData.rewards) : []
    });
  };

  getProjectDetails = async ({ rewardId, projectUrl }) => {
    const user = this.context;

    const requestParams = {
      url: projectUrl
    };

    try {
      this.setState(() => ({ loading: true }));
      const {
        data: { data, isPaypalConnected }
      } = await axios.post('/projects/get_project_basic_detail', requestParams);

      const id = data.id ? data.userId : '';
      const status = data.status ? data.status : '';

      if (status === 'draft' && ((user && id !== user.userId) || !user)) {
        this.props.history.push('/404');
      }

      if (!data.reward) {
        this.setState({
          amount: 10,
          rewardId: 0
        });
      } else {
        if (data.reward) {
          const reward = JSON.parse(data.reward).find((item) => item.id === rewardId);
          if (reward) {
            this.setState({ amount: reward.donate_amount });
          }
        }
      }

      this.setState({
        project: data,
        user: data.User,
        isPaypalConnected: isPaypalConnected,
        loading: false,
        rewards: data.reward ? JSON.parse(data.reward) : []
      });
    } catch (err) {
      this.props.history.replace('/404');
    }
  };

  handleChange = (id, amount) => {
    this.setState({
      rewardId: id,
      amount: amount
    });
  };

  handleInputChange = (amount, event) => {
    const { name, value } = event.target;
    let error = '';
    if (name === 'amount') {
      if (value < amount) {
        error = 'error';
      }
      if (isNaN(value)) {
        return;
      }
      this.setState({
        [name]: value,
        error
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  makePledge = () => {
    // const currentUser = this.context;
    const currentUser = this.props.user;
    console.log(currentUser);

    if (currentUser) {
      this.setState({
        pledge: true,
        show: true
      });
    } else {
      this.setState({
        pledge: true,
        show: false,
        guestShow: true
      });
    }
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleRecurring = (name) => {
    this.setState({
      oneTime: name === 'oneTime',
      monthly: name === 'monthly'
    });
  };

  handlePayTip = (event) => {
    const { value } = event.target;

    this.setState({ payTip: value });
  };

  handleToggleForContactInfo = (event) => {
    const { checked } = event.target;
    this.setState({ isInfoSharable: checked });
  };

  handleToggle = (event) => {
    const { checked } = event.target;
    this.setState({ toggle: checked, payTip: checked ? 5 : 0 });
  };

  render() {
    const {
      show,
      guestShow,
      rewardId,
      amount,
      error,
      project,
      user,
      loading,
      oneTime,
      monthly,
      payTip,
      comment,
      toggle,
      isInfoSharable,
      isPaypalConnected,
      rewards
    } = this.state;

    let totalAmount = amount ? parseFloat(amount) : 0;
    let tipAmount = 0;
    if (amount && payTip) {
      tipAmount = (totalAmount * parseFloat(payTip)) / 100;
    }
    totalAmount = oneTime ? totalAmount + tipAmount : Math.ceil(totalAmount + tipAmount);
    const isStripeConnected = user && user.is_acc_updated && user.is_verified ? true : false;

    const rewardListItem = (reward) => {
      return (
        <RewardGrid
          isStripeConnected={isStripeConnected}
          isPaypalConnected={isPaypalConnected}
          reward={reward}
          key={reward.id}
          oneTime={oneTime}
          monthly={monthly}
          handleChange={() => this.handleChange(reward.id, reward.donate_amount)}
          handleInputChange={this.handleInputChange}
          handleRecurring={this.handleRecurring}
          makePledge={this.makePledge}
          handleToggle={this.handleToggle}
          handleToggleForContactInfo={this.handleToggleForContactInfo}
          handlePayTip={this.handlePayTip}
          payTip={payTip}
          tipAmount={tipAmount}
          toggle={toggle}
          isInfoSharable={isInfoSharable}
          totalAmount={totalAmount}
          projectName={[user?.first_name, user?.last_name].join(' ')}
          rewardId={reward.id}
          amount={amount}
          error={error}
          comment={comment}
        />
      );
    };

    const monthlyRewards = rewards?.filter((reward) => reward.reward_cycle === 'monthly');
    const oneTimeRewards = rewards?.filter((reward) => reward.reward_cycle !== 'monthly');

    return (
      <div className="donate-page-section">
        {!loading && (
          <div className="container">
            {project && (
              <div className="section-title text-center">
                <h2>
                  Support this<span className="small-text-bg">Sponsor Page</span>
                </h2>
                <div className="project-name-wrap">
                  <Link to={`/${project.url}`}>
                    <h3>{project.name}</h3>
                  </Link>
                  <Link to={`/${user.profileUrl}`}>
                    <p>by {[user?.first_name, user?.last_name].join(' ')}</p>
                  </Link>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-md-12 col-lg-8 center-block">
                <div className="donate-rewards-left">
                  <div className="donate-rewards-list-wrap">
                    <ul>
                      {project && (
                        <li className="reward-block">
                          <div className="reward-inner-block">
                            <div className="reward-check-btn">
                              <input
                                type="radio"
                                id="one"
                                name="rewardId"
                                value={0}
                                onChange={() => this.handleChange(0, 10)}
                                checked={rewardId === 0}
                              />
                              <label htmlFor="one" />
                            </div>
                            <div className="reward-text-wrap default-cursor">
                              <h1
                                className="reward-block-name"
                                onClick={() => this.handleChange(0, 10)}>
                                Sponsor
                              </h1>
                            </div>
                            {rewardId === 0 && (
                              <div className="pledge-amount-wrap">
                                <div className=" all-inputs-with-tip-wrap">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="all-inputs-wrap d-flex">
                                        <button
                                          className={`btn btn-one-time mt-0 ${oneTime && 'active'}`}
                                          onClick={() => this.handleRecurring('oneTime')}>
                                          One Time
                                        </button>
                                        <button
                                          className={`btn btn-recurring mt-0 ${monthly && 'active'
                                            }`}
                                          onClick={() => this.handleRecurring('monthly')}>
                                          Monthly
                                        </button>
                                      </div>
                                      <div className="pledge-amount-block half-input-wrap">
                                        <div className="input-group">
                                          <div className="input-group-addon">
                                            <i className="fas fa-dollar-sign" />
                                          </div>
                                          <input
                                            className="form-control form-input"
                                            type="text"
                                            name="amount"
                                            value={amount}
                                            onChange={(e) => this.handleInputChange(amount, e)}
                                          />
                                        </div>
                                      </div>

                                      <div className="donate-comment sponsor-donate">
                                        <textarea
                                          className="form-control custom-textarea"
                                          rows={4}
                                          cols={50}
                                          name="comment"
                                          value={comment}
                                          placeholder={
                                            oneTime
                                              ? 'Send message (optional)'
                                              : 'Send message to fundraiser (optional)'
                                          }
                                          onChange={(e) => this.handleInputChange(comment, e)}
                                          maxLength={500}
                                        />
                                      </div>
                                      <div className="mt-1">
                                        <div className="input-group tip-amount-wrap new-my mb-0">
                                          <div className="input-group-prepend">
                                            <label className="switch">
                                              <input
                                                type="checkbox"
                                                name="toggle"
                                                checked={isInfoSharable}
                                                onChange={this.handleToggleForContactInfo}
                                              />
                                              <span className="slider round slide-yes-no-wrap">
                                                <span className="yes-field">Yes</span>
                                                <span className="no-field">No</span>
                                              </span>
                                            </label>
                                          </div>
                                          <div className="input-group text-input-wrp info-toggle-text d-flex align-items-center">
                                            Share your contact information with{' '}
                                            {[user?.first_name, user?.last_name].join(' ')}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <>
                                        <div>
                                          <div className="input-group tip-amount-wrap new-my">
                                            <div className="input-group-prepend">
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  name="toggle"
                                                  checked={toggle}
                                                  onChange={this.handleToggle}
                                                />
                                                <span className="slider round slide-yes-no-wrap">
                                                  <span className="yes-field">Yes</span>
                                                  <span className="no-field">No</span>
                                                </span>
                                              </label>
                                            </div>
                                            <div className="input-group pay-platform-fee info-toggle-text d-flex align-items-center">
                                              Pay platform fee for{' '}
                                              {[user?.first_name, user?.last_name].join(' ')}
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          className={`input-group select-tip-wrap mt-0 ${toggle ? 'tip-select-wrap' : 'tip-select-hide-wrap'
                                            }`}>
                                          <select
                                            name="payTip"
                                            value={payTip}
                                            onChange={this.handlePayTip}
                                            className="form-control">
                                            <option value="5">Tip GoFundHer 0%</option>
                                            <option value="10">Tip GoFundHer 5%</option>
                                            <option value="20">Tip GoFundHer 15%</option>
                                            <option value="35">Tip GoFundHer 30%</option>
                                            <option value="50">Tip GoFundHer 45%</option>
                                          </select>
                                        </div>
                                        <div className="pledge-amout-text-wrp">
                                          <div className="text-center mt-4">
                                            <div className="small-title m-b-3">
                                              Sponsorship: $
                                              {numberWithCommas(Number(amount).toFixed(2))}
                                            </div>
                                            <div className="small-title m-b-3">
                                              Fee {payTip > 5 ? '+ Tip' : ''}: $
                                              {numberWithCommas(tipAmount.toFixed(2))}
                                            </div>
                                            <div className="amount-text-wrap amount-with-fee mb-0">
                                              {`Total: $ ${numberWithCommas(
                                                totalAmount.toFixed(2)
                                              )}`}
                                            </div>
                                          </div>
                                          <div className="amount-note remove-m-top">
                                            {monthly && 'Note: This amount has been rounded off*'}
                                          </div>
                                          <div className="checkout-btn">
                                            {!isStripeConnected && !isPaypalConnected && (
                                              <div className="custom-tooltip-wrap">
                                                <div className="tooltip-inner">
                                                  <div>
                                                    This sponsor page will accept donations after
                                                    the Sponsor Page-Creator has connected STRIPE or
                                                    PayPAL.
                                                  </div>
                                                </div>
                                                <div className="disabled-wrap">
                                                  <button
                                                    className="btn btn-donate-big btn-checkout w-100"
                                                    disabled={true}>
                                                    SPONSOR
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                            {(isStripeConnected || isPaypalConnected) && (
                                              <button
                                                className="btn btn-donate-big btn-checkout w-100"
                                                onClick={this.makePledge}
                                                disabled={parseInt(amount) === 0 || amount === ''}>
                                                SPONSOR
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      )}
                      {monthlyRewards.length > 0 && (
                        <li>
                          <h3 className="rewards-title pb-4">Monthly Reward</h3>
                        </li>
                      )}
                      {monthlyRewards.map((reward) => rewardListItem(reward))}
                      {oneTimeRewards.length > 0 && (
                        <li>
                          <h3 className="rewards-title pb-4">One Time Reward</h3>
                        </li>
                      )}
                      {oneTimeRewards?.map((reward) => rewardListItem(reward))}
                    </ul>
                    {this.state.pledge && (
                      <Checkout
                        monthly={monthly}
                        oneTime={oneTime}
                        show={show}
                        handleClose={this.handleClose}
                        amount={totalAmount}
                        comment={comment}
                        rewardId={rewardId}
                        planId={project?.plan_id}
                        project={project}
                        projectName={
                          project ? project.name : [user?.first_name, user?.last_name].join(' ')
                        }
                        projectId={project?.id}
                        receiverId={user.id}
                        isStripeConnected={isStripeConnected}
                        isPaypalConnected={isPaypalConnected}
                        message={
                          'This sponsor page will accept donations via stripe after the Sponsor Page-Creator has connected STRIPE'
                        }
                        paypalMessage={
                          'This sponsor page will accept donations via paypal after the Sponsor Page-Creator has connected PAYPAL'
                        }
                        tipAmount={tipAmount}
                        tipPrecentage={payTip}
                        totalAmount={totalAmount}
                        isInfoSharable={isInfoSharable}
                        {...this.props}
                      />
                    )}
                    <GuestCheckout
                      {...this.props}
                      show={guestShow}
                      monthly={monthly}
                      handleGuest={() => {
                        this.setState({
                          guestShow: false,
                          show: true
                        });
                      }}
                      handleClose={() => {
                        this.setState({
                          guestShow: false
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="project-card">
            <Loader />
          </div>
        )}
      </div>
    );
  }
}

Donate.contextType = UserContext;

const mapStateToProps = (state) => {
  const { user } = state.LoginReducer;
  const { profileInfo } = state.ProfileReducer;
  return {
    user,
    profileInfo
  };
};

export default connect(mapStateToProps)(Donate);
//export default Donate;