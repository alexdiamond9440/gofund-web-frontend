/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as queryString from 'query-string';
import {
  frontUrl,
  facebookBaseUrl,
  twitterBaseUrl,
  linkedinBaseUrl,
  instagramBaseUrl,
  youtubeUserBaseUrl,
  tiktokBaseUrl
} from './../../constants';
import ProjectDetail from '../ProjectDetail';
import Loader from '../../components/Loader';
import Pagination from './../Pagination';
import 'react-circular-progressbar/dist/styles.css';
import SearchBlock from '../ProjectList/SearchBlock';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import { getSocialLinkurl, seperateInstagramUserName } from '../userprofile/url';

class ProfileList extends Component {
  constructor() {
    super();
    this.state = {
      profiles: [],
      name: '',
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 12,
      pageNeighbours: 1,
      changedata: ''
    };
  }
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  componentDidMount() {
    this.handleQueryParam();
  }
  handleQueryParam = () => {
    const parsed = queryString.parse(this.props.location.search);
    let page = '';
    let name = '';
    if (parsed) {
      page = parsed.page ? parseInt(parsed.page) : 1;
      name = parsed.search ? parsed.search : '';
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
    this.setState(
      {
        page,
        name,
        currentPage: page
      },
      () => this.getProfiles()
    );
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleQueryParam();
    }
  };
  handleReset = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed) {
      this.props.history.push('/profiles');
      this.setState({
        category: '',
        name: '',
        percentage: '',
        username: '',
        currentPage: 1
      });
    } else {
      this.setState({
        name: ''
      });
    }
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, changedata: event.target.value.length });
  };

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    /*    this.setState({
			currentPage: 1
		}); */
    const myInputBox = document.getElementById('suggestion-tags');
    if (myInputBox) {
      myInputBox.blur();
    }
    let data = {};
    const { name } = this.state;
    if (name) {
      data.search = name;
    }

    let url = queryString.stringify(data);
    this.props.history.push(`/profiles?${url}&page=1`);
  };
  renderProject = (projectId) => {
    return <ProjectDetail projectId={projectId} />;
  };
  getProfiles = () => {
    const { pageLimit, name, currentPage } = this.state;
    this.setState({
      loading: true
    });
    axios
      .get(`/profile/get-profile-list?page=${currentPage}&limit=${pageLimit}&name=${name}`)
      .then((response) => {
        this.setState({
          profiles: response.data.data.rows,
          totalRecords: response.data.data.count,
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  handleClick = (page) => {
    this.setState({ page }, () => {
      this.getProfiles();
    });
  };
  onPageChanged = async (data) => {
    const { currentPage } = data;
    const { location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    if (currentPage !== this.state.currentPage) {
      this.props.history.push(
        [pathname, queryString.stringify({ ...query, page: currentPage })].join('?')
      );
    }
  };

  onSponsorBtnClick = (profileUrl) => {
    this.props.history.push(`/${profileUrl}?donate=true`);
  };

  render() {
    const {
      profiles,
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      pageNeighbours,
      name,
      changedata
    } = this.state;
    return (
      <div>
        <div className="page-causes-section project-find-wrap">
          <div className="section-title text-center">
            <h2>
              <span className="small-text-bg">Support Girls & Women Now</span>
            </h2>
            {/* <p>
                Make people Discover the best and brightest projects on
                GoFundHer.
              </p> */}
          </div>
          <SearchBlock
            name={name}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleReset={this.handleReset}
            changedata={changedata}
          />
          <div className="container">
            <div className="row justify-content-md-center row-project-list  user-list-wrap">
              {!loading ? (
                profiles && profiles.length > 0 ? (
                  profiles.map((user, index) => {
                    let isStripeConnected = user && user.is_acc_updated && user.is_verified;
                    let isPaypalConnected = user && user.is_paypal_connected;
                    const instagramUsername = seperateInstagramUserName(user);
                    const fbUrl = getSocialLinkurl(user.facebook, facebookBaseUrl);
                    const twitterUrl = getSocialLinkurl(user.twitter, twitterBaseUrl);
                    const instagramUrl = getSocialLinkurl(instagramUsername, instagramBaseUrl);
                    const linkedinUrl = getSocialLinkurl(user.linkedin, linkedinBaseUrl);
                    // const whatsappUrl = getSocialLinkurl(user.whatsapp, whatsappBaseUrl)
                    // const twitchUrl = getSocialLinkurl(user.twitch, twitchBaseUrl)
                    const youTubeUrl = getSocialLinkurl(user.youtube, youtubeUserBaseUrl);
                    const tiktokUrl = getSocialLinkurl(user.tiktokUrl, tiktokBaseUrl);
                    const imageUrl =
                      user.avatar && user.avatar.search('https://') > -1
                        ? user.avatar.replace('s96-c', 's256-c') //for google picture size
                        : `${frontUrl}${user.avatar}`;
                    return (
                      <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12" key={index}>
                        <div className="user-card">
                          <div className="user-media">
                            {user.avatar ? (
                              <Link to={`/${user.profileUrl}`} className="user-title word-wrap">
                                <>
                                  <img src={imageUrl} alt="" />
                                  <div
                                    className="user-profile-img"
                                    style={{
                                      backgroundImage: `url( ${imageUrl})`
                                    }}></div>
                                </>
                              </Link>
                            ) : (
                              <Link to={`/${user.profileUrl}`} className="user-title word-wrap">
                                <>
                                  <img
                                    src="/assets/img/user.svg"
                                    alt=""
                                    style={{ width: '120px' }}
                                  />
                                </>
                              </Link>
                            )}
                          </div>
                          <div className="user-info">
                            <div className="skew-content-box">
                              <ul className="user-social-icon">
                                <li>
                                  {user.facebook ? (
                                    <a href={`${fbUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-facebook-f" />
                                    </a>
                                  ) : null}
                                </li>
                                <li>
                                  {user.twitter ? (
                                    <a href={`${twitterUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-twitter" />
                                    </a>
                                  ) : null}
                                </li>
                                <li>
                                  {' '}
                                  {user.instagram ? (
                                    <a href={`${instagramUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-instagram" />
                                    </a>
                                  ) : null}
                                </li>
                                <li>
                                  {user.linkedin ? (
                                    <a href={`${linkedinUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-linkedin" />
                                    </a>
                                  ) : null}
                                </li>
                                <li>
                                  {user.youtube ? (
                                    <a href={`${youTubeUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-youtube" />
                                    </a>
                                  ) : null}
                                </li>
                                <li>
                                  {user.tiktok ? (
                                    <a href={`${tiktokUrl}`} target={'_blank'} rel="noreferrer">
                                      <span className="fab fa-tiktok" />
                                    </a>
                                  ) : null}
                                </li>
                              </ul>
                            </div>

                            <Link to={`/${user.profileUrl}`} className="user-title word-wrap">
                              {user.first_name} {user.last_name}
                            </Link>
                            <p className="user-desc word-wrap">
                              {user.bio && user.bio.length > 100 ? (
                                <span>{user.bio.substr(0, 80)}.....</span>
                              ) : (
                                <span>{user.bio}</span>
                              )}
                            </p>
                            {isStripeConnected || isPaypalConnected ? (
                              <span
                                className="view-sponsor-btn"
                                onClick={() => this.onSponsorBtnClick(user.profileUrl)}
                                to={`/${user.profileUrl}`}>
                                Sponsor Now
                              </span>
                            ) : (
                              <TooltipComponent
                                message="This page is not ready to receive money"
                                id={'stripe'}>
                                <div
                                  className="disabled-wrap view-sponsor-btn disabled-sponser"
                                  id={'stripe'}>
                                  Sponsor now
                                </div>
                              </TooltipComponent>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-search-section">
                    <div className="empty-img">
                      <img src="/assets/img/no-search-found.svg" alt="" />
                    </div>
                    <div className="text-center">
                      {name ? (
                        <p>No user profiles are available related to your search.</p>
                      ) : (
                        <p>No user profiles are available.</p>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <Loader />
              )}
            </div>
            <div className="pagination-area">
              {totalRecords ? (
                <Pagination
                  totalRecords={totalRecords}
                  currentPage={currentPage}
                  pageLimit={pageLimit}
                  pageNeighbours={pageNeighbours}
                  onPageChanged={this.onPageChanged}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileList;
