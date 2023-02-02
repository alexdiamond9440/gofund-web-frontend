import React, { Suspense } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import * as queryString from 'query-string';

import ThankYou from './ThankYou';
import Loader from '../../components/Loader';
import ProjectDescription from './projectDescription';
import { UserContext } from 'contexts/UserContext';

const BasicInfo = React.lazy(() => import('./BasicInfo'));
const Gallery = React.lazy(() => import('./Gallery'));
const Updates = React.lazy(() => import('./Updates'));
const Reward = React.lazy(() => import('./Reward'));
const FAQ = React.lazy(() => import('./FAQ'));

class Project extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      basicInfo: '',
      gallery: '',
      updates: '',
      removedUpdates: [],
      rewards: '',
      faqs: '',
      submitted: false,
      isEditable: false,
      error: '',
      id: '',
      url: '',
      userId: '',
      status: 'draft',
      projectError: '',
      toastError: '',
      loading: false
    };
  }

  handleAuthentication = async () => {
    const currentUser = this.context;

    if (!currentUser) {
      this.props.history.replace({
        pathname: '/login',
        state: {
          urlToredirect: this.props.location.pathname
        }
      });
      return;
    }
    if (this.props.match.params.projectUrl) {
      this.setState({
        loading: true,
        isEditable: true
      });

      try {
        const projectUrl = this.props.match.params.projectUrl;
        const data = { url: projectUrl };
        const {
          data: { data: projectData, updates }
        } = await axios.post('/projects/get_project_by_url', data);

        const {
          id,
          name,
          url,
          punch_line,
          description,
          category,
          amount,
          project_location,
          featured_image,
          thumbnail_image,
          video,
          reward,
          faq,
          userId,
          status
        } = projectData;

        const user = this.context;
        if (this.props.match.params.projectUrl && user.userId !== userId) {
          toastr.error('Error', 'You can not make changes on these project');
          this.props.history.push('/my-sponsor-pages');
          return;
        }
        const basicInfo = {
          name,
          url,
          caption: punch_line,
          content: description,
          category,
          amount,
          project_location
        };
        const projectDescription = {
          content: description
        };
        const gallery = {
          featuredImg: featured_image,
          thumbImage: thumbnail_image,
          video
        };
        this.setState({
          basicInfo,
          gallery,
          projectDescription,
          updates: updates?.map((item) => ({
            ...item,
            isupdatedFirst: true
          })),
          rewards: reward ? JSON.parse(reward) : null,
          faqs: faq ? JSON.parse(faq) : null,
          loading: false,
          id: id,
          status,
          url: url
        });
      } catch (err) {
        let errorData = err.response ? err.response.data : err;
        toastr.error('Error', errorData.message);
      }
    }
  };

  componentDidMount = () => {
    this.handleAuthentication();
    const {
      location: { search }
    } = this.props;
    const parsed = queryString.parse(search);
    if (parsed.tab === 'updates') {
      this.setState({
        key: 6
      });
    }
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      const {
        location: { search }
      } = this.props;
      const parsed = queryString.parse(search);
      if (parsed.tab === 'updates') {
        this.setState({
          key: 6
        });
      } else {
        this.setState({
          key: 1,
          basicInfo: '',
          gallery: '',
          updates: '',
          removedUpdates: [],
          rewards: '',
          faqs: '',
          isEditable: false
        });
      }
    }
  };

  handleChange = (key, sectionName, data) => {
    if (sectionName === 'updates') {
      this.setState({
        key,
        [sectionName]: data.updates,
        removedUpdates: data.removedUpdates
      });
    } else {
      this.setState({
        key,
        [sectionName]: data
      });
    }
  };

  handleBack = (key) => {
    this.setState({
      key: key - 1
    });
  };

  handleSubmit = (event) => {
    const {
      basicInfo,
      gallery,
      projectDescription,
      updates,
      removedUpdates,
      rewards,
      faqs,
      isEditable,
      url,
      id,
      status
    } = this.state;

    const data = {
      basicInfo,
      gallery,
      projectDescription,
      updates,
      rewards:
        rewards && rewards.length && rewards.filter((item) => item.reward_title).length
          ? rewards
          : null,
      faqs: faqs && faqs.length && faqs.filter((item) => item.faq_ans).length ? faqs : null,
      userId: this.props.profileInfo.id,
      id,
      removedUpdates
    };

    if (isEditable) {
      this.setState({ loading: true });
      // data.url = url
      data.url = url;
      data.status = status;
      axios
        .post('projects/update_project_info', data)
        .then((response) => {
          toastr.success('Success', response.data.message);
          this.props.history.push(`/${basicInfo.url}`);
          this.setState({
            //   submitted: true,
            toastError: true,
            loading: false
          });
        })
        .catch((err) => {
          let errorData = err.response ? err.response.data : err;
          toastr.error('Error', errorData.message);
          this.setState({
            error: err.response.data.message,
            submitted: false,
            loading: false,
            key: 1,
            projectError: err.response.data.message,
            toastError: false
          });
        });
    } else {
      this.setState({ loading: true });
      axios
        .post('projects/create_project', data)
        .then((response) => {
          this.setState({
            loading: false,
            submitted: true,
            toastError: true
          });
        })
        .catch((err) => {
          let errorData = err.response ? err.response.data : err;
          toastr.error('Error', errorData.message);
          this.setState({
            error: err.response.data.message,
            submitted: false,
            toastError: false,
            loading: false
          });
        });
    }
  };

  checkProperties = (basicInfo, gallery) => {
    var state = true;
    for (var key in basicInfo) {
      if (!(basicInfo[key] === null || basicInfo[key] === '')) {
        state = false;
        break;
      }
    }
    return state;
  };

  render() {
    const {
      basicInfo,
      gallery,
      updates,
      rewards,
      faqs,
      isEditable,
      projectError,
      toastError,
      loading
    } = this.state;

    return (
      <div className="start-wrapper theme-background">
        <div className="container">
          <div className="section-title text-center">
            <h2>
              <span className="small-text-bg">Start Your Sponsor Page</span>
            </h2>
            <h3 className="start-project-heading">
              Your sponsor page will be in “Draft mode” after completing your sponsor page details.{' '}
            </h3>
            {!this.state.submitted ? (
              <div className="project-detail-wrap">
                <div className="project-detail-block">
                  <div className="project-detail-sub-block">
                    <div className="project-detail-heading">To accept money:</div>
                    <ul className="project-detail-tile">
                      <li>
                        1) Go-to <b>My Profile</b>
                      </li>
                      <li>
                        2) Click <b>My Sponsor Page</b>
                      </li>
                      <li>
                        3) Set sponsor page to <b>“Active”</b>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="project-detail-block">
                  <div className="project-detail-sub-block">
                    <div className="project-detail-heading">To get paid: </div>
                    <ul className="project-detail-tile">
                      <li>
                        1) Go-to <b>My Profile</b>
                      </li>
                      <li>
                        2) Click <b>“Get Paid Now”</b>
                      </li>
                      <li>
                        3) Choose <b>Stripe</b> or <b>PayPal</b>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="row">
            <div className="col-sm-12 start-tabs-wrap">
              <Suspense
                fallback={
                  <div className="project-card">
                    <Loader />
                  </div>
                }>
                {!this.state.submitted ? (
                  <Tabs
                    activeKey={this.state.key}
                    onSelect={this.handleChange}
                    id="controlled-tab-example"
                    className={`common-tab-wrapper${isEditable ? ' extra-tab' : ''}`}>
                    <Tab
                      eventKey={1}
                      title={
                        <span>
                          <i className="fas fa-info" />
                          Basic Information
                        </span>
                      }>
                      {loading && <Loader />}
                      {!loading && (
                        <BasicInfo
                          handleChange={this.handleChange}
                          basicInfo={basicInfo}
                          isEditable={isEditable}
                          projectError={projectError}
                        />
                      )}
                    </Tab>
                    <Tab
                      eventKey={2}
                      title={
                        <span>
                          <i className="far fa-edit" />
                          Story
                        </span>
                      }
                      disabled={this.state.basicInfo ? false : true}>
                      <ProjectDescription
                        handleChange={this.handleChange}
                        basicInfo={basicInfo}
                        isEditable={isEditable}
                        projectError={projectError}
                      />
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={
                        <span>
                          <i className="fas fa-image" />
                          Pictures & Videos
                        </span>
                      }
                      disabled={
                        this.state.basicInfo && this.state.basicInfo.content ? false : true
                      }>
                      <Gallery
                        handleChange={this.handleChange}
                        handleBack={this.handleBack}
                        gallery={gallery}
                      />
                    </Tab>
                    <Tab
                      eventKey={4}
                      title={
                        <span>
                          <i className="fas fa-question" />
                          FAQ's
                        </span>
                      }
                      disabled={this.state.basicInfo && this.state.gallery ? false : true}>
                      <FAQ
                        handleChange={this.handleChange}
                        handleBack={this.handleBack}
                        handleSubmit={this.handleSubmit}
                        faqs={faqs}
                        isEditable={isEditable}
                      />
                    </Tab>
                    <Tab
                      eventKey={5}
                      title={
                        <span>
                          <i className="fas fa-gift" />
                          Rewards
                        </span>
                      }
                      disabled={this.state.basicInfo && this.state.gallery ? false : true}>
                      <Reward
                        handleChange={this.handleChange}
                        handleBack={this.handleBack}
                        handleSubmit={this.handleSubmit}
                        rewards={rewards}
                        isEditable={isEditable}
                        toastError={toastError}
                        loading={loading}
                        heading="Sponsor Rewards"
                      />
                    </Tab>

                    {isEditable && (
                      <Tab
                        eventKey={6}
                        title={
                          <span>
                            <i className="fas fa-history" />
                            Updates
                          </span>
                        }
                        disabled={this.state.basicInfo && this.state.gallery ? false : true}>
                        <Updates
                          updates={updates}
                          loading={loading}
                          handleChange={this.handleChange}
                          handleBack={this.handleBack}
                          handleSubmit={this.handleSubmit}
                        />
                      </Tab>
                    )}
                  </Tabs>
                ) : (
                  <ThankYou url={(basicInfo || {}).url} />
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Project.contextType = UserContext;

const mapStateToProps = (state) => {
  const { user } = state.LoginReducer;
  const { profileInfo } = state.ProfileReducer;
  return {
    user,
    profileInfo
  };
};

export default connect(mapStateToProps)(Project);
