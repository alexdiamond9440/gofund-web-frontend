import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Loader from '../../components/Loader';
import { ProxyLogin } from '../../store/actions/ProxyLogin';

class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  componentDidMount = async () => {
    const parsed = queryString.parse(this.props.location.search);
    const authData = {
      token: parsed ? parsed.token : '',
      userId: parsed && parsed.userId ? parseInt(parsed.userId) : null
    };
    localStorage.setItem('user', JSON.stringify(authData));
    axios.defaults.headers.common['Authorization'] = parsed.token;
    await this.props.proxyLogin(authData);
  };

  render() {
    return <Loader />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proxyLogin: (data) => {
      dispatch(ProxyLogin(data));
    }
  };
};

export default connect(undefined, mapDispatchToProps)(VerifyUser);
