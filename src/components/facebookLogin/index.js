import React, { Component } from "react";

export default class FacebookLogin extends Component {
  componentDidMount() {
    document.addEventListener("FBObjectReady", this.initializeFacebookLogin);
  }

  componentWillUnmount() {
    document.removeEventListener("FBObjectReady", this.initializeFacebookLogin);
  }

  /**
   * Init FB object and check Facebook Login status
   */
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  };

  /**
   * Check login status
   */
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  };

  /**
   * Check login status and call login api is user is not logged in
   */
  facebookLogin = () => {
    if (!this.FB) return;
    this.FB.getLoginStatus(response => {
      if (response.status === "connected") {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, {
          scope: "public_profile,email"
        });
      }
    });
  };

  /**
   * Handle login response
   */
  facebookLoginHandler = response => {
    if (response.status === "connected") {
      this.FB.api(
        "/me",
        {
          fields: ["last_name", "email", "first_name", "picture"]
        },
        userData => {
          // let data = {
          //   ...response,
          //   user: userData,
          // };
          let data = {
            accessToken: response.authResponse.accessToken,
            name: userData.first_name,
            email: userData.email,
            last_name: userData.last_name,
            picture: userData.picture
          };
          this.props.socialLogin(data);
        }
      );
    }
  };

  render() {
    let { children } = this.props;
    return <div onClick={this.facebookLogin}>{children}</div>;
  }
}
