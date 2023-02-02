/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, ProgressBar } from 'react-bootstrap';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import * as moment from 'moment';
import Reaptcha from 'reaptcha';
import Swal from 'sweetalert2';
import { frontUrl, removeImgTagRegex, youtubeVideoBaseUrl } from './../../constants';
import { validator } from './../../helpers/validator';
import { generateEmbeddedUrl } from '../../helpers/embeddedURL';
import Loader from '../../components/Loader';
import SocialShare from '../../components/SocialShare';
import FaqGrid from './FAQS';
import RewardSection from '../../components/RewardSection';
import UpdatesSection from './Updates';
import Sticky from 'react-sticky-el';
import { isMobileOrTablet } from 'helpers/isMobileOrTablet';

let isIamgeStarting = false;
let imagePosition = 0;
let updatesLimit = 2;

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: {},
      commentData: [],
      updates: [],
      updatesCount: 0,
      loading: false,
      showAccountModal: true,
      text: '',
      name: '',
      email: '',
      errors: '',
      verified: false,
      /* reply: "", */
      collapse: false,
      error: false,
      hasMore: true,
      isLoading: false,
      totalCount: '',
      limit: 10,
      index: -1,
      isExpand: false,
      isExpandDes: false,
      showMedia: true,
      showDescription: 'about',
      checkImage: false
    };
  }

  componentDidMount = () => {
    this.setState(
      {
        projectData: this.props.data
      },
      () => {
        this.getCommentData();
        this.getUpdates();
      }
    );
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.data !== prevProps.data) {
      this.setState({
        projectData: this.props.data
      });
    }
  };

  getProjectDetail = async () => {
    const url = this.props.match.params.projectUrl;
    const data = {
      url
    };
    await axios
      .post('/projects/get_project_by_url', data)
      .then((response) => {
        const { data } = response.data;
        const { faq } = data;
        const faqData = faq ? JSON.parse(response.data.data.faq) : {};
        if (faqData && faqData.length) {
          faqData[0].open = true;
        }
        this.setState({
          projectData: {
            ...response.data.data,
            faq: faqData
          },
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        this.props.history.replace('/404');
      });

    this.getCommentData();
  };
  expandedText = (open) => {
    this.setState({
      isExpandDes: open
    });
  };
  onScrollPage = () => {
    if (
      document.getElementById('scrolldiv').scrollTop >=
      document.getElementById('scrolldiv').scrollHeight - 550
    ) {
      const { hasMore, isLoading } = this.state;
      if (isLoading || !hasMore) return;
      else {
        this.getCommentData();
      }
    }
  };

  /* Subbmit captcha value */
  onVerify = (recaptchaResponse) => {
    this.setState({
      verified: true
    });
  };

  getCommentData = async () => {
    const { projectData, commentData, limit } = this.state;
    const projectId = projectData.id;
    const offset = commentData ? commentData.length : 0;
    this.setState({
      isLoading: true
    });
    await axios
      .get(`/projects/showcomments?projectId=${projectId}&offset=${offset}&limit=${limit}`)
      .then((res) => {
        // res.data.data.rows &&
        //   res.data.data.rows.map(item => {
        //     const reply = res.data.data.rows.filter(
        //       reply => reply.parent_id === item.id
        //     );
        //     item.reply = reply;
        //     return item;
        //   });
        if (
          res.data.data &&
          (commentData.length >= res.data.data.count || res.data.data.count < limit)
        ) {
          this.setState({
            hasMore: false
          });
        }
        this.setState({
          commentData: [...this.state.commentData, ...res.data.data.rows],
          text: '',
          name: '',
          email: '',
          loading: false,
          isLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        this.props.history.replace('/404');
      });
  };
  getUpdates = async () => {
    const { projectData, updates } = this.state;
    const projectId = projectData.id;
    const offset = updates ? updates.length : 0;
    this.setState({
      isLoading: true
    });
    await axios
      .get(`/projects/get-updates?projectId=${projectId}&offset=${offset}&limit=${updatesLimit}`)
      .then((res) => {
        if (
          res.data.data &&
          (updates.length >= res.data.data.count || res.data.data.count < updatesLimit)
        ) {
          this.setState({
            hasMore: false
          });
        }
        this.setState({
          updates: [...this.state.updates, ...res.data.data.rows],
          updatesCount: res.data.data.count,
          updatesLoading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
        this.props.history.replace('/404');
      });
  };
  handleHide = () => {
    this.setState({ showAccountModal: false });
  };
  onToggle = (index) => {
    const { projectData } = this.state;
    const { faq } = projectData;
    faq[index].open = !faq[index].open;

    faq.forEach((e, i) => {
      if (i !== index) {
        e.open = false;
      }
    });
    this.setState({
      projectData: {
        ...this.state.projectData,
        faq
      }
    });
  };
  handleTextChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };
  submitComment = async (e) => {
    e.preventDefault();
    const { name, email, text, projectData, commentData } = this.state;
    const { profileInfo } = this.props;

    this.setState({
      loading: true
    });

    const formValidation = validator(
      !profileInfo.id
        ? {
            firstName: name,
            email: email,
            text: text
          }
        : {
            text: text
          }
    );

    const projectId = projectData.id;

    let postData = { name, email, text, projectId };

    if (profileInfo.id) {
      const fullName = [profileInfo.first_name, profileInfo.last_name].join(' ');
      postData = { id: profileInfo.id, email: profileInfo.email, text, name: fullName, projectId };
    }

    if (formValidation.formIsValid) {
      try {
        const response = await axios.post('/projects/add-comment', postData);
        toastr.success(response.data.message);
        const { result, User } = response.data;
        this.setState({
          commentData: result ? [{ ...result, User }, ...commentData] : commentData,
          text: '',
          name: '',
          email: ''
        });
      } catch (error) {
        toastr.error('Error', error.response.data.message);
      }
    } else {
      this.setState({
        errors: formValidation.errors
      });
    }

    this.setState({
      loading: false
    });
  };

  toggle = (index) => {
    const { commentData } = this.state;
    commentData.forEach((comment, i) => {
      if (i !== index) {
        comment.collapse = false;
      } else {
        comment.collapse = !comment.collapse;
      }
    });
    this.setState({
      commentData
    });
  };
  changeState = (index) => {
    this.setState({
      isExpand:
        this.state.index === index || this.state.index === -1
          ? !this.state.isExpand
          : this.state.isExpand,
      index: this.state.index === index ? -1 : index
    });
  };
  statusConfirmBox = (id, status) => {
    // const { checked } = event.target;
    let temp = '';
    // eslint-disable-next-line
    {
      status === 'live' ? (temp = 'live') : (temp = 'off');
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to make this sponsor page ${temp}!`,
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.value) {
        this.handleStatus(id, status);
        //toastr.success("Project inactivate successfully");
      }
    });
  };
  handleStatus = (id, status) => {
    const temp = status === 'live' ? 'Active' : 'Inactive';
    if (id !== '') {
      axios
        .put('projects/update_project_status', {
          projectId: id,
          status: status
        })
        .then(() => {
          this.setState({
            checked: {}
          });
          if (temp === 'Active') {
            toastr.success('Sponsor Page moved to live successfully');
          } else {
            toastr.success('Sponsor Page moved to off sucessfully');
          }
          this.setState({
            projectData: {
              ...this.state.projectData,
              status
            }
          });
          // this.props.getData(url);
        })
        .catch((err) => {
          let errorData = err.response ? err.response.data : err;
          toastr.error('Error', errorData.message);
        });
    } else {
      return;
    }
  };

  // show image or file
  handleShowMedia = (value) => {
    this.setState({
      showMedia: value
    });
  };
  // show description, faq or comment
  handleShowDescription = (value) => {
    this.setState({
      showDescription: value
    });
  };

  render() {
    const {
      projectData,
      loading,
      errors,
      commentData,
      updates,
      updatesCount,
      text,
      email,
      name,
      isExpand,
      isExpandDes,
      showDescription
      // activeRow,
    } = this.state;

    const rewardList = projectData.reward ? JSON.parse(projectData.reward) : [];
    const oneTimeRewards = rewardList.filter((reward) => reward.reward_cycle !== 'monthly');
    const monthlyRewards = rewardList.filter((reward) => reward.reward_cycle === 'monthly');

    const { profileInfo } = this.props;
    let user = localStorage.getItem('user');
    user = user ? JSON.parse(user) : '';
    const faq = projectData.faq;
    if (errors && errors.firstName === 'First name is required') {
      errors.firstName = 'Name is required';
    }

    let result =
      projectData && projectData.description
        ? projectData.description.replace(removeImgTagRegex, '')
        : null;
    // to split youtube video link
    let youtubeVideoLink = projectData && projectData.video ? projectData.video : null;
    let splitYoutubeVideoLink;
    if (youtubeVideoLink && youtubeVideoLink.includes(youtubeVideoBaseUrl)) {
      splitYoutubeVideoLink = youtubeVideoLink ? youtubeVideoLink.split(youtubeVideoBaseUrl) : null;
      splitYoutubeVideoLink =
        splitYoutubeVideoLink && splitYoutubeVideoLink.length ? splitYoutubeVideoLink[1] : null;
    } else {
      splitYoutubeVideoLink = youtubeVideoLink;
    }
    const splitYoutubeURL = generateEmbeddedUrl(splitYoutubeVideoLink);

    // to enable/disable donate button
    let isStripeConnected =
      projectData.User && projectData.User.is_acc_updated && projectData.User.is_verified
        ? true
        : false;
    let isPaypalConnected = projectData.User && projectData.User.is_paypal_connected;
    return (
      <>
        <div className="project-details-section">
          <div className="container">
            <div className="row donate-detail-wrap">
              <div className="col-md-12 col-lg-8">
                <div className="project-detail-div">
                  <div className="project-header">
                    <div className=" project-heading">
                      <h1 className="project-title">{projectData.name}</h1>
                      {user && projectData.userId === user.userId ? (
                        <div className="user-project-edit">
                          <Link
                            className="btn pull-right donate-btn-edit btn-donate-big"
                            to={`/edit/${projectData.url}`}>
                            Edit
                          </Link>
                          <div className="project-toggle">
                            <label className="switch">
                              <input
                                type="checkbox"
                                name="toggle"
                                checked={projectData.status === 'live'}
                                onChange={() =>
                                  this.statusConfirmBox(
                                    projectData.id,
                                    projectData.status === 'live' ? 'draft' : 'live'
                                  )
                                }
                              />
                              <span className="slider round slide-yes-no-wrap">
                                <span className="yes-field">Live</span>
                                <span className="no-field">Off</span>
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <ul className="project-intro">
                      <li style={{ cursor: 'pointer' }}>
                        <span
                          className="cause-info-user-name word-wrap text-capitalize"
                          onClick={() => {
                            if (
                              projectData.User &&
                              projectData.User.first_name &&
                              projectData.User.last_name
                            ) {
                              this.props.history.push(`/${projectData.User.profileUrl}`);
                            }
                          }}>
                          {projectData.User ? <i className="fas fa-user" /> : null}
                          <span style={{ color: '#f385ab' }}>
                            {projectData.User
                              ? projectData.User.first_name + ' ' + projectData.User.last_name
                              : null}
                          </span>
                        </span>
                        {(projectData.category && projectData.category !== 'Select Category') ||
                        projectData.project_location ? (
                          <span className="separet-span">|</span>
                        ) : null}
                      </li>
                      {projectData.category && projectData.category !== 'Select Category' ? (
                        <li>
                          <i className="fas fa-tag" />
                          <span>{projectData.category}</span>
                          {projectData.project_location && <span className="separet-span">|</span>}
                        </li>
                      ) : null}
                      {projectData.project_location ? (
                        <li className="address-wrap">
                          <i className="fas fa-map-marker-alt" />
                          <span>{projectData.project_location}</span>
                        </li>
                      ) : null}
                    </ul>
                    <div className="project-sharing-div">
                      <div className="gallery-tab project-name-heading">
                        {projectData.featured_image ? (
                          <div className={`gallery-tab-btn active`}>
                            <i className="far fa-images"></i>Image
                          </div>
                        ) : null}
                      </div>
                      <div className="share-project ">
                        <SocialShare projectData={projectData} />
                      </div>
                    </div>
                  </div>
                  <div className="project-detail">
                    <div className="project-image project-image-desktop">
                      <img
                        src={`${[frontUrl, projectData.featured_image].join('').trim()}`}
                        alt="img"
                      />
                    </div>
                    <div className="gallery-tab">
                      {projectData.video ? (
                        <div className={`gallery-tab-btn active`}>
                          <i className="fas fa-video"></i>Video
                        </div>
                      ) : null}
                    </div>

                    <>
                      {splitYoutubeURL ? (
                        <div className="project-video">
                          <div className="embed-responsive embed-responsive-16by9">
                            <iframe
                              className="embed-responsive-item"
                              width={'100%'}
                              height={'500px'}
                              title={'video'}
                              frameBorder="0"
                              src={`https://www.youtube.com/embed/${splitYoutubeURL}?wmode=opaque&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;wmode=transparent&amp;modestbranding=1 `}
                              allowFullScreen></iframe>
                          </div>
                        </div>
                      ) : null}
                    </>
                    {/* )} */}
                    <div className="project-detail-tabs w-100">
                      <ul className="project-tab">
                        <li
                          className={`${showDescription === 'about' ? 'active' : null}`}
                          onClick={() => this.handleShowDescription('about')}>
                          <i className="fas fa-globe"></i>
                          <span>About</span>
                        </li>
                        {updates && updates.length ? (
                          <li
                            className={`${showDescription === 'updates' ? 'active' : null}`}
                            onClick={() => this.handleShowDescription('updates')}>
                            <i className="fas fa-history " />
                            <span>Updates</span>
                          </li>
                        ) : null}
                        {faq && faq.length ? (
                          <li
                            className={`${showDescription === 'faq' ? 'active' : null}`}
                            onClick={() => this.handleShowDescription('faq')}>
                            <i className="fas fa-question-circle"></i>
                            <span>FAQ</span>
                          </li>
                        ) : null}
                      </ul>
                      {showDescription === 'about' ? (
                        <div className="project-tab-content">
                          <div className="about-project">
                            <h3 className="about-project-title">About {projectData.name}</h3>

                            <div className="about-desc texteditor-details clearfix">
                              {projectData.description?.length <= 1000 && result !== null ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: projectData.description
                                  }}
                                />
                              ) : (
                                <>
                                  {isExpandDes ? (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: projectData.description
                                      }}
                                    />
                                  ) : (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: isIamgeStarting
                                          ? projectData.description &&
                                            projectData.description.substr(0, imagePosition)
                                          : projectData.description &&
                                            projectData.description.substr(0, 1000)
                                      }}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            {projectData.description && projectData.description.length > 1000 ? (
                              isExpandDes ? (
                                <div
                                  onClick={() => this.expandedText(false)}
                                  className="text-center">
                                  <span className="read-more-btn">Read Less</span>
                                </div>
                              ) : (
                                /* result.length <= 1000 ?*/

                                <div
                                  onClick={() => this.expandedText(true)}
                                  className="text-center">
                                  <span className="read-more-btn">Read More</span>
                                </div>
                              )
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                      {showDescription === 'updates' ? (
                        <div className="project-tab-content">
                          <div className="about-project">
                            <h3 className="about-project-title">Latest updates</h3>
                            {updates?.length > 0 && (
                              <div className="project-location">
                                <h2 className="comment-heading">{/* <span>FAQ</span> */}</h2>
                                <UpdatesSection
                                  updates={updates}
                                  updatesCount={updatesCount}
                                  loadMoreUpdates={this.getUpdates}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                      {showDescription === 'faq' ? (
                        <div className="project-tab-content">
                          <div className="about-project">
                            <h3 className="about-project-title">FAQ</h3>
                            {faq?.length > 0 && (
                              <div className="project-location">
                                <h2 className="comment-heading">{/* <span>FAQ</span> */}</h2>
                                <FaqGrid
                                  faq={faq}
                                  projectData={projectData}
                                  onToggle={this.onToggle}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}
                      {monthlyRewards.length > 0 && (
                        <div className="project-tab-content">
                          <hr />
                          <div className="about-project">
                            <h3 className="about-project-title">Monthly Reward</h3>
                            <ul className="sponsor-side-wrapper">
                              <RewardSection projectData={projectData} rewards={monthlyRewards} />
                            </ul>
                          </div>
                        </div>
                      )}
                      {oneTimeRewards.length > 0 && (
                        <div className="project-tab-content">
                          <hr />
                          <div className="about-project">
                            <h3 className="about-project-title">One Time Reward</h3>
                            <ul className="sponsor-side-wrapper">
                              <RewardSection projectData={projectData} rewards={oneTimeRewards} />
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="project-tab-content">
                        <hr />
                        <div className="about-project">
                          {/* <h3 className='about-project-title'>Comments</h3> */}
                          <div className="comment-wrapper">
                            <div className="comment-section">
                              <div className="comment-post">
                                <h3 className="about-project-title"> Comment Post</h3>
                                {profileInfo.id ? (
                                  <>
                                    <textarea
                                      className="form-control custom-textarea"
                                      type="text"
                                      rows="4"
                                      placeholder="write a comment..."
                                      name="text"
                                      value={text}
                                      maxLength={10000}
                                      minLength={50}
                                      onChange={this.handleTextChange}
                                    />
                                    {errors.text && <p className="text-danger">{errors.text}</p>}
                                    <br />
                                    <div className="form-actions form-btn-block">
                                      <button
                                        type="button"
                                        className="btn btn-donate-big"
                                        onClick={this.submitComment}>
                                        Post Comment
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <form>
                                    <div className="row">
                                      <div className="form-group col-md-12 col-sm-12 col-xs-12 profile-field">
                                        <textarea
                                          rows="4"
                                          cols="50"
                                          className="form-control  custom-textarea"
                                          type="text"
                                          placeholder="Say something..."
                                          name="text"
                                          value={text}
                                          maxLength={10000}
                                          minLength={50}
                                          onChange={this.handleTextChange}
                                        />
                                        {errors.text && (
                                          <p className="text-danger">{errors.text}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-6 input-block form-group">
                                        <input
                                          className="form-control form-input"
                                          type="text"
                                          placeholder="Name"
                                          name="name"
                                          value={name}
                                          onChange={this.handleTextChange}
                                        />
                                        {errors.firstName && (
                                          <p className="text-danger">{errors.firstName}</p>
                                        )}
                                      </div>
                                      <div className="col-md-6 input-block form-group">
                                        <input
                                          className="form-control form-input"
                                          type="text"
                                          placeholder="Email"
                                          name="email"
                                          value={email}
                                          onChange={this.handleTextChange}
                                        />
                                        {errors.email && (
                                          <p className="text-danger">{errors.email}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="reaptcha-wrap">
                                      <Reaptcha
                                        sitekey="6LdepqcUAAAAAJa7epGDZNSaq0TLEuM_toU8YHjZ"
                                        onVerify={this.onVerify}
                                      />
                                    </div>
                                    <div className="form-actions form-btn-block">
                                      <button
                                        className="btn btn-donate-big"
                                        color="primary"
                                        type="submit"
                                        disabled={!this.state.verified}
                                        onClick={this.submitComment}>
                                        Post
                                      </button>
                                    </div>
                                  </form>
                                )}

                                <div
                                  id="scrolldiv"
                                  className="comment-view-wrap"
                                  onScroll={this.onScrollPage}>
                                  <h3 className="about-project-title"> Recent Comments</h3>

                                  <div className="scroll custom-scroll">
                                    {commentData.length > 0 ? (
                                      commentData.map((item, index) => {
                                        return (
                                          <div key={index} className="comment-post-wrap">
                                            <div className="clearfix" />
                                            <ul className="media-list">
                                              <li className="media">
                                                <span
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                  className="pull-left comment-img">
                                                  <img
                                                    src={
                                                      item.User && item.User.avatar
                                                        ? `${frontUrl + item.User.avatar}`
                                                        : '/assets/img/user.svg'
                                                    }
                                                    onClick={() => {
                                                      if (item.User && item.User.profileUrl) {
                                                        this.props.history.push(
                                                          `/${item.User.profileUrl}`
                                                        );
                                                      }
                                                    }}
                                                    alt={
                                                      item.User && item.User.avatar
                                                        ? item.User.avatar
                                                        : ''
                                                    }
                                                    className="img-circle"
                                                    height={50}
                                                    width={50}
                                                  />
                                                </span>
                                                <div className="media-body">
                                                  <div className="comment-text-block">
                                                    <div className="comment-text-heading">
                                                      <strong
                                                        style={{
                                                          cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                          if (item.User && item.User.profileUrl) {
                                                            this.props.history.push(
                                                              `${item.User.profileUrl}`
                                                            );
                                                          }
                                                        }}>
                                                        {item.user_Name}
                                                      </strong>
                                                      <span className="text-muted pull-right time-wrap">
                                                        <small className="text-muted">
                                                          <i className="far fa-clock"></i>
                                                          {moment(item.createdAt).format(
                                                            'DDMMYYYY'
                                                          ) ===
                                                          moment(new Date()).format('DDMMYYYY') ? (
                                                            <span>
                                                              {moment(item.createdAt).fromNow()}
                                                            </span>
                                                          ) : (
                                                            <span>
                                                              {moment(item.createdAt).format('lll')}
                                                            </span>
                                                          )}
                                                        </small>
                                                      </span>
                                                    </div>
                                                    <p className="comment-text-sub-heading">
                                                      {item.comment.length <= 100 ? (
                                                        item.comment
                                                      ) : (
                                                        <>
                                                          <p>
                                                            {isExpand && this.state.index === index
                                                              ? item.comment
                                                              : item.comment.substr(0, 100)}
                                                            <span
                                                              className="text-primary"
                                                              style={{
                                                                cursor: 'pointer'
                                                              }}
                                                              onClick={() =>
                                                                this.changeState(index)
                                                              }>
                                                              {isExpand &&
                                                              this.state.index === index
                                                                ? ' ...show less'
                                                                : ' ...show more'}
                                                            </span>
                                                          </p>
                                                        </>
                                                      )}
                                                    </p>
                                                  </div>
                                                </div>
                                              </li>
                                            </ul>
                                            <ul className="media-list">
                                              {item.reply
                                                ? item.reply.map((element, index) => {
                                                    return (
                                                      <li className="media">
                                                        {/* eslint-disable-next-line */}
                                                        <a
                                                          href="#"
                                                          className="pull-left comment-img">
                                                          <img
                                                            src="https://bootdey.com/img/Content/user_1.jpg"
                                                            alt=""
                                                            className="img-circle"
                                                            height={50}
                                                          />
                                                        </a>
                                                        <div className="media-body">
                                                          <div className="comment-text-block">
                                                            <div className=" comment-text-heading">
                                                              <strong> {element.user_Name}</strong>
                                                              <span className="text-muted pull-right time-wrap">
                                                                <small className="text-muted">
                                                                  {moment(element.createdAt).format(
                                                                    'lll'
                                                                  )}
                                                                </small>
                                                              </span>
                                                            </div>
                                                            <p className="comment-text-sub-heading">
                                                              {element.comment}
                                                            </p>
                                                          </div>
                                                        </div>
                                                      </li>
                                                    );
                                                  })
                                                : null}
                                            </ul>
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <div className="no-comment-wrap">
                                        <div className="no-comment-img text-center">
                                          <img alt="" src="/assets/img/no-comment.svg" />
                                        </div>
                                        <div className="no-comment-text">
                                          There are no comments posted <br></br>
                                          on this sponsor page.
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-4 right-sidebar">
                <div className="project-image project-image-mobile">
                  <img
                    src={`${[frontUrl, projectData.featured_image].join('').trim()}`}
                    alt="img"
                  />
                </div>
                <div>
                  <h1 className="project-title-sm">{projectData.name}</h1>
                  <p className="project-price">
                    {' '}
                    $
                    {projectData.total_pledged
                      ? new Intl.NumberFormat('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(projectData.total_pledged)
                      : '0.00'}
                  </p>
                  <p className="project-price-subtext">
                    received of{' '}
                    <span className="text-black">
                      {' '}
                      $
                      {projectData.amount
                        ? new Intl.NumberFormat('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(projectData.amount)
                        : '0.00'}
                    </span>{' '}
                    goal
                  </p>
                  <ProgressBar now={projectData.percentage} className="custom-progressbar" />
                  <div className="progress-div">
                    {projectData.total_contributors ? (
                      <p className="raised-supporters">
                        <span className="numbers">{projectData.total_contributors}</span>{' '}
                        {projectData.total_contributors === 1 ? 'Sponsor' : 'Sponsors'}
                      </p>
                    ) : null}
                    <p className="progress-percentage">{projectData.percentage}%</p>
                  </div>
                  <div>
                    {isStripeConnected || isPaypalConnected ? (
                      <Sticky
                        disabled={!isMobileOrTablet()}
                        boundaryElement="#root"
                        stickyClassName="btn-new-donate__sticky">
                        <Link
                          className="btn btn-new-donate btn-block "
                          style={{ position: 'sticky', top: 100 }}
                          to={{
                            pathname: `/money/${projectData.url}`,
                            state: { project: projectData }
                          }}>
                          <i className="fas fa-heart "></i>&nbsp;&nbsp;Sponsor Now
                        </Link>
                      </Sticky>
                    ) : (
                      <div className="custom-tooltip-wrap d-block">
                        <div className="tooltip-inner">
                          <div>
                            This Sponsor Page will accept donations after the Sponsor Page-Creator
                            has connected STRIPE or PayPAL.
                          </div>
                        </div>
                        <div className="disabled-wrap">
                          <button
                            className="btn btn-new-donate btn-block donate-disbaled-btn"
                            disabled>
                            Sponsor Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="event-details-section">
          <div className="container">
            {!loading && !(isStripeConnected || isPaypalConnected) && (
              <Modal
                show={this.state.showAccountModal}
                onHide={this.handleHide}
                container={this}
                aria-labelledby="contained-modal-title"
                className="notice-wrap">
                <Modal.Header closeButton className="notice-heading">
                  Notice
                </Modal.Header>
                <Modal.Body>
                  <span className="notice-content">
                    Your account information is not updated yet. Please update your account details
                    in order to receive money.
                  </span>
                  <div className="text-center">
                    <Link
                      className="btn  back-setting-ic-wrap"
                      to="/get-paid-now"
                      style={{ marginTop: '10px' }}>
                      Go to Get Paid Now
                    </Link>
                  </div>
                </Modal.Body>
              </Modal>
            )}
            {loading && <Loader />}
            <div className="row bootstrap snippets">
              <div className="col-md-8 col-sm-12" />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};

export default connect(mapStateToProps)(ProjectDetail);
