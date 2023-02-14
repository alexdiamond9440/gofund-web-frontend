/** @format */

import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as qs from 'query-string';
import Sticky from 'react-sticky-el';

import {
  frontUrl,
  facebookBaseUrl,
  twitterBaseUrl,
  linkedinBaseUrl,
  instagramBaseUrl,
  youtubeUserBaseUrl,
  tiktokBaseUrl,
  whatsappBaseUrl,
  twitchBaseUrl,
  Backend_url
} from '../../constants';
import { generateEmbeddedUrl } from '../../helpers/embeddedURL';
import Loader from '../../components/Loader';
import Checkout from '../Donate/Checkout';
import GuestCheckout from '../Donate/GuestCheckout';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import SocialShare from '../../components/SocialShare';
import 'react-circular-progressbar/dist/styles.css';
import { getSocialLinkurl, seperateInstagramUserName } from './url';
import { isUrlWithoutProtocol } from '../../helpers/url';
import { UserContext } from 'contexts/UserContext';
import ProjectItem from 'components/ProjectItem';
import ProfileRewardListItem from 'components/ProfileRewardListItem';
import { numberWithCommas } from 'helpers/numberWithCommas';
import { isMobileOrTablet } from 'helpers/isMobileOrTablet';

class Userprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: {},
      user: {},
      backedProjects: {},
      loading: false,
      oneTime: true,
      monthly: false,
      guestShow: false,
      amount: '10',
      pledge: false,
      show: true,
      receivedId: 0,
      userId: this.props.profileInfo.id,
      payTip: 10,
      comment: '',
      toggle: true,
      isInfoPopUp: false,
      isInfoSharable: true,
      isValueInputted: false
    };
    this.donateInput = React.createRef();
  }
  componentDidMount = async () => {
    const {
      data,
      location: { search }
    } = this.props;

    const currentUser = this.context;

    const { user, projects } = data;
    if (search) {
      const { donate } = qs.parse(search);
      if (donate === 'true') {
        this.handleSponsorMe();
        if (currentUser) {
          this.donateInput.current.focus();
        } else {
          this.setState({
            guestShow: true
          });
        }
      }
    }
    this.setState({
      user,
      receivedId: user ? user.id : '',
      projects
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
    const { isValueInputted } = this.state;
    const currentUser = this.context;
    if (currentUser || isValueInputted) {
      this.setState({
        pledge: true,
        show: true
      });
    } else {
      this.setState({
        pledge: true,
        show: false,
        guestShow: true,
        isValueInputted: true
      });
    }
  };
  handleGuest = () => {
    const { isValueInputted } = this.state;
    let payload = {
      guestShow: false
    };
    if (isValueInputted) {
      payload = {
        ...payload,
        show: true
      };
    } else {
      payload = {
        ...payload,
        isValueInputted: true
      };
      setTimeout(() => {
        this.donateInput.current.focus();
      }, 400);
    }
    this.setState(payload);
  };
  handleClose = () => {
    this.setState({ show: false, isValueInputted: false });
  };
  handlePayTip = (event) => {
    const { value } = event.target;
    this.setState({
      payTip: value
    });
  };
  handleToggle = (event) => {
    const { checked } = event.target;
    this.setState({ toggle: checked, payTip: checked ? 5 : 0 });
  };
  handleToggleForContactInfo = (event) => {
    const { checked } = event.target;
    this.setState({ isInfoSharable: checked });
  };

  handleViewProject = () => {
    // detect support for the behavior property in ScrollOptions
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    const section = document.getElementById('view-project');
    const scrollTo = section ? section.getBoundingClientRect().top + window.scrollY - 75 : 0;
    if (supportsNativeSmoothScroll) {
      window.scroll({
        top: scrollTo,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, scrollTo);
    }
  };

  handleSponsorMe = () => {
    // detect support for the behavior property in ScrollOptions
    let width = window.innerWidth;
    if (width <= 870) {
      const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      const section = document.getElementById('sponser-me');
      const scrollTo = section ? section.getBoundingClientRect().top + window.scrollY - 75 : 0;
      if (supportsNativeSmoothScroll) {
        window.scroll({
          top: scrollTo,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, scrollTo);
      }
    }
  };

  render() {
    const {
      user,
      projects,
      guestShow,
      loading,
      monthly,
      oneTime,
      amount,
      show,
      receivedId,
      payTip,
      comment,
      toggle,
      isInfoSharable
    } = this.state;

    const imageUrl =
      user.avatar && user.avatar.search('https://') > -1
        ? user.avatar.replace('s96-c', 's256-c') //for google picture size
        : `${Backend_url}${user.avatar}`;

    let totalAmount = amount ? parseFloat(amount) : 0;
    let tipAmount = 0;
    if (amount && payTip) {
      tipAmount = (totalAmount * parseFloat(payTip)) / 100;
    }
    totalAmount = oneTime ? totalAmount + tipAmount : Math.ceil(totalAmount + tipAmount);
    const isStripeConnected = user && user.is_acc_updated && user.is_verified;
    const isPaypalConnected = user && user.is_paypal_connected;
    // condition to split url of youtube video
    const instagramUsername = seperateInstagramUserName(user);
    let youtubeVideoLink = user && user.youtube_video_link ? user.youtube_video_link : null;
    const splitYoutubeURL = generateEmbeddedUrl(youtubeVideoLink);
    const fbUrl = getSocialLinkurl(user.facebook, facebookBaseUrl);
    const twitterUrl = getSocialLinkurl(user.twitter, twitterBaseUrl);
    const instagramUrl = getSocialLinkurl(instagramUsername, instagramBaseUrl);
    const linkedinUrl = getSocialLinkurl(user.linkedin, linkedinBaseUrl);
    const whatsappUrl = getSocialLinkurl(user.whatsapp, whatsappBaseUrl);
    const twitchUrl = getSocialLinkurl(user.twitch, twitchBaseUrl);
    const youTubeUrl = getSocialLinkurl(user.youtube, youtubeUserBaseUrl);
    const tiktokUrl = getSocialLinkurl(user.tiktokUrl, tiktokBaseUrl);
    const rewards = user && user.rewards ? JSON.parse(user.rewards) : [];

    return (
      <div>
        {loading ? (
          <div className="project-card">
            <Loader />
          </div>
        ) : null}
        <div>
          {/* start causes section*/}
          <div className="page-causes-section ">
            <div className="container">
              <div className="userinfo">
                {/* <h1 className="text-center">   PROFILE</h1> */}
                <div className="profile-wrap ">
                  <div className="profile-heading-block">
                    <div className="profile-img">
                      {user.avatar ? (
                        <>
                          <img src={imageUrl} alt="" />
                          <div
                            className="profile-inner-img"
                            style={{
                              backgroundImage: `url( ${imageUrl})`
                            }}></div>
                        </>
                      ) : (
                        <>
                          <img src="/assets/img/user.svg" alt="" />
                          <div
                            className="profile-inner-img"
                            style={{
                              backgroundImage: `url(/assets/img/user.svg)`
                            }}></div>
                        </>
                      )}
                    </div>
                    <h1>{user.first_name ? [user.first_name, user.last_name].join(' ') : null}</h1>
                    {user.facebook ||
                      user.twitter ||
                      user.instagram ||
                      user.youtube ||
                      user.linkedin ||
                      user.whatsapp ||
                      user.twitch ||
                      user.tiktok ? (
                      <div className="social-media-links">
                        <div className="social-wrap">
                          {user.facebook ? (
                            <a
                              href={fbUrl}
                              target={'_blank'}
                              className="profile-social facebook"
                              rel="noreferrer">
                              <span className="fab fa-facebook-f" />
                            </a>
                          ) : null}
                          {user.twitter ? (
                            <a
                              href={twitterUrl}
                              target={'_blank'}
                              className="profile-social twitter"
                              rel="noreferrer">
                              <span className="fab fa-twitter" />
                            </a>
                          ) : null}
                          {user.instagram ? (
                            <a
                              href={instagramUrl}
                              target={'_blank'}
                              className="profile-social instagram"
                              rel="noreferrer">
                              <span className="fab fa-instagram" />
                            </a>
                          ) : null}
                          {user.linkedin ? (
                            <a
                              href={linkedinUrl}
                              target={'_blank'}
                              className="profile-social linkedin"
                              rel="noreferrer">
                              <span className="fab fa-linkedin" />
                            </a>
                          ) : null}
                          {user.whatsapp ? (
                            <a
                              href={whatsappUrl}
                              target={'_blank'}
                              className="profile-social whatsapp"
                              rel="noreferrer">
                              <span className="fab fa-whatsapp" />
                            </a>
                          ) : null}
                          {user.twitch ? (
                            <a
                              href={twitchUrl}
                              target={'_blank'}
                              className="profile-social twitch"
                              rel="noreferrer">
                              <span className="fab fa-twitch" />
                            </a>
                          ) : null}
                          {user.youtube ? (
                            <a
                              href={youTubeUrl}
                              target={'_blank'}
                              className="profile-social youtube"
                              rel="noreferrer">
                              <span className="fab fa-youtube" />
                            </a>
                          ) : null}
                          {user.tiktok ? (
                            <a
                              href={tiktokUrl}
                              target={'_blank'}
                              className="profile-social tiktok"
                              rel="noreferrer">
                              <img
                                src="/assets/img/tiktok-white.svg"
                                alt="tiktok"
                                className="icon-img"
                              />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                    <div>
                      <div className="view-sponsor-btn" onClick={this.handleSponsorMe}>
                        Sponsor Now
                      </div>
                      <div className="view-project-btn" onClick={this.handleViewProject}>
                        View sponsor pages
                      </div>
                    </div>
                    <div className="intro-section">
                      {user.email ? (
                        <a
                          href={`mailto:${user.email}`}
                          rel="noopener noreferrer"
                          className="intro-links word-wrap"
                          target="blank">
                          <i className="fas fa-envelope"></i> {`${user.email}`}
                        </a>
                      ) : null}
                      {user.profileUrl ? (
                        <a
                          href={`${frontUrl}/${user.profileUrl}`}
                          target="blank"
                          rel="noopener noreferrer"
                          className="intro-links word-wrap">
                          <i className="fas fa-link"></i>
                          {`${frontUrl}/${user.profileUrl}`}
                        </a>
                      ) : null}
                      {user.state || user.city ? (
                        <span className="intro-links word-wrap">
                          <i className="fas fa-map-marker-alt"></i>
                          {[user.city, user.state].filter(Boolean).join(' ')}
                        </span>
                      ) : null}
                      {user.personal_website ? (
                        <a
                          href={`${isUrlWithoutProtocol(user.personal_website) ? '//' : ''}${user.personal_website
                            }`}
                          rel="noopener noreferrer"
                          className="intro-links word-wrap"
                          target="blank">
                          <i className="fas fa-globe"></i>
                          {`${user.personal_website}`}
                        </a>
                      ) : null}
                      <ProfileRewards rewards={rewards} profileUrl={user.profileUrl} />
                    </div>
                  </div>
                  <div className="hidden-sm hidden-md hidden-lg" style={{ width: '100%' }}>
                    <hr />
                    <h3>Sponsor {[user.first_name, user.last_name].join(' ')}</h3>
                  </div>
                  <div className="profile-text-wrap profile-detail-section">
                    <div className="profile-text">
                      {this.props.profileInfo.id === user.id ? (
                        <TooltipComponent message="Edit Your Profile">
                          <a
                            className="btn profile-edit-icon donate-btn-edit btn-donate-big"
                            href="/my-profile">
                            Edit
                          </a>
                        </TooltipComponent>
                      ) : null}
                      <Row>
                        <Col md={6}>
                          <h3 className="hidden-xs mt-0">
                            Sponsor {[user.first_name, user.last_name].join(' ')}
                          </h3>
                          <div className="all-inputs-wrap" id="sponser-me">
                            <div className="all-btn-tile">
                              <button
                                className={`btn btn-one-time ${oneTime ? 'active' : ''}`}
                                onClick={() => {
                                  this.setState({
                                    oneTime: true,
                                    monthly: false
                                  });
                                }}>
                                One Time
                              </button>
                            </div>
                            <div className="all-btn-tile">
                              <button
                                className={`btn btn-recurring ${monthly ? 'active' : ''}`}
                                onClick={() => {
                                  this.setState({
                                    oneTime: false,
                                    monthly: true
                                  });
                                }}>
                                Monthly
                              </button>
                            </div>
                          </div>
                          <div className="pledge-amount-block half-input-wrap">
                            <div className="input-group">
                              <div className="input-group-addon">
                                <i className="fas fa-dollar-sign" />
                              </div>
                              <input
                                className="form-control form-input donate-input"
                                type="text"
                                name="amount"
                                value={amount}
                                onChange={(e) => this.handleInputChange(amount, e)}
                                ref={this.donateInput}
                              />
                            </div>
                          </div>
                          <div className="donate-comment">
                            <textarea
                              className="form-control custom-textarea text-h-115"
                              rows={5}
                              cols={50}
                              name="comment"
                              value={comment}
                              placeholder="Send message (optional)"
                              onChange={(e) => this.handleInputChange(comment, e)}
                              maxLength={500}
                            />
                          </div>
                          <div className="mt-1 profile-amount-toggle-wrap">
                            <div className="input-group tip-amount-wrap">
                              <div className="input-group-prepend">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="toggle"
                                    checked={isInfoSharable}
                                    onChange={this.handleToggleForContactInfo}
                                    className=""
                                  />
                                  <span className="slider round slide-yes-no-wrap">
                                    <span className="yes-field">Yes</span>
                                    <span className="no-field">No</span>
                                  </span>
                                </label>
                              </div>
                              <div className="input-group text-input-wrp info-toggle-text">
                                Share your contact information with{' '}
                                {[user.first_name, user.last_name].join(' ')}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="profile-amount-toggle-wrap m-t-5">
                            <div className="input-group tip-amount-wrap mt-0">
                              <div className="input-group-prepend">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="toggle"
                                    checked={toggle}
                                    onChange={this.handleToggle}
                                    className=""
                                  />
                                  <span className="slider round slide-yes-no-wrap">
                                    <span className="yes-field">Yes</span>
                                    <span className="no-field">No</span>
                                  </span>
                                </label>
                              </div>
                              <div className="input-group text-input-wrp">
                                Pay platform fee for {[user.first_name, user.last_name].join(' ')}
                              </div>
                            </div>
                          </div>
                          <div className="profile-tip-detail-wrap">
                            <div
                              className={`input-group select-tip-wrap m-t-5 ${toggle ? 'tip-select-wrap' : 'tip-select-hide-wrap '
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
                          </div>
                          <div className="pledge-amount-block pledge-amout-text-wrp 3">
                            <div className="text-center mt-3">
                              <div className="small-title m-b-3">
                                Sponsorship: ${numberWithCommas(Number(amount).toFixed(2))}
                              </div>
                              <div className="small-title m-b-3">
                                Fee {payTip > 5 ? '+ Tip' : ''}: $
                                {numberWithCommas(tipAmount.toFixed(2))}
                              </div>
                              <div className="amount-text-wrap amount-with-fee mb-0">
                                Total: ${numberWithCommas(totalAmount.toFixed(2))}
                              </div>
                            </div>

                            <div className="amount-note remove-m-top">
                              {monthly ? 'Note: This amount has been rounded off*' : null}
                            </div>
                            <div style={{ width: '100%' }}>
                              {' '}
                              <Sticky
                                disabled={!isMobileOrTablet()}
                                boundaryElement="#root"
                                stickyClassName="checkout-btn__sticky">
                                <div className="checkout-btn">
                                  {isStripeConnected || isPaypalConnected ? (
                                    <button
                                      className="btn btn-new-donate btn-block"
                                      onClick={this.makePledge}
                                      disabled={!Number(amount)}>
                                      <i className="fas fa-heart "></i>&nbsp;&nbsp; Sponsor Now
                                    </button>
                                  ) : (
                                    <TooltipComponent message="This page is not ready to receive money">
                                      <div className="disabled-wrap btn btn-new-donate btn-block disabled-sponser">
                                        SPONSOR NOW
                                      </div>
                                    </TooltipComponent>
                                  )}
                                </div>
                              </Sticky>
                            </div>
                            <SocialShare
                              projectData={{
                                name: user.first_name
                                  ? [user.first_name, user.last_name].join(' ')
                                  : null,
                                featured_image: '/images/gofundher-social-logo.png',
                                url: user.profileUrl,
                                punch_line: `Hey this is my profile on gofundher, please have a look and sponsor me or view my project : ${frontUrl}/${user.profileUrl}`
                              }}
                            />
                          </div>
                        </Col>
                      </Row>
                      {this.state.pledge && (
                        <Checkout
                          monthly={monthly}
                          receiverId={receivedId}
                          oneTime={oneTime}
                          directDonation={true}
                          show={show}
                          handleClose={this.handleClose}
                          amount={totalAmount}
                          comment={comment}
                          rewardId={null}
                          planId={user.plan_id}
                          project=""
                          isStripeConnected={isStripeConnected}
                          isPaypalConnected={isPaypalConnected}
                          message="This Fund raiser will accept donations after he has connected STRIPE"
                          paypalMessage="This Fund raiser will accept donations after he has connected PAYPAL"
                          tipAmount={tipAmount}
                          tipPrecentage={payTip}
                          totalAmount={totalAmount}
                          isInfoSharable={isInfoSharable}
                          {...this.props}
                        />
                      )}
                    </div>
                    <Row>
                      <Col md={12}>
                        {user.bio ? (
                          <div className="bio-section">
                            <div className="bio-title">Mini Bio:</div>
                            <div className="bio-text">{user.bio}</div>
                          </div>
                        ) : null}
                      </Col>
                      {user.youtube_video_link && splitYoutubeURL ? (
                        <Col md={12}>
                          <div className="bio-section">
                            <div className="bio-title">Video:</div>
                            <div className="iframe-box">
                              <div className="embed-responsive embed-responsive-16by9">
                                <iframe
                                  className="embed-responsive-item"
                                  width={'100%'}
                                  height={'400px'}
                                  title={'video'}
                                  frameBorder="0"
                                  src={`https://www.youtube.com/embed/${splitYoutubeURL}?wmode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent&amp;modestbranding=1 `}
                                  allowFullScreen></iframe>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ) : (
                        ''
                      )}
                    </Row>
                  </div>
                </div>
              </div>

              <div className="text-align-center" id="view-project">
                {projects ? (
                  <h1 className="my-project-heading text-capitalize">
                    {user.first_name ?? 'My'}'s sponsor pages
                  </h1>
                ) : null}
              </div>
              <div className="row justify-content-md-center row-project-list ">
                {projects && projects.length > 0 ? (
                  projects.map((project) => {
                    return (
                      <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key={project.id}>
                        <ProjectItem project={project} />
                      </div>
                    );
                  })
                ) : (
                  <div className="project-empty-found-main-wrap text-center col-xs-12">
                    <div className="pb-3 project-empty-found">
                      <img src="/assets/img/no-project-found.svg" alt="" />
                      <div className="project-empty-found-text">
                        Currently {user.first_name ?? 'My'} has not added any sponsor page.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <GuestCheckout
          {...this.props}
          show={guestShow}
          monthly={monthly}
          handleGuest={this.handleGuest}
          handleClose={() => {
            this.setState({
              guestShow: false
            });
          }}
        />
      </div>
    );
  }
}

Userprofile.contextType = UserContext;

export const ProfileRewards = (props) => {
  const { rewards, profileUrl } = props;
  const filteredRewards = rewards.filter((reward) => reward.reward_title);

  if (!filteredRewards.length) {
    return null;
  }

  return (
    <div className="rewards-wrap">
      <h3 className="rewards-title">Monthly Rewards</h3>
      <div className="rewards-list">
        {filteredRewards?.map((reward) => {
          return <ProfileRewardListItem profileUrl={profileUrl} key={reward.id} reward={reward} />;
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { user } = state.LoginReducer;
  const { profileInfo } = state.ProfileReducer;
  return {
    user,
    profileInfo
  };
};

export default connect(mapStateToProps)(Userprofile);
