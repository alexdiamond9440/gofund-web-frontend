/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import axios from 'axios';
import moment from 'moment';
import { newsLetterValidator } from '../../../helpers/newsLetterValidator';
/* import { Button, Col, Container, Row } from "reactstrap";  */

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errors: {},
      isLoading: false
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    const { email } = this.state;
    const data = {
      email
    };
    const result = newsLetterValidator(data);
    if (result.formIsValid) {
      this.setState({
        isLoading: true
      });
      axios
        .post('/newsLetter/add', data)
        .then((resp) => {
          if (resp) {
            this.setState({
              isLoading: false,
              email: ''
            });
            toastr.success('Success', resp.data.message);
          }
        })
        .catch((err) => {
          if (err && err.response && err.response.data)
            toastr.error('Error', err.response.data.message);
          this.setState({
            isLoading: false,
            email: ''
          });
        });
    } else {
      this.setState({
        errors: result.errors
      });
    }
  };
  handleChange = (event) => {
    const {
      target: { value }
    } = event;
    this.setState({ email: value, errors: '' });
  };
  render() {
    const { email, isLoading, errors } = this.state;
    return (
      <footer>
        <div className="footer-section">
          <div className="container">
            <div className="row">
              <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12 ">
                <div className="widget widget-contact">
                  <Link to="/" className="footer-logo">
                    <img
                      className="img-fluid"
                      src="/assets/img/gofundher-logo-new.png"
                      alt="logo"
                    />
                  </Link>
                  <p className="footer-text-color">
                    We believe the best way to support girls and women is with direct deposits.{' '}
                  </p>

                  <p className="telephone">
                    <a href="mailto:info@GoFundHer.com" target="_blank" rel="noopener noreferrer">
                      {' '}
                      <i className="fas fa-envelope" />
                      info@GoFundHer.com
                    </a>
                  </p>
                  <p className="telephone1">
                    <a
                      href="https://www.citygirlsbigdreams.com"
                      target="_blank"
                      rel="noopener noreferrer">
                      <i className="fa fa-globe" />
                      &nbsp; Build Your Network with City Girls Big Dreams
                    </a>
                  </p>

                  <div className="widget widget-contact-icon">
                    <a
                      href="https://www.facebook.com/GofundHercom-1743604505861961/ "
                      target="_blank"
                      rel="noopener noreferrer">
                      <img width="36px" src="/assets/img/icons/facebook-icon.svg" alt="facebook" />
                    </a>
                    <a
                      href="https://twitter.com/_gofundher"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img width="36px" src="/assets/img/icons/twitter-icon.svg" alt="twitter" />
                    </a>
                    <a
                      href="https://www.instagram.com/_gofundher/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img
                        width="36px"
                        src="/assets/img/icons/instagram-icon.svg"
                        alt="instagram"
                      />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/gofundher"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img width="36px" src="/assets/img/icons/linkedin-icon.svg" alt="linkedin" />
                    </a>
                    <a
                      href="https://www.pinterest.com/citygirlsbigdreams/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img
                        width="36px"
                        src="/assets/img/icons/pinterest-icon.svg"
                        alt="pinterest"
                      />
                    </a>
                    <a
                      href="https://www.youtube.com/channel/UC9RwbgciVUfzZLybJgbk2Kw"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img width="36px" src="/assets/img/icons/youtube-icon.svg" alt="youtube" />
                    </a>
                    {/* <a
                      href="https://gofundher.medium.com/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <img width="36px" src="/assets/img/icons/medium-icon.svg" alt="medium" />
                    </a> */}
                  </div>
                  <div className="widget widget-mobile-app">
                    <h4>Download Mobile App</h4>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://play.google.com/store/apps/details?id=com.gofundher.pwawrapper&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                      <img
                        height="62px"
                        alt="Get it on Google Play"
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12">
                <div className="widget widget-about widget-links mb-3">
                  <h4>Start Now</h4>
                  <ul>
                    <li>
                      <Link to="/search">Search</Link>
                    </li>
                    <li>
                      <Link to="/start">Start</Link>
                    </li>
                    <li>
                      <a
                        alt="events"
                        href="https://citygirlsbigdreams.com/events"
                        rel="noopener noreferrer"
                        target="_blank">
                        Events
                      </a>
                    </li>
                    <li>
                      <a
                        alt="Contact Us"
                        href="https://support.gofundher.com/hc/en-us/requests/new"
                        rel="noopener noreferrer"
                        target="_blank">
                        Contact Us
                      </a>
                    </li>
                    {!JSON.parse(localStorage.getItem('user')) ? (
                      <>
                        <li>
                          <Link to="/join">Join/Login</Link>
                        </li>
                      </>
                    ) : null}
                  </ul>
                </div>

                <div className="widget widget-about widget-links">
                  <h4>Information</h4>
                  <ul>
                    <li>
                      <a
                        alt="About us"
                        href="https://support.gofundher.com/hc/en-us/articles/360052401233-About-GoFundHer-com"
                        rel="noopener noreferrer"
                        target="_blank">
                        About us
                      </a>
                    </li>
                    <li>
                      <a
                        alt="Supported countries"
                        href="https://support.gofundher.com/hc/en-us/articles/360052401513-Supported-Countries"
                        rel="noopener noreferrer"
                        target="_blank">
                        Supported countries
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://citygirlsbigdreams.com/blog"
                        target="_blank"
                        rel="noopener noreferrer">
                        Blog
                      </a>
                    </li>

                    <li>
                      <a
                        alt="How it works"
                        href="https://support.gofundher.com/hc/en-us/articles/360052492573-Common-Questions"
                        rel="noopener noreferrer"
                        target="_blank">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a
                        alt="Jobs & Internship"
                        href="https://citygirlsbigdreams.com/virtual-internship"
                        rel="noopener noreferrer"
                        target="_blank">
                        Jobs & Internship
                      </a>
                    </li>
                    <li>
                      <a
                        alt="Help Center"
                        href="https://support.gofundher.com/hc/en-us"
                        rel="noopener noreferrer"
                        target="_blank">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        alt="Press Center"
                        href="https://support.gofundher.com/hc/en-us/articles/360052408773-Press-Media-Center"
                        rel="noopener noreferrer"
                        target="_blank">
                        Press Center
                      </a>
                    </li>
                    <li>
                      <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>

                    <li>
                      <Link to="/terms-of-use">Terms of Use</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12">
                <div className="widget widget-post">
                  <h4>Join Our Newsletter</h4>
                  <form className="newsletter-form" onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      className="form-control"
                      placeholder="Enter your email address"
                      onChange={this.handleChange}
                    />
                    {errors && errors.email ? (
                      <div className="text-danger">{errors.email}</div>
                    ) : (
                      ''
                    )}
                    {isLoading ? (
                      <button disabled className="subscribe-btn">
                        Loading....
                      </button>
                    ) : (
                      <button type="submit" className="subscribe-btn">
                        Subscribe Now
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="footer-card-section">
              <div className="card-logo">
                <img src="/assets/img/footer-secure-card.png" alt="" className="img-fluid" />
              </div>
            </div>

            <div className="footer-bottom">
              <div className="design-by text-center">
                <span>{`2018-${moment().year()} © GoFundHer All Rights Reserved.`}</span>
                <div
                  className={
                    this.props.scrollLeft > 0.21 && this.props.scrollLeft < 0.95
                      ? 'fadeIn '
                      : 'fadeOut'
                  }>
                  <button className="scrollbutton" onClick={this.props.scrollToTop}>
                    <img className="setarrow" src="/assets/img/icons/toparrow.svg" alt="logo" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
