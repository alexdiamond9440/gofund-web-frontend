import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { validator } from './../../helpers/validator';

class ChangeEmail extends Component {
  constructor(props) {
    super(props);
      this.state = {
        email:'',
    errMsg: '',
      userId: '',
      isSubmiting: false,
      isDataLoading: false,
    };
  }
  componentDidMount = () => {
    this.setState({ userId: this.props.loginstatus.user.userId });
  };
  handleChange = event => {
      const { name, value } = event.target;
      
    this.setState({
      [name]: value,
      errMsg: {
        ...this.state.errMsg,
        [name]: '',
      },
    });
     
  };
  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isSubmiting: true });
      const { email } = this.state;   
    const data = {
     email,
      userId: this.state.userId,
    };
    
      const valid = validator(data);
     
      if (!valid.formIsValid) {
        this.setState({ errMsg: valid.errors, isLoadding: false });
        return;
      }
  
      
     if (email) {
      this.setState({ isDataLoading: true, isSubmiting: true });
        axios   
        .patch('/users/change-email',{email})
        .then(response => {
          if (response.data.success) {
            this.setState({
              isDataLoading: false,
              isSubmiting: false,
            });
              toastr.success('Success', response.data.message);
              if (response.data.success === true) {
                    //this.props.history.push("/login");
                    localStorage.removeItem("user");
                    window.location.href = "/login"; 
            }
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
      isDataLoading,
        email,
        errMsg,
    } = this.state;
   
    return (
      <div className="col-md-10 col-sm-9 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1"> CHANGE EMAIL</div>
              <form className="">
                <div className="row">
                  <div className="col-sm-8 center-block">
                   
                   
                    <div className="form-group">
                      <label className="control-label">
                        Email
                      </label>
                      <div className="">
                        <input
                          className="form-control"
                          placeholder="Enter Email Address"
                          name="email"
                          value={email}
                          type='email'
                          onChange={this.handleChange}
                          required
                        />
                      {errMsg && errMsg['email'] ? (
                        <div className='text-danger'>{errMsg && errMsg['email']}</div>
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

export default connect(mapStateToProps)(ChangeEmail);
