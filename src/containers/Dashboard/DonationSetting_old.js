import React, { Component } from "react";
import { DatePickerInput } from "rc-datepicker";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import { frontUrl } from "../../constants";
import { instance } from "../../helpers/ipInstance";
import { toastr } from "react-redux-toastr";
import { Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { donationValidator } from "../../helpers/donationValidator";
import FullPageLoader from "./FullPageLoader";
import MaskedInput from 'react-maskedinput'
/* import { assertFlowDeclaration } from "babel-types"; */

class DonationSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      routingNumber: "",
      accountNumber: "",
      accHolderFirstName: "",
      accHolderLastName: "",
      addressLine1: "",
      stateName: "",
      cityName: "",
      postalCode: "",
      ssn: "",
      ip: "",
      dateOfBirth: "",
      fileData: Object,
      isSubmitted: false,
      imgError: "",
      isDataLoading: false,
      isMoreInfo: false,
      lgShow: false,
      errMsg: {},
      isError: true,
      isLoadding: false,
      paymentMethod: "stripe"
    };
  }
  componentDidMount() {
    // const datePicker = document.getElementsByClassName(
    //   'react-datepicker-input',
    // )[0];

    // if (datePicker) {
    //   datePicker.childNodes[0].setAttribute("readOnly", true);
    // }
    instance.get("").then(response => {
      this.setState({ ip: response.data.ip });
    });
    const userData = JSON.parse(localStorage.getItem("user"));
    axios
      .get(`/donations/donation-data?userId=${userData.userId}`)
      .then(response => {
        const donationData = response.data.data;

        this.setState({
          routingNumber: donationData.routing_number,
          accountNumber: donationData.account_number,
          ssn: donationData.ssn,
          dateOfBirth: donationData.date_of_birth,
          file: donationData.identity_doc,

          accHolderFirstName: donationData.acc_holder_first_name,
          accHolderLastName: donationData.acc_holder_last_name,
          addressLine1: donationData.address_line_1,
          stateName: donationData.state,
          cityName: donationData.city,
          postalCode: donationData.postal_code
        });
      })
      .catch(err => { });
  }
  handleDobChange = date => {
    this.setState({ dateOfBirth: date });
    date = moment(date).format("MM/DD/YYYY");
  };

  handleChangeTextData = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errMsg: {
        ...this.state.errors,
        [name]: ""
      }
    });
  };

  handleChange = event => {
    const { name, value } = event.target;
    if (isNaN(value)) {
      return;
    }
    this.setState({
      [name]: value,
      errMsg: {
        ...this.state.errors,
        [name]: ""
      }
    });
  };
  handleModelShow = () => {
    this.setState({ isMoreInfo: true, lgShow: true });
  };
  handleModelClose = () => {
    this.setState({ isMoreInfo: false });
  };
  handleSubmit = e => {
    var that = this;
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user"));
    const data = {
      routingNumber: that.state.routingNumber,
      accountNumber: that.state.accountNumber,
      ssn: that.state.ssn,
      date: that.state.dateOfBirth,

      accHolderFirstName: that.state.accHolderFirstName,
      accHolderLastName: that.state.accHolderLastName,
      addressLine1: that.state.addressLine1,
      stateName: that.state.stateName,
      cityName: that.state.cityName,
      postalCode: that.state.postalCode
    };

    // if (that.state.file === '') {
    // 	this.setState({ imgError: 'Please upload your project image' });
    // } else {
    // 	this.setState({ imgError: '' });
    // }

    const valid = donationValidator({ ...data, file: this.state.file });
    if (!valid.formIsValid) {
      this.setState({ errMsg: valid.errors, isLoadding: false });
      return;
    }

    this.setState({
      isSubmitted: true,
      isDataLoading: true
    });
    if (this.state.imgError !== "") {
      this.setState({ isDataLoading: false });
      return;
    }

    axios
      .post("/donations/update_stripe_account", {
        ...data,
        fileData: that.state.fileData,
        userId: userData.userId,
        dateOfBirth: that.state.dateOfBirth,
        ip: that.state.ip
      })
      .then(response => {
        toastr.success("Success", response.data.message);
        this.setState({ isDataLoading: false, isLoadding: false });
      })
      .catch(err => {
        this.setState({ isDataLoading: false, isLoading: false });
        if (!err.response.data.error) {
          toastr.error("Error", err.response.data.message);
        } else {
          toastr.error("Error", err.response.data.error.message);
        }
      });
  };
  setThumb = event => {
    const imgData = event.target.files[0];
    this.setState({ isSubmitted: true });
    let img = new Image();
    img.src = imgData ? URL.createObjectURL(imgData) : "";
    img.onerror = () => {
      this.setState({
        imgError: "You can upload only images of type jpg, jpeg, png, svg"
      });
      return;
    };
    img.onload = () => {
      // if (img.width < 400 || img.height < 250) {
      //   this.setState({
      //     imgError: "Please upload image of atleast 400*250"
      //   });
      //   return;
      // } else {
      this.setState({
        imgError: "",
        isLoadding: true
      });
      const file = new FormData();
      file.append("file", imgData);
      this.setState({ file: "" });
      axios
        .post("/uploads/upload", file)
        .then(response => {
          this.setState({
            file: response.data.data,
            fileData: response.data.fileData,
            isLoadding: false,
            imgError: "",
            errMsg: {
              ...this.state.errors,
              file: ""
            }
          });
        })
        .catch(err => { });
      // }
    };
  };

  handlesetmethod = async e => {
    this.setState({
      paymentMethod: e.target.value
    });
  };
  render() {
    const { file, errMsg, isLoadding, imgError, paymentMethod } = this.state;

    const isAccUpdated = this.props.profileInfo.is_acc_updated;
    const maxDate = new Date(
      moment()
        .subtract(13, "years")
        .format("YYYY-MM-DD")
    );

    return (
      <div className="col-md-10 col-sm-9 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1">GET PAID NOW </div>

              <div>
                <h1>How would you like to get paid?</h1>
                <div className="row">
                  <div className="col-md-6">
                    <div className="radio">
                      <label className="custom-redio">
                        <input
                          type="radio"
                          name="stripe"
                          value="stripe"
                          checked={paymentMethod === "stripe"}
                          onChange={e => this.handlesetmethod(e)}
                        />
                        <div className="radiobtn" />
                        <div className="donationsettingtitle">Direct Deposit</div>
                        <div className="Description">
                          Stripe payout fees is $0.25 USD per payout
                    </div>
                        {/* <a href="">Learn More</a> */}
                      </label>
                    </div>

                  </div>
                  <div className="col-md-6">
                    <div className="radio">
                      <label className="custom-redio">
                        <input
                          type="radio"
                          name="paypal"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={e => this.handlesetmethod(e)}
                        />
                        <div className="radiobtn" />
                        <div className="donationsettingtitle">Paypal</div>
                        <div className="Description">
                          Paypal
                      <span> payout fees is 1% of the amount transferred</span>
                          <span> with a minimum of 0.25 USD and a maximum</span>
                          <span> of $20 USD</span>
                        </div>
                        {/* <a href="">Learn More</a> */}
                      </label>
                    </div>
                  </div>
                </div>



                {paymentMethod === "stripe" ? (
                  <form onSubmit={this.handleSubmit} noValidate>
                    <div className="col-md-12 center-block">
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>
                            Account Holder First Name
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Account Holder First Name"
                              name="accHolderFirstName"
                              onChange={this.handleChangeTextData}
                              value={this.state.accHolderFirstName}
                              maxLength="30"
                              type="text"
                              required
                            />
                          </div>
                          {errMsg && errMsg["accHolderFirstName"] ? (
                            <div className="text-danger">
                              {errMsg["accHolderFirstName"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            Account Holder Last Name
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Account Holder Last Name"
                              name="accHolderLastName"
                              onChange={this.handleChangeTextData}
                              value={this.state.accHolderLastName}
                              maxLength="30"
                              required
                            />
                          </div>
                          {errMsg && errMsg["accHolderLastName"] ? (
                            <div className="text-danger">
                              {errMsg["accHolderLastName"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>
                            Routing Number
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Routing Number"
                              name="routingNumber"
                              onChange={this.handleChange}
                              value={this.state.routingNumber}
                              maxLength="9"
                              required
                            />
                          </div>
                          {errMsg && errMsg["routingNumber"] ? (
                            <div className="text-danger">
                              {errMsg["routingNumber"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            Account Number
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Account Number"
                              name="accountNumber"
                              onChange={this.handleChange}
                              value={this.state.accountNumber}
                              maxLength="17"
                              required
                            />
                          </div>
                          {errMsg && errMsg["accountNumber"] ? (
                            <div className="text-danger">
                              {errMsg["accountNumber"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>
                            Date of Birth
                            <span className="mandatory">*</span>{" "}
                            <OverlayTrigger
                              overlay={
                                <Tooltip id={"id"}>
                                  You must have 13 years of age to use stripe.
                                </Tooltip>
                              }
                              placement="top"
                            >
                              <i className="fas fa-info-circle" />
                            </OverlayTrigger>{" "}
                          </label>
                          <div className="input-group">
                            <div className="input-group-addon">
                              <i className="far fa-calendar-alt" />
                            </div>
                            <div>
                              <DatePickerInput
                                style={{ zIndex: 9 }}
                                className="form-control form-input datepicker"
                                displayFormat="MM-DD-YYYY"
                                maxDate={maxDate}
                                onChange={this.handleDobChange}
                                value={this.state.dateOfBirth}
                                showOnInputClick={true}
                                disabled={isAccUpdated}
                              />
                            </div>
                          </div>
                          {errMsg && errMsg["dateOfBirth"] ? (
                            <div className="text-danger">
                              {errMsg["dateOfBirth"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            SSN
                            <span className="mandatory">*</span>{" "}
                            <OverlayTrigger
                              overlay={
                                <Tooltip id={"id"}>
                                  Your SSN is stored in encrypted form, it is
                                  completely secured and safe.
                                </Tooltip>
                              }
                              placement="top"
                            >
                              <i className="fas fa-info-circle" />
                            </OverlayTrigger>{" "}
                          </label>
                          <div>
                            {/* <input
                              className="form-control"
                              name="ssn"
                              type="text"
                              placeholder="SSN (Complete 9 digits)"
                              maxLength="9"
                              onChange={this.handleChange}
                              value={maskJs('(99) 9999?9', this.state.ssn)}
                              disabled={isAccUpdated}
                              required
                            /> */}
                            <MaskedInput
                              mask="111-11-1111"
                              className="form-control"
                              name="ssn"
                              placeholder="xxx-xx-xxxx"
                              size="9"
                              onChange={this.handleChange}
                              disabled={isAccUpdated}
                              required
                            />
                          </div>
                          {errMsg && errMsg["ssn"] ? (
                            <div className="text-danger">{errMsg["ssn"]}</div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="form-group col-md-6">
                          <label>
                            Complete Address
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Complete Address"
                              name="addressLine1"
                              onChange={this.handleChangeTextData}
                              value={this.state.addressLine1}
                              maxLength="100"
                              required
                            />
                          </div>
                          {errMsg && errMsg["addressLine1"] ? (
                            <div className="text-danger">
                              {errMsg["addressLine1"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                        <div className="form-group col-md-6">
                          <label>
                            City
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="City"
                              name="cityName"
                              onChange={this.handleChangeTextData}
                              value={this.state.cityName}
                              maxLength="30"
                              required
                            />
                          </div>
                          {errMsg && errMsg["cityName"] ? (
                            <div className="text-danger">
                              {errMsg["cityName"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                       
                      </div>

                      <div className="row">
                      <div className="form-group col-md-6">
                          <label>
                            State
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="State"
                              name="stateName"
                              onChange={this.handleChangeTextData}
                              value={this.state.stateName}z
                              maxLength="100"
                              required
                            />
                          </div>
                          {errMsg && errMsg["stateName"] ? (
                            <div className="text-danger">
                              {errMsg["stateName"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                    
                        <div className="form-group col-md-6">
                          <label>
                            Postal Code
                            <span className="mandatory">*</span>
                          </label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="Postal Code"
                              name="postalCode"
                              onChange={this.handleChange}
                              value={this.state.postalCode}
                              maxLength="5"
                              required
                            />
                          </div>
                          {errMsg && errMsg["postalCode"] ? (
                            <div className="text-danger">
                              {errMsg["postalCode"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-12">
                          <label>
                            Government-issued Photo Identification Document (ID)
                            <span className="mandatory">*</span>{" "}
                            <OverlayTrigger
                              overlay={
                                <Tooltip id={"id"}>
                                  <span><p><strong>Requirements for ID verification</strong></p>
                                    <ul>
                                      <li>Acceptable documents <a href="https://stripe.com/docs/connect/identity-verification-api#acceptable-id-types" target="_blank">vary by country</a>, although a passport scan is always acceptable and preferred.</li>
                                      <li>Scans of both the front and back are <a href="https://stripe.com/docs/connect/identity-verification-api#acceptable-id-types" target="_blank">usually required</a> for government-issued IDs and driver’s licenses.</li>
                                      <li>Files need to be JPEGs or PNGs smaller than 5MB. We can’t verify PDFs.</li>
                                      <li>Files should be in color, be rotated with the image right-side up, and have all information clearly legible.</li>
                                    </ul>
                                  </span>
                                </Tooltip>
                              }
                              placement="top"
                            >
                              <i className="fas fa-info-circle" />
                            </OverlayTrigger>{" "}
                          </label>
                          <div className="document-file-wrap">
                            <div className="image-upload-box">
                              <div className="image-upload-preview">
                                <div
                                  className="fileinput fileinput-new"
                                  data-provides="fileinput"
                                >
                                  <div
                                    className="fileinput-preview thumbnail "
                                    data-trigger="fileinput"
                                  >
                                    <div className='status-wrap'>Front end</div>
                                    {isLoadding ? (
                                      <FullPageLoader />
                                    ) : (
                                        <input
                                          className="imgUpload img_up"
                                          name="image"
                                          type="file"
                                          onChange={this.setThumb}
                                          disabled={isAccUpdated}
                                        />
                                      )}
                                    {isLoadding ? (
                                      <img
                                        className="upload-default-image"
                                        id="upload-default-image"
                                        src={file ? `${frontUrl + file}` : ""}
                                        alt=""
                                      />
                                    ) : (
                                        <img
                                          className="upload-default-image"
                                          id="upload-default-image"
                                          src={
                                            file
                                              ? `${frontUrl + file}`
                                              : "/assets/img/upload-image.png"
                                          }
                                          alt=""
                                        />
                                      )}
                                  </div>
                                  <div
                                    className="fileinput-preview thumbnail "
                                    data-trigger="fileinput"
                                  >
                                    <div className='status-wrap'>back end</div>
                                    {isLoadding ? (
                                      <FullPageLoader />
                                    ) : (
                                        <input
                                          className="imgUpload img_up"
                                          name="image"
                                          type="file"
                                          onChange={this.setThumb}
                                          disabled={isAccUpdated}
                                        />
                                      )}
                                    {isLoadding ? (
                                      <img
                                        className="upload-default-image"
                                        id="upload-default-image"
                                        src={file ? `${frontUrl + file}` : ""}
                                        alt=""
                                      />
                                    ) : (
                                        <img
                                          className="upload-default-image"
                                          id="upload-default-image"
                                          src={
                                            file
                                              ? `${frontUrl + file}`
                                              : "/assets/img/upload-image.png"
                                          }
                                          alt=""
                                        />
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="document-info">
                            <div className="document-info-text">
                              <p>
                                You must have an identity document verified with
                                STRIPE. Please be patient. Image may take a
                                minute to upload
                              </p>
                              <span className="upload-main-wrap">
                                <span
                                  className="btn btn-sm btn-round btn-info"
                                  onClick={this.handleModelShow}
                                >
                                  For More Information Click Here
                                </span>
                              </span>
                              <Modal
                                bsSize="large"
                                aria-labelledby="contained-modal-title-lg"
                                show={this.state.isMoreInfo}
                                onHide={this.handleModelClose}
                              >
                                <div className="info-content modal-header">
                                  <button type="button" className="close">
                                    <span
                                      aria-hidden="true"
                                      onClick={this.handleModelClose}
                                    >
                                      x
                                    </span>
                                    <span className="sr-only">Close</span>
                                  </button>
                                  <div>Stripe Image Upload Info</div>
                                </div>
                                <Modal.Body>
                                  <div className="stripe-info">
                                    <h6>Required Verification Information</h6>
                                    <p>
                                      {/* When building a Connect platform using
                                      Custom accounts, you'll need to collect
                                      the required verification information for
                                      each of your accounts, which varies by the
                                      Custom account's country. */}
                                      To create a project, you're required to
                                      provide your location, age, photo ID,
                                      banking information, email, and mailing
                                      address. This information is necessary to
                                      prevent fraud, comply with the law, and —
                                      if your project is successful — to deliver
                                      funds.
                                    </p>
                                    {/* <p>
                                      All accounts in this country eventually
                                      require all of the following fields if
                                      they process enough volume.
                                    </p> */}
                                    {/* <div className="stripe-full-wrap">
                                      <img
                                        src="/assets/img/stripe-connect.png"
                                        alt=""
                                      />
                                    </div> */}
                                  </div>
                                  {/* <div className="stripe-link">
                                    <strong>For more details </strong>
                                    <a href="https://stripe.com/docs/connect/required-verification-information">
                                      https://stripe.com/docs/connect/required-verification-information
                                    </a>
                                  </div> */}
                                </Modal.Body>
                              </Modal>
                              </div>
                              <div className="description-text">
                                <div className="description-heading">
                                 Requirements for ID verification
                                  </div>
                                <ul>
                                  <li>Acceptable documents <a href="https://stripe.com/docs/connect/identity-verification-api#acceptable-id-types" target="_blank">vary by country</a>, although a passport scan is always acceptable and preferred.</li>
                                  <li>Scans of both the front and back are <a href="https://stripe.com/docs/connect/identity-verification-api#acceptable-id-types" target="_blank">usually required</a> for government-issued IDs and driver’s licenses.</li>
                                  <li>Files need to be JPEGs or PNGs smaller than 5MB. We can’t verify PDFs.</li>
                                  <li>Files should be in color, be rotated with the image right-side up, and have all information clearly legible.</li>
                                </ul>
                            </div>
                            </div>
                          
                         
                          </div>
                          {imgError || (errMsg && errMsg["file"]) ? (
                            <div className="text-danger">
                              {imgError || errMsg["file"]}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-actions form-btn-block text-center">
                          {!this.state.isDataLoading ? (
                            <button
                              // onClick={this.handleSubmit}
                              className="btn btn-donate-big"
                              type="submit"
                            >
                              Save
                            </button>
                          ) : (
                              <button className="btn btn-donate-big" disabled>
                                Saving...
                            </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                    <div className="paypal">Feature in developement</div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};

export default connect(mapStateToProps)(DonationSetting);
