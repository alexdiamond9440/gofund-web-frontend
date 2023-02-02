import React, { Component } from "react";
import { connect } from "react-redux";
import { getProfile } from "./../../store/actions/ProfileInfo";

class Profile extends Component {
  componentDidMount() {
    this.props.getProfile();
  }
  render() {
    return <></>;
  }
}

const mapStateToProps = state => {
  return {
    loginState: state.LoginReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfile: () => {
      dispatch(getProfile());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
