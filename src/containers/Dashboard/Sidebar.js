/** @format */

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import { connect } from 'react-redux';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      setOpen: false
    };
  }
  componentDidMount = () => {
    const {
      location: { pathname }
    } = this.props;
    if (pathname.includes('/money')) {
      this.setState({
        setOpen: true
      });
    }
  };
  handleMobileToggle = () => {
    const { open } = this.state;
    this.setState({
      open: !open
    });
  };
  handleTransactionState = () => {
    const { setOpen } = this.state;
    this.setState({
      setOpen: !setOpen
    });
  };

  render() {
    const { open, setOpen } = this.state;
    if (!this.props.loginstatus.isloggedIn) {
      this.props.history.push('/login');
    }
    return (
      <>
        <div className="mob-menu-toggle" onClick={this.handleMobileToggle}>
          <span className="mob-menubar">Dashboard Menus</span>
        </div>
        <div className={`col-md-2 col-sm-3 dashboard-left-warp ${open ? 'menu-toggle' : ''}`}>
          <div
            className={`menubar-close ${open ? '' : 'd-none'}`}
            onClick={this.handleMobileToggle}>
            <i className="fas fa-times" />
          </div>
          <div className="dashboard-left">
            <h1>My Account </h1>
            <div>
              <ul className="dashboard-left-nav">
                <li onClick={this.handleMobileToggle}>
                  <NavLink activeClassName="active" aria-current="page" to="/dashboard">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/dashboard_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/dashboard_white.svg"
                        width="50px"
                      />
                    </span>
                    Dashboard
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/my-sponsor-pages" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/project_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/project_white.svg"
                        width="50px"
                      />
                    </span>
                    My Sponsor Pages
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/my-links" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/link_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/link_white.svg"
                        width="50px"
                      />
                    </span>
                    My Links
                  </NavLink>
                </li>
                {/* <li className="">
                  <NavLink to="/transactions" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/project_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/project_white.svg"
                        width="50px"
                      />
                    </span>
                    Transactions
                  </NavLink>
                </li> */}
                {/* dropdown section start */}

                <li
                  className={
                    setOpen === true ? 'slide-active collaps-wrap' : 'slide-deactive collaps-wrap'
                  }>
                  <div onClick={this.handleTransactionState} className="cursor_pointer">
                    <span className="slide-heading">
                      <span className="icon address-icon">
                        <img
                          alt=""
                          className="active-img"
                          src="/assets/img/icons/backed_project_white.svg"
                          width="50px"
                        />
                        <img
                          alt=""
                          className="hover-img"
                          src="/assets/img/icons/backed_project_black.svg"
                          width="50px"
                        />
                      </span>
                      View My Money
                      <i
                        className={
                          setOpen === true
                            ? 'fa fa-angle-up toggle-icon'
                            : 'fa fa-angle-down toggle-icon'
                        }></i>
                    </span>
                  </div>

                  <Collapse in={setOpen}>
                    <div id="collapse">
                      <ul className="dashboard-left-nav dashboard-inner-nav">
                        <li onClick={this.handleMobileToggle}>
                          <NavLink
                            activeClassName="active"
                            aria-current="page"
                            to="/money/received">
                            <span className="icon">
                              <img
                                alt=""
                                className="active-img"
                                src="/assets/img/icons/recieved_black.svg"
                                width="50px"
                              />
                              <img
                                alt=""
                                className="hover-img"
                                src="/assets/img/icons/recieved_white.svg"
                                width="50px"
                              />
                            </span>{' '}
                            Money In
                          </NavLink>
                        </li>
                        <li onClick={this.handleMobileToggle}>
                          <NavLink activeClassName="active" aria-current="page" to="/money/sent">
                            <span className="icon">
                              <img
                                alt=""
                                className="active-img"
                                src="/assets/img/icons/sent_black.svg"
                                width="50px"
                              />
                              <img
                                alt=""
                                className="hover-img"
                                src="/assets/img/icons/sent_white.svg"
                                width="50px"
                              />
                            </span>
                            Money Out
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                  </Collapse>
                </li>
                {/* drop down section end */}
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/my-profile" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/user_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/user_white.svg"
                        width="50px"
                      />
                    </span>
                    My Profile
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/get-paid-now" activeClassName="active">
                    <span className="icon address-icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/address_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/address_white.svg"
                        width="50px"
                      />
                    </span>
                    Get Paid
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/change-password" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/lock_black.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/lock_white.svg"
                        width="50px"
                      />
                    </span>
                    Change Password
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/change-email" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/emailBlack.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/emailWhite.svg"
                        width="50px"
                      />
                    </span>
                    Change Email
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/coaching" activeClassName="active">
                    <span className="icon">
                      <i className="fas fa-chalkboard-teacher"></i>
                    </span>
                    Dream Session
                  </NavLink>
                </li>
                <li onClick={this.handleMobileToggle}>
                  <NavLink to="/delete-account" activeClassName="active">
                    <span className="icon">
                      <img
                        alt=""
                        className="active-img"
                        src="/assets/img/icons/trash.svg"
                        width="50px"
                      />
                      <img
                        alt=""
                        className="hover-img"
                        src="/assets/img/icons/trash-white.svg"
                        width="50px"
                      />
                    </span>
                    Delete Account
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          {/* </ClickOutside> */}
          {/*   </OutsideClickHandler> */}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const loginstatus = state.LoginReducer;
  return {
    loginstatus
  };
};

export default connect(mapStateToProps)(Sidebar);
