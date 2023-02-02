/** @format */

import React from 'react';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import { getProfile } from './../../store/actions/ProfileInfo';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import '../../../node_modules/croppie/croppie.css';
import { ProfileAvatar } from './MyProfile';

const Main = (props) => {
  const createdDate = moment(props.profileInfo.createdAt).format('LL');
  return (
    <div className="col-md-10 col-sm-9 dashboard-right-warp">
      <div className="dashboard-right section-white main-dasboard">
        <div className="user-account-overview clearfix">
          <span className="secur-level">
            Member Since: <em className="level-2">{createdDate}</em>
          </span>
          <div className="user-account-summary">
            <ProfileAvatar userData={props.profileInfo} />
            <div className="user-name">
              {props.profileInfo.first_name} {props.profileInfo.last_name}{' '}
              <TooltipComponent message="Edit Profile">
                <Link to="/my-profile" className="edit-icon">
                  <i className="far fa-edit" />
                </Link>
              </TooltipComponent>
            </div>
            <div className="user-email">{props.profileInfo.email}</div>
          </div>
        </div>
        <div className="row user-account-entries">
          <div className="col-sm-6 user-account-block no-padding-right">
            <Link to="/start">
              <div className="user-account-entry order-entry">
                <h3>Add Sponsor Page</h3>

                <span className="icon address-icon">
                  <img
                    alt=""
                    className="active-img"
                    src="assets/img/icons/addfilepink.svg"
                    width="50px"
                  />
                  <img
                    alt=""
                    className="hover-img"
                    src="assets/img/icons/addfileblack.svg"
                    width="50px"
                  />
                </span>

                {/*  <span className="icon">
                    <img
                      alt=""
                      className="active-img"
                      src="/assets/img/icons/gift-card-gray.svg"
                      width="70px"
                    />
                    <img
                      alt=""
                      className="hover-img"
                      src="/assets/img/icons/project_black.svg"
                      width="70px"
                    />
                  </span> */}
              </div>
            </Link>
          </div>

          <div className="col-sm-6 user-account-block">
            <Link to="/my-sponsor-pages">
              <div className="user-account-entry review-entry">
                <h3>My Sponsor Pages</h3>

                <span className="icon">
                  <img
                    alt=""
                    className="active-img"
                    src="/assets/img/icons/gift-card-pink.svg"
                    width="50px"
                  />
                  <img
                    alt=""
                    className="hover-img"
                    src="/assets/img/icons/project_black.svg"
                    width="50px"
                  />
                </span>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 user-account-block no-padding-right">
            <Link to="/get-paid-now">
              <div className="user-account-entry address-entry">
                <h3>GET PAID</h3>
                <span className="icon">
                  <img
                    alt=""
                    className="active-img"
                    src="/assets/img/icons/address_pink.svg"
                    width="70px"
                  />
                  <img
                    alt=""
                    className="hover-img"
                    src="/assets/img/icons/address_black.svg"
                    width="70px"
                  />
                </span>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 user-account-block">
            <Link to="/money/received">
              <div className="user-account-entry review-entry">
                <h3>Money Collected</h3>
                <span className="icon">
                  <img
                    alt=""
                    className="active-img"
                    src="/assets/img/icons/recieved_pink.svg"
                    width="50px"
                  />
                  <img
                    alt=""
                    className="hover-img"
                    src="/assets/img/icons/recieved_black.svg"
                    width="50px"
                  />
                </span>
              </div>
            </Link>
          </div>

          <div className="col-sm-6 user-account-block">
            <Link to="/my-profile">
              <div className="user-account-entry review-entry">
                <h3>My Profile</h3>

                <span className="icon">
                  <img
                    alt=""
                    className="active-img"
                    src="/assets/img/icons/user_pink.svg"
                    width="50px"
                  />
                  <img
                    alt=""
                    className="hover-img"
                    src="/assets/img/icons/user_black.svg"
                    width="50px"
                  />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => {
      dispatch(getProfile());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
