import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Popover, OverlayTrigger } from 'react-bootstrap';

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isError: false,
      isConfPassErr: false,
      userId: '',
      isSubmiting: false,
      isDataLoading: false,
      isBodyError: false,
      isAlphaError: true,
      isNumberError: true,
      isLengthError: true,
    };
  }
  componentDidMount = () => {
    this.setState({ userId: this.props.loginstatus.user.userId });
  };
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: {
        ...this.state.errors,
        [name]: '',
      },
    });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isSubmiting: true });
    const { oldPassword, newPassword, confirmPassword } = this.state;
    const data = {
      oldPassword,
      newPassword,
      userId: this.state.userId,
    };
    if (newPassword !== confirmPassword) {
      this.setState({ isConfPassErr: true, isDataLoading: false });
      return;
    }

    if (oldPassword && newPassword && confirmPassword) {
      this.setState({ isDataLoading: true, isSubmiting: true });
      axios
        .post('/users/change-password', data)
        .then(response => {
          if (response.data.success) {
            this.setState({
              isDataLoading: false,
              isConfPassErr: false,
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
              isSubmiting: false,
            });
            toastr.success('Success', response.data.message);
          }
        })
        .catch(err => {
          if (!err.response.data.error) {
            this.setState({ isDataLoading: false });
            toastr.error('Error', err.response.data.message);
          }
        });
    } else {
      return;
    }
  };
  render() {
    const {
      newPassword,
      oldPassword,
      confirmPassword,
      isSubmiting,
      isSubmitted,
      isError,
      isDataLoading,
      isConfPassErr,
    } = this.state;
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
      <div className="col-md-10 col-sm-9 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1"> CHANGE PASSWORD </div>
              <form className="">
                <div className="row">
                  <div className="col-sm-8 center-block">
                    <div className="form-group">
                      <label className="control-label">
                        Old Password<span className="mandatory">*</span> :
                      </label>
                      <div className="">
                        <input
                          className="form-control"
                          placeholder="Old Password"
                          name="oldPassword"
                          onChange={this.handleChange}
                          type="password"
                          value={oldPassword}
                          required
                        />
                        {!oldPassword && isSubmiting ? (
                          <div className="text-danger">
                            Old Password is required
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label">
                        New Password<span className="mandatory">*</span> :
                      </label>
                      <div className="">
                        <OverlayTrigger
                          trigger="focus"
                          placement="bottom"
                          overlay={popoverLeft}
                        >
                          <input
                            className="form-control"
                            name="newPassword"
                            placeholder="New Password"
                            value={newPassword}
                            type="password"
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
                                isLengthError,
                              });
                            }}
                            required
                          />
                        </OverlayTrigger>
                        {newPassword === '' && isSubmiting ? (
                         <div className="text-danger">
                            New Password is required
                          </div>
                        ) : (
                          ''
                        )}
                        {isSubmitted && isError ? (
                          <div className="text-danger">
                            Please select strong password
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label">
                        Confirm Password<span className="mandatory">*</span> :
                      </label>
                      <div className="">
                        <input
                          className="form-control"
                          placeholder="Confirm Password"
                          name="confirmPassword"
                          value={confirmPassword}
                          type="password"
                          onChange={this.handleChange}
                          required
                        />
                        {confirmPassword === '' && isSubmiting ? (
                         <div className="text-danger">
                            Confirm Password is required
                          </div>
                        ) : (
                          ''
                        )}
                        {isConfPassErr ? (
                          <div className="text-danger">
                            {' '}
                            New Password and Confirm Password does not match
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="">
                        <div className="form-actions form-btn-block text-center">
                          {!isDataLoading ? (
                            <button
                              className="btn btn-donate-big"
                              onClick={this.handleSubmit}
                              type="submit"
                            >
                              Update
                            </button>
                          ) : (
                            <button className="btn btn-donate-big" disabled>
                              Updating...
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
    loginState: state.LoginReducer,
    loginstatus,
  };
};

export default connect(mapStateToProps)(ChangePassword);
