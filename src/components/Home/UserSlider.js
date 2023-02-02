/** @format */

import React, { Component } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import {
  frontUrl,
  facebookBaseUrl,
  twitterBaseUrl,
  linkedinBaseUrl,
  instagramBaseUrl,
  youtubeUserBaseUrl,
  tiktokBaseUrl
} from '../../constants';
import './Home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
//import Loader from '../../containers/Dashboard/FullPageLoader';
import Loader from '../Loader/index';
import '../../containers/Dashboard/transation.css';
import { getSocialLinkurl, seperateInstagramUserName } from '../../containers/userprofile/url';

class UserSliderComponent extends Component {
  render() {
    const usersettings = {
      dots: true,
      arrow: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      className: 'project-slider',
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    const { users, userLoading } = this.props;
    return (
      <div className="causes-section home-cases-section">
        <div className="container">
          <div className="project-card">
            {!userLoading ? (
              <>
                {users && users.length ? (
                  <>
                    <div className="section-title text-center active-project-wrap">
                      <h2 className="small-text-bg">Featured Profiles</h2>
                    </div>
                    <Slider {...usersettings}>
                      {users.map((user, index) => {
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
                          <div className="user-slider-item" key={index}>
                            <div className="user-card">
                              <div className="user-media">
                                {user.avatar ? (
                                  <>
                                    <img src={imageUrl} alt="" />
                                    <div
                                      className="user-profile-img"
                                      style={{
                                        backgroundImage: `url( ${imageUrl})`
                                      }}></div>
                                  </>
                                ) : (
                                  <>
                                    <img
                                      src="/assets/img/user.svg"
                                      alt=""
                                      style={{ width: '120px' }}
                                    />
                                    {/* <div
                                className='user-profile-img'
                                style={{
                                  backgroundImage: `url(/assets/img/user.svg)`,
                                }}
                              ></div> */}
                                  </>
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
                                        <a
                                          href={`${twitterUrl}`}
                                          target={'_blank'}
                                          rel="noreferrer">
                                          <span className="fab fa-twitter" />
                                        </a>
                                      ) : null}
                                    </li>
                                    <li>
                                      {' '}
                                      {user.instagram ? (
                                        <a
                                          href={`${instagramUrl}`}
                                          target={'_blank'}
                                          rel="noreferrer">
                                          <span className="fab fa-instagram" />
                                        </a>
                                      ) : null}
                                    </li>
                                    <li>
                                      {user.linkedin ? (
                                        <a
                                          href={`${linkedinUrl}`}
                                          target={'_blank'}
                                          rel="noreferrer">
                                          <span className="fab fa-linkedin" />
                                        </a>
                                      ) : null}
                                    </li>
                                    <li>
                                      {user.youtube ? (
                                        <a
                                          href={`${youTubeUrl}`}
                                          target={'_blank'}
                                          rel="noreferrer">
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
                                {/* <h5 className='user-title word-wrap'>
                            <span
                              onClick={() =>
                                onUserProfile(user.profileUrl, 'profile')
                              }
                            >
                              {user.first_name && user.last_name
                                ? [user.first_name, user.last_name].join(' ')
                                : null}
                            </span>
                          </h5>  */}
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
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {/* </div> */}
                    </Slider>
                  </>
                ) : null}
              </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default UserSliderComponent;
