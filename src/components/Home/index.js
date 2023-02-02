import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import ProjectSliderComponent from './ProjectSlider';
import UserSliderComponent from './UserSlider';
import YouTubeFeeds from './YouTubeFeeds';
import './Home.css';
import { AiFillThunderbolt } from 'react-icons/ai';
import { TiSpiral } from 'react-icons/ti';
import { FaRegSmile } from 'react-icons/fa';
import missions from '../../constants/mission.json';
import { WomenGallery } from './WomenGallery';
import { UserContext } from 'contexts/UserContext';
import StartMyPage from 'components/StartMyPage';

const initialState = {
  projects: [],
  projectsLoading: false,
  featuredProfiles: [],
  featuredProfilesLoading: false,
  secondFeaturedProfiles: [],
  secondFeaturedProfilesLoading: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'PROJECTS_LOADED':
      return { ...state, projectsLoading: false, projects: action.payload };
    case 'PROJECTS_LOADING':
      return { ...state, projectsLoading: true, projects: [] };
    case 'FEATURED_PROFILES_LOADED':
      return { ...state, featuredProfilesLoading: false, featuredProfiles: action.payload };
    case 'FEATURED_PROFILES_LOADING':
      return { ...state, featuredProfilesLoading: true, featuredProfiles: [] };
    case 'SECOND_FEATURED_PROFILES_LOADED':
      return {
        ...state,
        secondFeaturedProfilesLoading: false,
        secondFeaturedProfiles: action.payload
      };
    case 'SECOND_FEATURED_PROFILES_LOADING':
      return { ...state, secondFeaturedProfilesLoading: true, secondFeaturedProfiles: [] };

    default:
      return state;
  }
};

const Home = (props) => {
  const buttonReference = useRef(null);
  const loggedInUser = useContext(UserContext);
  const token = loggedInUser?.token;
  const {
    profileData: { profileInfo }
  } = props;

  const [state, dispatch] = useReducer(reducer, initialState);

  const onUserProfile = async (userId, value) => {
    const { history } = props;
    if (value === 'profile') {
      history.push(`/${userId}`);
    } else {
      const { projects } = state;
      projects.forEach((element) => {
        if (userId === element.userId) {
          const profileUrl = element.User.profileUrl;
          history.push(`/${profileUrl}`);
        }
      });
    }
  };

  useEffect(() => {
    dispatch({ type: 'SECOND_FEATURED_PROFILES_LOADING' });
    dispatch({ type: 'FEATURED_PROFILES_LOADING' });
    dispatch({ type: 'PROJECTS_LOADING' });
    // api to get all featured projects
    axios
      .get(`/projects/get_all_project`, { params: { isFeatured: true } })
      .then((response) => {
        dispatch({ type: 'PROJECTS_LOADED', payload: response.data.data });
      })
      .catch((err) => {
        dispatch({ type: 'PROJECTS_LOADED', payload: [] });
      });
    // featured profiles row
    axios
      .get(`/users/get_all_users`, { params: { isFeatured: true } })
      .then((response) => {
        dispatch({ type: 'FEATURED_PROFILES_LOADED', payload: response.data.data });
      })
      .catch((err) => {
        dispatch({ type: 'FEATURED_PROFILES_LOADED', payload: [] });
      });
    // second featured profiles row
    axios
      .get(`/users/get_all_users`, { params: { isFeaturedSecond: true } })
      .then((response) => {
        dispatch({ type: 'SECOND_FEATURED_PROFILES_LOADED', payload: response.data.data });
      })
      .catch((err) => {
        dispatch({ type: 'SECOND_FEATURED_PROFILES_LOADED', payload: [] });
      });
  }, []);

  return (
    <div id="homePage">
      <div className="homepage-hero text-center">
        <h1>Support Her and Go Fund Her</h1>
        <div>
          <Link
            to="/search"
            className="btn btn-donate-big btn-active btn-transparent mr30"
            style={{ fontWeight: 700 }}>
            Sponsor Now
          </Link>
          <Link
            ref={buttonReference}
            to="/start"
            className="btn btn-donate-big btn-transparent join-wrap"
            style={{ fontWeight: 700, top: 50 }}>
            Start Now
          </Link>
        </div>
        <p>Find sponsors with a profile page</p>
      </div>
      <div className="step-process-wrap">
        <div className="container">
          <div className="row">
            <div className="">
              <div className="col-sm-4 col-md-4 step-block-width">
                <div className="step-block">
                  <div className="step-icon">
                    <img src="/assets/img/start-step-1.png" alt="fail upload" />
                  </div>
                  <h5>
                    <Link to={token ? '/start' : '/join'} className="step-link">
                      Create Account
                    </Link>
                  </h5>
                  <p>
                    Your <b>GoFundHer Profile page </b> can find sponsors or you can{' '}
                    <b>create “Sponsor” pages.</b>
                  </p>
                  <div className="back-icon">01</div>
                </div>
              </div>
              <div className="col-sm-4 col-md-4 step-block-width">
                <div className="step-block">
                  <div className="step-icon">
                    <img src="/assets/img/start-step-2-1.png" alt="fail upload" />
                  </div>
                  <h5>
                    <Link
                      to={
                        token && profileInfo && profileInfo.profileUrl
                          ? `/${profileInfo.profileUrl}`
                          : '/login'
                      }
                      className="step-link">
                      Share your Link
                    </Link>
                  </h5>
                  <p>GoFundHer.com/______.</p>
                  <ul className="step-list">
                    <li>
                      <span className="check-icon">
                        <img src="/assets/img/right-pink.svg" alt="" />
                      </span>
                      <span className="list-text">Send emails</span>
                    </li>
                    <li>
                      <span className="check-icon">
                        <img src="/assets/img/right-pink.svg" alt="" />
                      </span>
                      <span className="list-text">Send text messages</span>
                    </li>
                    <li>
                      <span className="check-icon">
                        <img src="/assets/img/right-pink.svg" alt="" />
                      </span>
                      <span className="list-text">Share on social media</span>
                    </li>
                  </ul>
                  <div className="back-icon">02</div>
                </div>
              </div>
              <div className="col-sm-4 col-md-4 step-block-width">
                <div className="step-block">
                  <div className="step-icon">
                    <img src="/assets/img/start-step-3.png" alt="fail upload" />
                  </div>
                  <h5>
                    <Link to={token ? '/get-paid-now' : '/login'} className="step-link">
                      Receive Money
                    </Link>
                  </h5>
                  <p className="collect-money-card-wrap">
                    Receive your money with <b>PayPal</b> or <b>direct deposit</b> to your bank
                    account from <b>STRIPE.</b>
                  </p>
                  <div className="back-icon">03</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-gray xs-partner-section">
        <div className="container">
          <div className="row home-about-us-section">
            <div className="col-lg-7 col-md-12 xol-sm-12 col-xs-12">
              <div className="iframe-box">
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    className="embed-responsive-item"
                    width={'100%'}
                    height={'400px'}
                    title={'video'}
                    frameBorder="0"
                    src={`https://www.youtube.com/embed/x-LV9Eh4RnM?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0`}
                    allowFullScreen></iframe>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-12 xol-sm-12 col-xs-12">
              <div className="xs-partner-content1">
                <div className="xs-heading xs-mb-40">
                  <h2 className="xs-mb-0 xs-title heading-about-us">
                    <span>About Us</span>
                  </h2>
                </div>

                <p className="mt-4">
                  <span className="theme-text-color">
                    {' '}
                    <b>GoFundHer</b>
                  </span>{' '}
                  is a crowdfunding platform for equality. Your supporters can sponsor you one-time
                  or set up monthly sponsorship to you for as low as{' '}
                  <span className="theme-text-color">
                    <b>$1</b>
                  </span>
                  .
                </p>
                <p>Available in Asia, Africa, South America, North America, Europe & Australia!</p>
                <ul className="about-us-list">
                  <li>
                    <FaRegSmile className="icons-styling" />
                    Raise Money For Anything
                  </li>
                  <li>
                    <AiFillThunderbolt className="icons-styling" />
                    Fast 4 Minute Setup
                  </li>
                  <li>
                    <i className="fas fa-heart icons-styling heart"></i>
                    Open to everyone, Available Worldwide{' '}
                  </li>
                  <li>
                    <TiSpiral className="icons-styling spiral" />
                    Coaching from <span className="theme-text-color"> City Girls Big Dreams </span>
                  </li>
                </ul>
                <p className="About-us-blog"></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UserSliderComponent
        users={state.featuredProfiles}
        userLoading={state.featuredProfilesLoading}
        onUserProfile={onUserProfile}
        {...props}
      />
      <WomenGallery />
      <ProjectSliderComponent
        projects={state.projects}
        loading={state.projectsLoading}
        onUserProfile={onUserProfile}
        {...props}
      />
      <YouTubeFeeds />
      <section className="intro-section style-two">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title text-center">
                <h2 className="small-text-bg">Our Mission</h2>
              </div>
            </div>
          </div>
          <div className="row chirity-keywords-wrap">
            {missions.map((mission) => (
              <div className="col-lg-3 col-md-4 col-sm-4 col-xs-6 no-padding" key={mission.title}>
                <Link to={`/search?search=${mission.title.toLowerCase()}`}>
                  <div className="single-intro style-two text-center">
                    <div className="thumb">
                      <img src={mission.imgPath} alt={mission.title} />
                    </div>
                    <h5 className="intro-title">{mission.title}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-35">
          <Link to={token ? '/start' : '/join'} className="btn btn-donate-big donate-home-btn">
            Start Now
          </Link>
        </div>
      </section>
      <UserSliderComponent
        users={state.secondFeaturedProfiles}
        userLoading={state.secondFeaturedProfilesLoading}
        onUserProfile={onUserProfile}
        {...props}
      />
      <StartMyPage />
      <section className="bg-gray xs-partner-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="xs-partner-content text-center">
                <div className="xs-heading ">
                  <h2 className="xs-mb-0 xs-title">
                    <span>Fund Women Worldwide</span>
                  </h2>
                </div>
                <p>
                  For Corporations and Charity Foundations, GoFundHer.com helps you find and send
                  money directly to women anywhere in the world.
                </p>

                <div className="text-smcenter">
                  {loggedInUser && (
                    <Link to="/sponsors" className="btn btn-donate-big donate-home-btn ">
                      Sponsor with us
                    </Link>
                  )}
                  {!loggedInUser && (
                    <Link to="/sponsors" className="btn btn-donate-big donate-home-btn ">
                      Sponsor with us
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    profileData: state.ProfileReducer
  };
};

export default connect(mapStateToProps)(Home);
