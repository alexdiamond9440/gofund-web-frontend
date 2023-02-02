import React from 'react';
import { connect } from 'react-redux';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import signup from './../../store/actions/signup';
import { socialLogin } from './../../store/actions/Login';
import { validator } from './../../helpers/validator';
import { frontUrl } from '../../constants';
import { PrivacyPolicyAccept } from 'components/PrivacyPolicyAccept';

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: '',
      firstName: '',
      lastName: '',
      password: '',
      rePassword: '',
      email: '',
      isError: true,
      errorMsg: 'Password is required',
      isAlphaError: true,
      isNumberError: true,
      isLengthError: true,
      isChecked: false,
      isAuthenticated: false,
      isSubmitted: false,
      popoverOpen: false,
      show: this.props.signUpdata.error ? true : false
    };
  }
  onDismiss = () => {
    this.setState({
      show: false
    });
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.signUpdata.error !== this.props.signUpdata.error) {
      this.setState({
        show: this.props.signUpdata.error ? true : false
      });
    }
  }
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
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitted: true });

    const { firstName, lastName, email, password, rePassword, isError } = this.state;
    const data = {
      firstName,
      lastName,
      email,
      password,
      rePassword
    };
    const result = validator(data);
    if (result.formIsValid && !isError) {
      const { state } = this.props.location;
      this.props.signUp(data, (state && state.urlToredirect) || '');
    } else {
      this.setState({
        errors: result.errors
      });
      return;
    }
    this.setState({
      show: this.props.signUpdata.error ? true : false
    });
  };
  responseFacebook = (response) => {
    if (response.accessToken) {
      const { state } = this.props.location;
      this.props.socialLogin(response, (state && state.urlToredirect) || '');
    }
  };
  render() {
    const { state } = this.props.location;
    const { loginstatus, signUpdata } = this.props;
    if (loginstatus.isloggedIn) {
      this.props.history.push('/my-sponsor-pages');
    }
    const { errors } = this.state;
    const popoverLeft = (
      <Popover
        id="popover-basic"
        placement="bottom"
        title="Password Requirements"
        className="password-info">
        <li>
          {!this.state.isAlphaError ? (
            <img src="/assets/img/check.png" alt="check" />
          ) : (
            <img src="/assets/img/cross-mark.svg" alt="cross-mark" />
          )}
          Must contain a Letter
        </li>
        <li>
          {!this.state.isNumberError ? (
            <img src="/assets/img/check.png" alt="check" />
          ) : (
            <img src="/assets/img/cross-mark.svg" alt="cross-mark" />
          )}
          Must contain a Number
        </li>
        <li>
          {!this.state.isLengthError ? (
            <img src="/assets/img/check.png" alt="check" />
          ) : (
            <img src="/assets/img/cross-mark.svg" alt="cross-mark" />
          )}
          At least 8 characters long
        </li>
      </Popover>
    );
    return (
      <div>
        <div className="auth-warp d-flex align-items-center justify-content-center">
          <div className="auth-block">
            <div className="row m-0 d-flex auth-row">
              <div className="col-sm-6 auth-image-block ">
                <div className="login-text">If You Support Her, Then Go Fund Her.</div>
                <div className="login-img-section">
                  <div className="login-img-wrap">
                    <div className="login-img">
                      <img className="mw-100" src="/assets/img/dobation.svg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-block col-sm-6">
                <form className="" onSubmit={this.handleSubmit}>
                  <div className="auth-link-block clearfix">
                    <Link className="link active" to="/join">
                      Join
                    </Link>
                    <Link
                      className="link"
                      to={{
                        pathname: '/login',
                        state: {
                          urlToredirect: state && state.urlToredirect ? state.urlToredirect : ''
                        }
                      }}>
                      Login
                    </Link>
                  </div>
                  <div className="social-signup text-center ">
                    <h5 className="social-title">Join with Social</h5>
                    <div className="social-btn-block  pb-3">
                      <a href={`${frontUrl}/auth/facebook`} className="btn btn-social btn-facebook">
                        <i className="fab fa-facebook"></i>
                        Facebook
                      </a>
                      <a href={`${frontUrl}/linkedin`} className="btn btn-social btn-linkedin">
                        <i className="fab fa-linkedin"></i>
                        Linkedin
                      </a>
                      <a href={`${frontUrl}/auth/google`} className="btn btn-social btn-google">
                        <i className="fab fa-google"></i>
                        Google
                      </a>

                      <div className="head-line">
                        <span className="">Or Join with</span>
                      </div>
                      {/* <button className="btn btn-social">Facebook</button> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 input-block form-group login-form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                        maxLength={30}
                      />
                      <span className="form-icon">
                        <img src="/assets/img/partner/user.svg" alt="icon" />
                      </span>
                      {errors && errors['firstName'] ? (
                        <div className="text-danger">{errors['firstName']}</div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="col-md-6 input-block form-group login-form-group">
                      <input
                        maxLength={30}
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                      />
                      <span className="form-icon">
                        <img src="/assets/img/partner/user.svg" alt="icon" />
                      </span>
                      {errors && errors['lastName'] ? (
                        <div className="text-danger">{errors['lastName']}</div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 input-block form-group login-form-group">
                      <input
                        type="text"
                        className="form-control margin-input"
                        placeholder="Email Address"
                        name="email"
                        value={this.state.email}
                        autoComplete="username"
                        onChange={this.handleChange}
                        maxLength={40}
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
                      <OverlayTrigger trigger="focus" placement="bottom" overlay={popoverLeft}>
                        <input
                          type="password"
                          className={
                            'form-control margin-input ' +
                            (this.state.password !== '' && this.state.isError ? 'has-error' : '')
                          }
                          placeholder="Password"
                          name="password"
                          id="signup-password"
                          autoComplete="new-password"
                          value={this.state.password}
                          onChange={(e) => {
                            const password = e.target.value;
                            const isAlphaError = !password.trim().match(/[a-zA-Z]/);
                            const isNumberError = !password.trim().match(/\d/);
                            const isLengthError = password.trim().length < 8;
                            this.setState({
                              password: password,
                              isError: isAlphaError || isNumberError || isLengthError,
                              errorMsg: 'Please select strong password',
                              isAlphaError,
                              isNumberError,
                              isLengthError
                            });
                          }}
                        />
                      </OverlayTrigger>
                      <span className="form-icon">
                        <img src="/assets/img/partner/lock.svg" alt="icon" />
                      </span>
                      {this.state.isSubmitted && this.state.isError ? (
                        <div className="text-danger">{this.state.errorMsg}</div>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className="col-md-12 input-block form-group login-form-group">
                      <input
                        type="password"
                        className="form-control margin-input"
                        placeholder="Confirm Password"
                        name="rePassword"
                        value={this.state.rePassword}
                        autoComplete="new-password"
                        onChange={this.handleChange}
                      />
                      <span className="form-icon">
                        <img src="/assets/img/partner/lock.svg" alt="icon" />
                      </span>
                      {errors && errors['rePassword'] ? (
                        <div className="text-danger">{errors['rePassword']}</div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="pt-2" />
                  <div className="remeber-block-warp justify-content-center">
                    <div className="remeber-block">
                      <div className="btn-login">
                        <button
                          className="btn btn-submit"
                          type="submit"
                          // onClick={this.handleSubmit}
                        >
                          {signUpdata.isSigningUp || loginstatus.loggingIn ? (
                            <i className="fa fa-spinner fa-spin" />
                          ) : (
                            'Join'
                          )}
                        </button>
                      </div>
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
    signUpdata: state.signUpReducer,
    loginstatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (userData, urlToredirect) => {
      dispatch(signup(userData, urlToredirect));
    },
    socialLogin: (userData, urlToredirect) => {
      dispatch(socialLogin(userData, urlToredirect));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);
