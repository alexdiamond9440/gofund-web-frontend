import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { login, socialLogin } from './../../store/actions/Login';
import { validator } from './../../helpers/validator';
import { Backend_url } from '../../constants';
import { PrivacyPolicyAccept } from 'components/PrivacyPolicyAccept';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: '',
      show: this.props.loginState.error ? true : false
    };
  }
  componentDidMount = () => {
    window.scrollTo(0, 0);
    if (this.props.loginstatus.isloggedIn) {
      this.props.history.push('/my-sponsor-pages');
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    const result = validator(data);
    if (result.formIsValid) {
      const { state } = this.props.location;
      this.props.loginUser(data, (state && state.urlToredirect) || '');
    } else {
      this.setState({
        errors: result.errors
      });
      return;
    }
    this.setState({
      show: this.props.loginState.error ? true : false
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: ''
      }
    });
  };

  responseFacebook = (response) => {
    if (response.accessToken) {
      const { state } = this.props.location;
      this.props.socialLogin(response, (state && state.urlToredirect) || '');
    }
  };

  render() {
    const { errors } = this.state;
    const {
      loginState,
      location: { state }
    } = this.props;
    return (
      <div>
        <div className="auth-warp d-flex align-items-center justify-content-center">
          <div className="auth-block">
            <div className="row m-0 d-flex  auth-row" style={{ maxWidth: '1080' }}>
              <div className="col-sm-6 auth-image-block ">
                <div className="login-text">
                  If You Support Her, Then Go Fund Her.
                  {/* state && state.urlToredirect === "/start" ? "For setting up your project you may login with the same credentials that you had used for joining the Gofundher community" : "If you support her, then go fund her." */}
                </div>
                <div className="login-img-section">
                  <div className="login-img-wrap">
                    <div className="login-img">
                      <img className="mw-100" src="/assets/img/dobation.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-block col-sm-6">
                <form className="">
                  <div className="auth-link-block clearfix">
                    <Link
                      className="link"
                      to={{
                        pathname: '/join',
                        state: {
                          urlToredirect: state && state.urlToredirect ? state.urlToredirect : ''
                        }
                      }}>
                      Join
                    </Link>
                    <Link className="link active" to="/login">
                      Login
                    </Link>
                  </div>

                  <div className="social-signup text-center ">
                    <h5 className="social-title">Login with Social</h5>
                    <div className="social-btn-block  pb-3">
                      <a
                        href={`${Backend_url}/auth/facebook`}
                        className="btn btn-social btn-facebook">
                        <i className="fab fa-facebook"></i>
                        Facebook
                      </a>
                      <a href={`${Backend_url}/linkedin`} className="btn btn-social btn-linkedin">
                        <i className="fab fa-linkedin"></i>
                        Linkedin
                      </a>
                      <a href={`${Backend_url}/auth/google`} className="btn btn-social btn-google">
                        <i className="fab fa-google"></i>
                        Google
                      </a>
                    </div>

                    <div className="head-line">
                      <span className="">Or Login with</span>
                    </div>

                    {/* <button className="btn btn-social">Facebook</button> */}
                  </div>

                  <div className="row">
                    <div className="col-md-12 input-block form-group login-form-group">
                      <input
                        className="form-control form-input"
                        id="exampleFormControlInput1"
                        name="email"
                        value={this.state.email}
                        type="email"
                        placeholder="Email Address"
                        onChange={this.handleChange}
                        autoComplete="username"
                      />
                      <span className="form-icon">
                        <img src="/assets/img/partner/mail.svg" alt="icon" />
                      </span>

                      {errors && errors['email'] ? (
                        <div className="text-danger">{errors['email']}</div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="col-md-12 input-block form-group login-form-group">
                      <input
                        className="form-control form-input"
                        name="password"
                        value={this.state.password}
                        type="password"
                        placeholder="Password"
                        onChange={this.handleChange}
                        autoComplete="current-password"
                      />
                      <span className="form-icon">
                        <img src="/assets/img/partner/lock.svg" alt="icon" />
                      </span>
                      {errors && errors['password'] ? (
                        <div className="text-danger">{errors['password']}</div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="pt-2" />
                  <div className="remeber-block-warp">
                    <div className="remeber-block">
                      <div className="btn-login">
                        <button
                          className="btn btn-submit"
                          type="submit"
                          onClick={this.handleSubmit}>
                          {loginState.loggingIn ? <i className="fa fa-spinner fa-spin" /> : 'Login'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Link className="forgot-link" to="/forgot-password">
                        Forgot Password
                        <span className="qustion-mark">?</span>
                      </Link>
                    </div>
                  </div>
                  <PrivacyPolicyAccept />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const loginstatus = state.LoginReducer;
  return {
    loginState: state.LoginReducer,
    loginstatus
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData, urlToredirect) => {
      dispatch(login(userData, urlToredirect));
    },
    socialLogin: (userData, urlToredirect) => {
      dispatch(socialLogin(userData, urlToredirect));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
