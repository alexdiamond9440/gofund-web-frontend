import React, { Component } from "react";
import { Link } from "react-router-dom";
import { validator } from "./../../helpers/validator";
import axios from "axios";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: "",
      isDataLoading: false,
    };
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: "",
      },
    });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: this.state.email,
    };
    const result = validator(data);
    this.setState({ isDataLoading: true });
    if (result.formIsValid) {
      axios
        .post("/users/forgot-password", data)
        .then((response) => {
          if (response.data.success === true) {
            this.setState({ isDataLoading: false, email: "" });
            toastr.success("Success", response.data.message);
          }
        })
        .catch((err) => {
          if (err.response) {
            this.setState({ isDataLoading: false });
            toastr.error("Error", err.response.data.message);
          }
        });
    } else {
      this.setState({
        errors: result.errors,
        isDataLoading: false,
      });
      return;
    }
  };
  render() {
    if (this.props.loginstatus.isloggedIn) {
      this.props.history.push("/my-sponsor-pages");
    }
    const { errors } = this.state;
    return (
      <div>
        <div className="auth-warp d-flex align-items-center justify-content-center">
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
                    <div className="heading">Forgot Password</div>
                  </div>
                  <p>
                    Enter your email address and we'll send you a recovery link.
                  </p>
                  <div className="row">
                    <div className="col-md-12 input-block form-group login-form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        placeholder="john@example.com"
                      />
                      <span className="form-icon">
                       <img src="/assets/img/partner/mail.svg" alt="icon" />
                      </span>
                      
                      {errors && errors["email"] ? (
                        <div className="text-danger">{errors["email"]}</div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="pt-2" />
                  <div className="remeber-block-warp">
                    <div className="remeber-block">
                      {!this.state.isDataLoading ? (
                        <div className="btn-login">
                          <button
                            className="btn btn-submit"
                            type="submit"
                            onClick={this.handleSubmit}
                          >
                            Submit
                          </button>
                        </div>
                      ) : (
                        <div className="btn-login">
                          <button className="btn btn-submit" disabled>
                            Submiting...
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="qustion-mark">
                        If you have remember?
                      </span>{" "}
                      <Link className="forgot-link" to="/login">
                        Login
                      </Link>
                    </div>
                  </div>
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
    loginstatus,
  };
};

export default connect(mapStateToProps)(ForgotPassword);
