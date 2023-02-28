/** @format */

import React, { Component, useEffect, useReducer, useState } from 'react';
import InputMask from 'react-input-mask';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { StateData } from '../../helpers/state';
import { validator } from './../../helpers/validator';
import { getProfile } from './../../store/actions/ProfileInfo';
import FullPageLoader from './FullPageLoader';
import '../../../node_modules/croppie/croppie.css';
import { regForUrl, usernameRegex, Backend_url } from '../../constants';
import Reward from 'containers/Start/Reward';
import { FaBullseye } from 'react-icons/fa';
import { ImageCropper } from 'components/common/ImageCropper';

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: this.props.profileInfo || {},
      isDataLoading: false,
      webUrlError: false,
      profileUrlError: false,
      profileUrlExist: false,
      show_in_profile_list: false,
      subscribe: FaBullseye
    };
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.profileInfo !== this.props.profileInfo) {
      this.setState({
        userData: this.props.profileInfo || {}
      });
    }
  };

  componentDidMount = () => {
    console.log(this.state.userData);
    if (this.state.profileUrlExist) {
      this.setState({
        profileUrlExist: false
      });
    }
  };

  handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    let result;
    if (type === 'checkbox') {
      result = checked;
    } else {
      result = value;
    }
    this.setState((state) => {
      return {
        userData: {
          ...state.userData,
          [name]: result
        },
        errors: {
          [name]: ''
        }
      };
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { userData } = this.state;

    const result = validator({
      firstName: userData && userData.first_name ? userData.first_name.trim() : '',
      lastName: userData && userData.last_name ? userData.last_name.trim() : '',
      email: userData && userData.email ? userData.email.trim() : '',
      bio: userData && userData.bio ? userData.bio : ''
    });
    let errors = result.errors;
    let isValid = result.formIsValid;
    if (userData.website && !regForUrl.test(userData.website)) {
      isValid = false;
      errors = {
        ...errors,
        website: `Please enter valid website address`
      };
    }
    if (userData.profileUrl && !usernameRegex.test(userData.profileUrl)) {
      isValid = false;
      errors = {
        ...errors,
        profileUrl: `Profile url can only use letters, numbers, underscores, hyphen and periods.`
      };
    }
    await this.setState({
      userData: {
        ...this.state.userData
      },
      errors
    });

    if (isValid) {
      if (!userData.avatar && userData.show_in_profile_list) {
        const { value } = await Swal.fire({
          title: 'Are You Sure?',
          html: "It looks like you haven't uploaded a Profile Picture on your account. Please note if you don't upload a picture your profile will not be listed on the <a href='/profiles'>Profile</a> page for receiving donations. We have to let our fundraisers at see the picture of the person they are donating money to.",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#f485ab',
          confirmButtonText: 'Yes, Update it'
        });
        if (!value) {
          return;
        }
      }
      let is_receive_news = 0;
      if (userData.is_receive_news === true) {
        this.setState({
          userData: { ...userData, is_receive_news: 1 }
        });
        is_receive_news = 1;
      }
      this.setState({ isDataLoading: true });
      axios
        .post('/profile/update-userinfo', {
          ...this.state.userData,
          userId: (userData || {}).id,
          firstName: (userData || {}).first_name,
          lastName: (userData || {}).last_name,
          personalWebsite: (userData || {}).personal_website,
          is_receive_news: is_receive_news
        })
        .then(async (response) => {
          if (response) {
            await this.props.getProfile();
            this.setState({ isDataLoading: false });
            toastr.success('Success', response.data.message);
          }
        })
        .catch((err) => {
          setInterval(() => {
            this.setState({
              isDataLoading: false
            });
          }, 2500);
          if (err.response && err.response.data && err.response.data.profileUrlExist) {
            this.setState({
              profileUrlExist: true
            });
          } else {
            toastr.error('Error', err.response.data.message);
          }
        });
    } else {
      return;
    }
  };
  handleChecked = (event) => {
    this.setState({ showInProfileList: event.target.checked });
  };

  handleSaveRewards = async (tabIndex, tabName, rewards) => {
    const { data } = await axios.post('/profile/update-rewards', {
      rewards
    });

    if (data.success) {
      toastr.success('Success', data.message);
    } else {
      toastr.error('Error', data.message);
    }
  };

  render() {
    const { userData, errors, isDataLoading } = this.state;
    console.log(userData);

    const state = StateData.map((stateItem, index) => {
      return (
        <option key={index} value={stateItem.abbreviation}>
          {stateItem.name}
        </option>
      );
    });

    const rewards = userData?.rewards ? JSON.parse(userData.rewards) : [];
    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1 view_my">
                <span> MY PROFILE </span>
                <Link to={`${userData.profileUrl}`} className="view_my_profile">
                  View my public profile
                </Link>
              </div>
              {userData ? (
                <>
                  <div className="row">
                    <ProfileAvatar userData={userData} />
                    <hr />
                    <div className="col-xs-12 m-t-4">
                      <Reward
                        rewards={rewards}
                        rewardCycle="monthly"
                        handleChange={this.handleSaveRewards}
                        isEditable
                        subHeading="Create monthly rewards for your profile"
                      />
                    </div>
                  </div>
                  <hr />
                  <br />
                  <form className="row">
                    <div className="col-md-10 center-block">
                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field ">
                          <label>
                            First Name<span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              name="first_name"
                              placeholder="First Name"
                              value={userData.first_name}
                              onChange={this.handleChange}
                              maxLength={20}
                              required
                            />
                            <div className="text-danger">{errors && errors.firstName}</div>
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>
                            Last Name<span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              name="last_name"
                              placeholder="Last Name"
                              value={userData.last_name}
                              onChange={this.handleChange}
                              maxLength={25}
                              required
                            />
                            <div className="text-danger">{errors && errors.lastName}</div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Street</label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Street"
                              onChange={this.handleChange}
                              name="street"
                              maxLength={100}
                              value={userData.street}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>City</label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="City"
                              onChange={this.handleChange}
                              value={userData.city}
                              name="city"
                              maxLength={50}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>State</label>
                          <select
                            className="form-control"
                            onChange={this.handleChange}
                            value={userData.state}
                            name="state"
                            required>
                            <option>Select State</option>
                            {state}
                          </select>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Zip</label>
                          <InputMask
                            mask="99999"
                            className="form-control"
                            name="zip"
                            placeholder="XXXXX"
                            onChange={this.handleChange}
                            value={userData.zip}
                            maskChar={null}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Phone</label>
                          <div>
                            <InputMask
                              mask="+1 999-999-9999"
                              className="form-control"
                              name="phone"
                              placeholder="+1 xxx-xxx-xxxx"
                              onChange={this.handleChange}
                              value={userData.phone}
                              maskChar={null}
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>
                            Email<span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              readOnly
                              className="form-control"
                              placeholder="Email"
                              name="email"
                              value={userData.email}
                              disabled
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Facebook</label>
                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.facebook}
                              placeholder="xxxxxxxx"
                              maxLength={100}
                              name="facebook"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Twitter</label>

                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.twitter}
                              maxLength={100}
                              placeholder="xxxxxxxx"
                              name="twitter"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Instagram</label>
                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.instagram}
                              placeholder="xxxxxxxx"
                              maxLength={100}
                              name="instagram"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Linkedin</label>

                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.linkedin}
                              maxLength={100}
                              placeholder="xxxxxxxx"
                              name="linkedin"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Youtube</label>
                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.youtube}
                              placeholder="xxxxxxxx"
                              maxLength={100}
                              name="youtube"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Tiktok</label>

                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.tiktok}
                              maxLength={100}
                              placeholder="xxxxxxxx"
                              name="tiktok"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Whatsapp</label>

                          <div>
                            {/* className={`input-group`} */}
                            {/* <div className="input-group-addon url-addon">
                              www.whatsapp.com/
                            </div> */}
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.whatsapp}
                              maxLength={100}
                              placeholder="xxxxxxxx"
                              name="whatsapp"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Twitch</label>

                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.twitch}
                              maxLength={100}
                              placeholder="xxxxxxxx"
                              name="twitch"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Youtube Video Url</label>
                          <div>
                            <input
                              className="form-control"
                              onChange={this.handleChange}
                              value={userData.youtube_video_link}
                              placeholder="xxxxxxxx"
                              maxLength={100}
                              name="youtube_video_link"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Personal Website</label>
                          <input
                            className="form-control"
                            onChange={this.handleChange}
                            placeholder="https://www.xyz.com"
                            value={userData.personal_website}
                            maxLength={100}
                            name="personal_website"
                            required
                          />
                        </div>
                        <div className="form-group col-md-6 col-sm-6 col-xs-6 profile-field">
                          <label>Profile Url</label>
                          <div>
                            <input
                              type="text"
                              placeholder=""
                              className="form-control input_project_url"
                              name="profileUrl"
                              maxLength={100}
                              onChange={this.handleChange}
                              value={userData.profileUrl}
                            />
                          </div>
                          {errors && errors.profileUrl && (
                            <div className="text-danger">{errors.profileUrl}</div>
                          )}
                          {this.state.profileUrlExist && (
                            <div className="text-danger">This Profile url already exist</div>
                          )}
                        </div>

                        <div className="form-group col-md-12 col-sm-12 col-xs-12 profile-field">
                          <label>
                            Mini Bio (500 characters)
                            <span className="mandatory">*</span>
                          </label>
                          <textarea
                            className="form-control custom-textarea"
                            onChange={this.handleChange}
                            rows={5}
                            cols={50}
                            placeholder="Enter Mini Bio"
                            value={userData.bio}
                            name="bio"
                            maxLength={500}
                          //required
                          />
                          <div className="text-danger">{errors && errors.bio}</div>
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12 profile-field">
                          <div className="package-id">
                            <div className="term-check-wrap">
                              <div className="text-center checkbox-input">
                                <input
                                  className="styled"
                                  type="checkbox"
                                  id={`checkOne`}
                                  onChange={this.handleChange}
                                  name="show_in_profile_list"
                                  checked={userData.show_in_profile_list}
                                />
                                <label htmlFor={`checkOne`}>
                                  I would like to appear on the Profile List page to find more
                                  sponsors.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-12 col-sm-12 col-xs-12 profile-field">
                          <div className="package-id">
                            <div className="term-check-wrap">
                              <div className="text-center checkbox-input">
                                <input
                                  className="styled"
                                  type="checkbox"
                                  id={`checkSubscibe`}
                                  onChange={this.handleChange}
                                  name="is_newsletter_subscribed"
                                  checked={userData.is_newsletter_subscribed}
                                />
                                <label htmlFor={`checkSubscibe`}>
                                  I want to receive news from GoFundHer via email.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-actions form-btn-block text-center">
                          {!isDataLoading && (
                            <button onClick={this.handleSubmit} className="btn btn-donate-big">
                              Update
                            </button>
                          )}
                          {isDataLoading && (
                            <button disabled className="btn btn-donate-big">
                              Updating....
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { user } = state.LoginReducer;
  const { profileInfo } = state.ProfileReducer;
  return {
    user,
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

const initialState = {
  isFileUploaded: false,
  state: false,
  isSubmitted: false,
  imgError: false,
  hasAvatar: false,
  imageUrl: ''
};

const profileAvatarReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AVATAR_URL':
      return {
        ...state,
        imageUrl: action.payload,
        hasAvatar: true,
        imgError: ''
      };
    case 'SET_AVATAR_URL_ERROR':
      return {
        ...state,
        imgError: action.payload
      };
    case 'SET_AVATAR_URL_SUBMITTED':
      return {
        ...state,
        isSubmitted: true,
        imgError: ''
      };
    case 'SET_AVATAR_URL_UPLOADED':
      return {
        ...state,
        isFileUploaded: action.payload,
        imgError: ''
      };
    case 'SET_IS_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export const ProfileAvatar = (props) => {
  const [userData, setUserData] = useState(props.userData);
  const [state, dispatch] = useReducer(profileAvatarReducer, initialState);

  const setThumb = (event) => {
    const file = event.target.files[0];
    dispatch({ type: 'SET_AVATAR_URL_SUBMITTED' });

    const img = new Image();
    img.src = file ? URL.createObjectURL(file) : '';
    if (file) {
      dispatch({ type: 'SET_AVATAR_URL', payload: img.src });
      img.onerror = () => {
        dispatch({
          type: 'SET_AVATAR_URL_ERROR',
          payload: 'You can upload only images of type jpg, jpeg, png, svg'
        });
      };
    }
    img.onload = () => {
      dispatch({ type: 'SET_AVATAR_URL_UPLOADED', payload: true });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        dispatch({ type: 'SET_AVATAR_URL', payload: reader.result });
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    };
  };

  const handleEditProfileAvatar = () => {
    const isSocialLink = userData?.avatar ? userData.avatar.search('https://') : -1;
    const imageUrl = isSocialLink > -1 ? userData.avatar : Backend_url + userData.avatar;

    if (!imageUrl) {
      return;
    }

    dispatch({ type: 'SET_AVATAR_URL_SUBMITTED' });
    const img = new Image();
    img.src = imageUrl;

    dispatch({ type: 'SET_AVATAR_URL', payload: imageUrl });

    img.onerror = () => {
      dispatch({
        type: 'SET_AVATAR_URL_ERROR',
        payload: 'You can upload only images of type jpg, jpeg, png, svg'
      });
    };

    img.onload = () => {
      dispatch({ type: 'SET_AVATAR_URL_UPLOADED', payload: true });
    };
  };

  const handleAvatarCropped = async (file) => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    try {
      const { data: uploadData } = await axios.post('/uploads/upload', file);
      setUserData({
        ...state.userData,
        avatar: uploadData.fileData.data
      });
      dispatch({ type: 'SET_IS_LOADING', payload: false });
      dispatch({ type: 'SET_AVATAR_URL_UPLOADED', payload: false });

      // new
      const postData = {
        file: uploadData.fileData.data,
        userId: userData.id
      };
      const { data: updateProfileData } = await axios.post('/users/profile-photo', postData);

      await props.getProfile?.();
      toastr.success('Success', updateProfileData.message);
      dispatch({ type: 'SET_AVATAR_URL_UPLOADED', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_IS_LOADING', payload: false });
      const errorData = error.response ? error.response.data : error;
      toastr.error('Error', errorData.message);
    }
  };

  const handleCancelCropping = (e) => {
    dispatch({ type: 'SET_AVATAR_URL_UPLOADED', payload: false });
  };

  useEffect(() => {
    const isSocialLink = userData?.avatar ? userData.avatar.search('https://') : -1;

    let tmpUrl = "https://gofundher.com/assets/img/default-user-rect.png";

    if (isSocialLink == -1) {
      if (userData.avatar != null && userData.avatar != "")
        tmpUrl = "https://gofundher.com" + userData.avatar;
    } else
      tmpUrl = userData.avatar;

    console.log(isSocialLink, userData, tmpUrl)

    const imageUrl = tmpUrl;
    dispatch({ type: 'SET_AVATAR_URL', payload: imageUrl });
  }, [userData]);

  return (
    <>
      <div className={'row justify-content-center align-items-center d-flex'}>
        {state.isFileUploaded && (
          <ImageCropper
            imageUrl={state.imageUrl}
            loading={state.isLoading}
            onCropped={handleAvatarCropped}
            onCancel={handleCancelCropping}
          />
        )}
      </div>
      <div className="user-head">
        <div className="profileAvtar" style={{ display: state.isFileUploaded ? 'none' : 'block' }}>
          {state.hasAvatar && (
            <>
              <button
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  borderWidth: 0
                }}
                type="button"
                onClick={handleEditProfileAvatar}>
                <i className="far fa-edit" /> Edit
              </button>
              <img src={state.imageUrl} alt="" />
              <div
                className="profile-inner-img"
                style={{ backgroundImage: `url(${state.imageUrl} )` }}></div>
            </>
          )}
          {!state.hasAvatar && <img alt="" src={'/assets/img/user.svg'} />}

          {state.isLoading && <FullPageLoader />}
          {!state.isLoading && (
            <span className="changeProfile">
              Change Profile
              <input
                type="file"
                onChange={setThumb}
                accept="image/x-png,image/jpeg ,image/jpg, image/png ,image/svg"
              />
            </span>
          )}
        </div>
        {state.imgError && <div className="text-danger text-center">{state.imgError}</div>}
      </div>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
