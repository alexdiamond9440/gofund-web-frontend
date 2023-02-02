import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import moment from 'moment';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import axios from 'axios';
import { regForUrl } from 'constants';
const { REACT_APP_BACKEND_URL } = process.env;

class Reward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadingImage: false,
      rewards: [
        {
          id: 1,
          donate_amount: '',
          delivery_date: '',
          reward_image: '{}',
          reward_cycle: props.rewardCycle ?? 'onetime',
          youtube_link: '',
          reward_title: '',
          reward_description: ''
        }
      ],
      errors: {},
      nextId: 2,
      btn_name: 'Skip',
      rewardsVisibleOnMobile: false
    };
  }
  componentDidMount = () => {
    this.getData();
  };

  componentDidUpdate = (prevProps) => {
    const datePicker = document.getElementsByClassName('react-datepicker-input');
    for (const datePickerItem of datePicker) {
      datePickerItem.childNodes[0].setAttribute('readOnly', true);
    }
    if (this.props.rewards !== prevProps.rewards) {
      this.getData();
    }
  };

  componentWillUnmount = () => {
    this.setState({ errors: {} });
  };

  getData = () => {
    const { rewards, rewardCycle } = this.props;

    if (this.props.rewards) {
      this.setState({
        rewards: rewards,
        nextId: rewards ? rewards.length + 1 : 2
      });
    } else {
      this.setState({
        rewards: [
          {
            id: 1,
            donate_amount: '',
            reward_image: '{}',
            reward_cycle: rewardCycle ?? 'onetime',
            youtube_link: '',
            delivery_date: '',
            reward_title: '',
            reward_description: ''
          }
        ]
      });
    }
  };

  confirmBox = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit the sponsor page!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.value) {
        this.props.handleSubmit();

        if (this.props.toastError) {
          toastr.success('Your sponsor page has been submitted successfully');
        }
        if (!this.props.isEditable && this.props.toastError === 'true') {
          toastr.success('Your sponsor page has been submitted successfully');
        }
      }
    });
  };

  uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      this.setState(() => ({ uploadingImage: true }));
      const response = await axios.post('/uploads/upload', formData);
      const {
        data: { fileData }
      } = response;
      return JSON.stringify({
        id: fileData.id,
        thumbnailImage: fileData.data,
        originalImage: fileData.data
      });
    } catch (error) {
      console.error('Error while uploading image', error);
      return null;
    } finally {
      this.setState(() => ({ uploadingImage: false }));
    }
  };

  handleInputChange = async (index, event) => {
    let { name, value } = event.target;
    const { rewards, errors } = this.state;

    if (name === 'donate_amount') {
      value = value.trim() ? value : '';
      if (!value || isNaN(value)) {
        this.setState(() => ({
          errors: {
            ...errors,
            [index]: { ...errors[index], [name]: 'Reward amount is required' }
          }
        }));
      } else {
        this.setState(() => ({
          errors: { ...errors, [index]: { ...errors[index], [name]: null } }
        }));
      }
    }

    if (name === 'reward_title') {
      value = value.trim() ? value : '';
      if (!value) {
        this.setState(() => ({
          errors: {
            ...errors,
            [index]: { ...errors[index], [name]: 'Reward title is required' }
          }
        }));
      } else {
        this.setState(() => ({
          errors: { ...errors, [index]: { ...errors[index], [name]: null } }
        }));
      }
    }

    if (name === 'youtube_link') {
      const valid = regForUrl.test(String(value)) || !String(value);
      if (!valid) {
        this.setState(() => ({
          errors: {
            ...errors,
            [index]: { ...errors[index], [name]: 'Please enter a valid youtube link' }
          }
        }));
      } else {
        this.setState(() => ({
          errors: { ...errors, [index]: { ...errors[index], [name]: null } }
        }));
      }
    }

    if (name === 'reward_image_file') {
      name = 'reward_image';
      value = await this.uploadImage(event.target.files[0]);
    }

    const list = [].concat(rewards);

    list[index][name] = value;

    this.setState({ rewards: [...list] });
  };

  handleDobChange = (date, index) => {
    const { rewards } = this.state;

    const deliveryDate = moment(date).format('MM/DD/YYYY');

    rewards[index].delivery_date = deliveryDate;

    this.setState({ rewards });
  };

  addReward = () => {
    const { rewardCycle } = this.props;
    this.setState((prevState) => {
      return {
        rewards: [
          ...prevState.rewards,
          {
            id: prevState.nextId,
            donate_amount: '',
            reward_cycle: rewardCycle ?? 'onetime',
            youtube_link: '',
            delivery_date: '',
            reward_image: '{}',
            reward_title: '',
            reward_description: ''
          }
        ],
        nextId: prevState.nextId + 1
      };
    });
  };

  removeReward = (index) => {
    const { rewards } = this.state;
    if (index === 0 && rewards.length === 1) {
      this.setState(
        () => ({
          rewards: []
        }),
        () => {
          this.handelSave();
        }
      );
    } else {
      const list = [].concat(rewards);
      list.splice(index, 1);
      this.setState({ rewards: list });
    }
  };

  handleSkip = () => {
    const { rewards, handleChange } = this.props;
    const { isEditable } = this.props;
    handleChange(isEditable ? 6 : 5, 'Rewards', rewards ? rewards : '');
    if (!isEditable) {
      this.confirmBox();
    }
  };

  hasErrors = () => {
    const { errors } = this.state;
    const errorList = Object.values(errors).reduce((acc, next) => {
      return [...acc, ...Object.values(next).filter((i) => i !== null)];
    }, []);

    return errorList.length > 0;
  };

  handelSave = () => {
    const { rewards } = this.state;
    const { isEditable, handleChange } = this.props;

    if (this.hasErrors()) {
      return;
    }

    handleChange(isEditable ? 6 : 5, 'rewards', rewards);
    if (!isEditable) {
      this.confirmBox();
    }
  };

  handleShowRewardsOnMobile = () => {
    this.setState((state) => ({ rewardsVisibleOnMobile: !state.rewardsVisibleOnMobile }));
  };

  render() {
    const { rewards, errors, uploadingImage, rewardsVisibleOnMobile } = this.state;

    const { loading, isEditable, handleBack, heading, subHeading, rewardCycle } = this.props;

    return (
      <div>
        <div className="rewads-heading text-center">
          {heading && <h2>{heading}</h2>}
          <p>{subHeading ?? 'Create Rewards for your Sponsors'}</p>
        </div>
        {rewards?.length > 0 && (
          <button
            className="visible-xs btn btn-yellow center-block"
            onClick={this.handleShowRewardsOnMobile}>
            {!rewardsVisibleOnMobile ? 'Show' : 'Hide'} Rewards
          </button>
        )}
        <div className={`rewards-points-wrapper ${!rewardsVisibleOnMobile && 'hidden-xs'}`}>
          {rewards?.map((reward, index) => {
            const image = JSON.parse(reward.reward_image)?.thumbnailImage;
            return (
              <div key={index} className="rewards-tile">
                <div className="col-sm-8 center-block">
                  <form className="form-horizontal">
                    <div className="form-group">
                      <label className="col-md-4 control-label">
                        Reward Title
                        <span className="mandatory">*</span> :
                      </label>
                      <div className="col-md-8">
                        <div className="">
                          <input
                            className="form-control form-input"
                            name="reward_title"
                            value={reward.reward_title}
                            onChange={(e) => this.handleInputChange(index, e)}
                            maxLength={200}
                          />
                        </div>
                        {reward.reward_title.trim() === '' && errors[index] ? (
                          <div className="text-danger">Reward title is required</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    {!rewardCycle && (
                      <div className="form-group">
                        <label className="col-md-4 control-label">Reward Type</label>
                        <div className="col-md-8">
                          <div className="">
                            <select
                              className="form-control form-input"
                              name="reward_cycle"
                              value={reward.reward_cycle}
                              onChange={(e) => this.handleInputChange(index, e)}>
                              <option value="onetime">One Time</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="form-group">
                      <label className="col-md-4 control-label">Youtube video link</label>
                      <div className="col-md-8">
                        <div className="">
                          <input
                            placeholder="https://www.youtube.com/watch?v=gleHGzbEvmo"
                            className="form-control form-input"
                            name="youtube_link"
                            value={String(reward.youtube_link ?? '')}
                            onChange={(e) => this.handleInputChange(index, e)}
                          />
                        </div>
                        {errors?.[index]?.youtube_link && (
                          <div className="text-danger">{errors?.[index]?.youtube_link}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-4 control-label">Reward Image :</label>
                      <div className="col-md-8">
                        {uploadingImage && <i className="fa fa-spinner fa-spin" />}
                        {!uploadingImage && reward.reward_image && image && (
                          <img
                            height="50px"
                            src={`${REACT_APP_BACKEND_URL}/${image}`}
                            alt={reward.reward_title}
                          />
                        )}
                        <div className="">
                          <input
                            name="reward_image"
                            type="hidden"
                            defaultValue={reward.reward_image}
                          />
                          <input
                            name="reward_image_file"
                            className="form-control form-input"
                            onChange={(e) => this.handleInputChange(index, e)}
                            type="file"
                          />
                        </div>
                        {reward.reward_image?.trim() === '' && errors[index] ? (
                          <div className="text-danger">Reward image is required</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-4 control-label">
                        Sponsorship amount
                        <span className="mandatory">*</span> :
                      </label>
                      <div className="col-md-8">
                        <div className="input-group">
                          <div className="input-group-addon">
                            <i className="fas fa-dollar-sign" />
                          </div>
                          <input
                            className="form-control form-input input_intend_raise"
                            type="text"
                            name="donate_amount"
                            value={reward.donate_amount}
                            onChange={(e) => this.handleInputChange(index, e)}
                          />
                        </div>
                        {!parseFloat(reward.donate_amount) && errors[index] ? (
                          <div className="text-danger">Donation amount is required</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-4 control-label">
                        Reward Description
                        <span className="mandatory">*</span> :
                      </label>
                      <div className="col-md-8">
                        <textarea
                          className="form-control form-input custom-textarea"
                          rows="5"
                          name="reward_description"
                          value={reward.reward_description}
                          onChange={(e) => this.handleInputChange(index, e)}
                          maxLength={1000}
                        />
                        {reward.reward_description.trim() === '' && errors[index] ? (
                          <div className="text-danger">Reward Description is required</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="fix-right-item">
                  <div className="add-more-reward-wrap ">
                    <OverlayTrigger
                      overlay={<Tooltip id={`tooltip`}>Add Another Reward</Tooltip>}
                      placement="left">
                      <span className="btn_add_reward element_row" onClick={this.addReward}>
                        <i className="fas fa-plus" />
                      </span>
                    </OverlayTrigger>
                  </div>
                  <OverlayTrigger
                    overlay={<Tooltip id={`tooltip`}>Delete an Reward</Tooltip>}
                    placement="left">
                    <span className="remove-reward-fields" onClick={() => this.removeReward(index)}>
                      <i className="far fa-trash-alt" />
                    </span>
                  </OverlayTrigger>
                </div>
              </div>
            );
          })}
          {rewards?.length === 0 && (
            <div className="text-center form-btn-block form-actions">
              <button className="btn btn-donate-big" onClick={this.addReward}>
                New Reward
              </button>
            </div>
          )}
        </div>
        {rewards?.length > 0 && (
          <div
            className={`form-actions form-btn-block text-center tab-bottom-btn reward-btn-block ${
              !rewardsVisibleOnMobile && 'hidden-xs'
            }`}>
            {handleBack && (
              <button
                className="btn btn-back"
                type="submit"
                onClick={() => this.props.handleBack(5)}>
                Back
              </button>
            )}
            {handleBack && (
              <OverlayTrigger
                overlay={<Tooltip id={'id'}>You can skip these step for now.</Tooltip>}
                placement="bottom">
                <button className="btn btn-skip" type="submit" onClick={this.handleSkip}>
                  {isEditable ? 'Skip' : 'Skip & Submit'}
                </button>
              </OverlayTrigger>
            )}
            <button
              disabled={loading || this.hasErrors()}
              className="btn btn-donate-big"
              type="submit"
              onClick={this.handelSave}>
              {loading && <i className="fa fa-spinner fa-spin" />}
              {!loading && isEditable && <>Save & Continue</>}
              {!loading && !isEditable && <>Save & Submit</>}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Reward;
