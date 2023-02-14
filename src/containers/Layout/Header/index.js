/** @format */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav, Navbar, NavDropdown, NavItem, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { logout } from './../../../store/actions/Login';
import { getProfile as getProfileAction } from './../../../store/actions/ProfileInfo';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

const Header = (props) => {
  const { loginState, location, history, getProfile, logoutAction, match } = props;

  const headerReference = useRef(null);
  const buttonReference = useRef(null);
  const [navExpanded, setNavExpanded] = useState(false);

  const handleClick = (e) => {
    if (headerReference.current && headerReference.current.contains(e.target)) {
      // if clicked inside menu do something
    } else {
      // If clicked outside menu, close the navbar.
      setNavExpanded(false);
    }
  };

  const handleStartClick = () => {
    history.push('/start');
  };

  const getProfileInfo = useCallback(() => {
    return loginState.isloggedIn ? getProfile() : '';
  }, [getProfile, loginState.isloggedIn]);

  useEffect(() => {
    ReactGA.initialize('UA-162109096-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    getProfileInfo();
  }, [getProfileInfo]);
  /*
    useEffect(() => {
      getProfileInfo();
    }, [loginState.isloggedIn, getProfileInfo]);
  */
  useEffect(() => {
    document.addEventListener('click', handleClick, false);

    return () => {
      document.removeEventListener('click', handleClick, false);
    };
  }, []);

  useEffect(() => {
    ReactGA.initialize('UA-162109096-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const handleSetNavExpanded = (expanded) => {
    setNavExpanded(expanded);
  };

  const closeNav = () => {
    setNavExpanded(false);
  };

  const logOut = () => {
    logoutAction();
    window.location.href = '/login';
  };

  const { pathname } = location;
  const headerClass = match.url === '/' ? 'transprent-header' : null;
  const isDonationPage = match.path === '/:slug';

  useScrollPosition(({ currPos }) => {
    const button = buttonReference.current;
    const stickyClassName = 'hidden';
    if (!button) {
      return;
    }

    if (currPos.y >= -260 && !button.classList.contains(stickyClassName)) {
      button.classList.add(stickyClassName);
    } else if (currPos.y < -260 && button.classList.contains(stickyClassName)) {
      button.classList.remove(stickyClassName);
    }
  });

  return (
    <header className={`header-wrap ${headerClass}`} ref={headerReference}>
      <Navbar onToggle={handleSetNavExpanded} expanded={navExpanded} onSelect={closeNav}>
        <Navbar.Header>
          <Navbar.Brand>
            <NavLink to="/">
              <img src="/assets/img/gofundher-logo-new.png" alt="gofundher" />
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle />
          {!isDonationPage && (
            <div
              ref={buttonReference}
              className="header-wrap__mobile-cta  hidden hidden-sm hidden-md hidden-lg hidden-xl">
              <button className="btn btn-block" onClick={handleStartClick}>
                <i className="fas fa-heart "></i>&nbsp;&nbsp;Start Now
              </button>
            </div>
          )}
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={0} componentClass="span">
              <NavLink to="/profiles" activeClassName="active">
                Profiles
              </NavLink>
            </NavItem>

            <NavItem eventKey={0} componentClass="span">
              <NavLink to="/search" activeClassName="active">
                Search
              </NavLink>
            </NavItem>
            <NavItem eventKey={1} componentClass="span">
              <NavLink to="/sponsors" activeClassName="active">
                Sponsors
              </NavLink>
            </NavItem>
            <NavItem eventKey={2} componentClass="span">
              <NavLink to="/start" activeClassName="active">
                Start
              </NavLink>
            </NavItem>
            <NavItem eventKey={3} componentClass="span">
              <NavLink to="/shop" activeClassName="active">
                Shop
              </NavLink>
            </NavItem>
            {!loginState.isloggedIn ? (
              <NavItem eventKey={4} componentClass="span">
                <NavLink to="/login" activeClassName="active">
                  Login
                </NavLink>
              </NavItem>
            ) : null}
            {!loginState.isloggedIn ? (
              <NavItem eventKey={5} componentClass="span">
                <NavLink to="/join" activeClassName="active">
                  Join
                </NavLink>
              </NavItem>
            ) : null}
            {loginState.isloggedIn ? (
              <NavDropdown
                eventKey={6}
                title="My Profile"
                id="basic-nav-dropdown"
                className={
                  pathname === '/dashboard' ||
                    pathname === '/my-sponsor-pages' ||
                    pathname === '/get-paid-now' ||
                    pathname === '/my-profile' ||
                    pathname === '/transactions' ||
                    pathname === '/change-password'
                    ? 'active'
                    : ''
                }>
                <MenuItem eventKey={6.1} componentClass="span">
                  <NavLink to="/dashboard" activeClassName="active">
                    Dashboard
                  </NavLink>
                </MenuItem>
                <MenuItem eventKey={6.1} componentClass="span">
                  <NavLink to="/money/received" activeClassName="active">
                    View My Money
                  </NavLink>
                </MenuItem>
                <MenuItem eventKey={6.1} componentClass="span">
                  <NavLink to="/my-sponsor-pages" activeClassName="active">
                    My Sponsor Pages
                  </NavLink>
                </MenuItem>

                <MenuItem eventKey={6.1} componentClass="span">
                  <NavLink to="/get-paid-now" activeClassName="active">
                    <b>Get Paid</b>
                  </NavLink>
                </MenuItem>

                <MenuItem
                  eventKey={6.3}
                  onClick={logOut}
                  componentClass="span"
                  className="logout-link">
                  Logout
                </MenuItem>
              </NavDropdown>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    loginState: state.LoginReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutAction: () => {
      dispatch(logout());
    },
    getProfile: () => {
      dispatch(getProfileAction());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
