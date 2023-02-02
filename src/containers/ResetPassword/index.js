import React, { Component } from "react";
import { validator } from "../../helpers/validator";
import axios from "axios";
import * as queryString from "query-string";
import { toastr } from "react-redux-toastr";
import { Popover, OverlayTrigger } from "react-bootstrap";
import { connect } from "react-redux";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      newPassword: "",
      confirmPassword: "",
      verifyLink: "",
      userLink: "",
      isUserVerified: false,
      isConfPasswordError: false,
      errorMessage: "",
      passwordError: "",
      isBodyError: false,
      isError: true,
      isAlphaError: true,
      isNumberError: true,
      isLengthError: true,
      isSubmitted: false
    };
  }
  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (this.props.location.search) {
      this.setState(
        { verifyLink: parsed.verifylink, userLink: parsed.user },
        () => {
          this.handleUserVerification();
        }
      );
    }
  };
  handleUserVerification = () => {
    const data = {
      verifyLink: this.state.verifyLink,
      userLink: this.state.userLink
    };
    axios
      .post("/users/verifing-link", data)
      .then(response => {
        if (response.data.success === true) {
          this.setState({
            isUserVerified: true,
            email: response.data.userEmail
          });
        }
      })
      .catch(err => {
        if (err.response.data.auth === false) {
          this.setState({
            isUserVerified: false,
            errorMessage: err.response.data.message
          });
        }
      });
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    const data = {
      email: this.state.email,
      newPassword: this.state.newPassword
    };
    this.setState({ isSubmitted: true });
    if (this.state.isError === true) {
      return;
    }
    const result = validator(data);
    if (this.state.newPassword !== this.state.confirmPassword) {
      return this.setState({ isConfPasswordError: true });
    }
    if (result.formIsValid) {
      axios
        .post("/users/reset-password", data)
        .then(response => {
          if (response.data.success) {
            this.setState({ isBodyError: false });
            toastr.success("Success", response.data.message);
            this.props.history.push("/login");
          }
        })
        .catch(err => {
          if (err.response.data.error) {
            this.setState({
              passwordError: err.response.data.error[0].msg,
              isBodyError: true
            });
          }
        });
    } else {
      this.setState({
        errors: result.errors
      });
      return;
    }
  };
  render() {
    if (this.props.loginstatus.isloggedIn) {
      this.props.history.push("/my-sponsor-pages");
    }
    const popoverLeft = (
      <Popover
        id="popover-basic"
        placement="bottom"
        title="Password Requirements"
        className="password-info"
      >
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
        <div className="auth-warp d-flex align-items-center justify-content-center rest-password-page">
          <div className="auth-block">
            <div className="row m-0 d-flex">
              {/* <div className="col-md-6 auth-image-block d-flex align-items-center justify-content-center">
                <img className="mw-100" src="/assets/img/dobation.svg" alt="" />
              </div> */}
               <div className="col-sm-6 auth-image-block ">
                <div className="login-text">When people help people, change happens</div>
                <div className="login-img-section">
                  <div className="login-img-wrap">
                    <div className="login-img">
                      <img
                        className="mw-100"
                        src="/assets/img/dobation.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-block col-md-6">
                <form className="">
                  <div className="auth-link-block single-block clearfix">
                    <div className="heading">Reset Password</div>
                  </div>
                  <p>Update your password for access your account.</p>
                  {this.state.isUserVerified ? (
                    <div>
                      <div className="row">
                        <div className="col-md-12 input-block form-group login-form-group">
                          <OverlayTrigger
                            trigger="focus"
                            placement="right"
                            overlay={popoverLeft}
                          >
                            <input
                              type="password"
                              className="form-control"
                              name="newPassword"
                              id="password"
                              value={this.state.newPassword}
                              onChange={e => {
                                const newPassword = e.target.value;
                                const isAlphaError = !newPassword
                                  .trim()
                                  .match(/[a-zA-Z]/);
                                const isNumberError = !newPassword
                                  .trim()
                                  .match(/\d/);
                                const isLengthError =
                                  newPassword.trim().length < 8;
                                this.setState({
                                  newPassword: newPassword,
                                  isError:
                                    isAlphaError ||
                                    isNumberError ||
                                    isLengthError,
                                  isAlphaError,
                                  isNumberError,
                                  isLengthError
                                });
                              }}
                              placeholder="New Password"
                            />
                          </OverlayTrigger>
                          <span className="form-icon">
                        <img src="/assets/img/partner/lock.svg" alt="icon" />
                      </span>
                          {this.state.isBodyError ? (
                            <div className="text-danger">
                              {this.state.passwordError}
                            </div>
                          ) : (
                            ""
                          )}
                          {this.state.isSubmitted && this.state.isError ? (
                            <div className="text-danger">
                              Please select strong password
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="col-md-12 input-block form-group login-form-group">
                          <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            id="confirm password"
                            onChange={this.handleChange}
                            value={this.state.confirmPassword}
                            placeholder="Confirm Password"
                          />
                          <span className="form-icon">
                        <img src="/assets/img/partner/lock.svg" alt="icon" />
                      </span>
                          {this.state.isConfPasswordError ? (
                            <div className="text-danger">
                              <p> Confirm Password Does Not Match</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="pt-2" />
                      <div className="remeber-block-warp">
                        <div className="remeber-block">
                          <div className="btn-login align-items-center justify-content-center">
                            <button
                              className="btn btn-submit"
                              type="submit"
                              onClick={this.handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>{this.state.errorMessage}</p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const loginstatus = state.LoginReducer;
  return {
    loginstatus
  };
};

export default connect(mapStateToProps)(ResetPassword);
