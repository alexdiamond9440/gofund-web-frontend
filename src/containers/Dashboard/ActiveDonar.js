import React, { Component } from "react";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import * as moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { toastr } from "react-redux-toastr";
const queryString = require("query-string");
// import { Base_url } from "../../constants";

let user = JSON.parse(localStorage.getItem("user"));

class ActiveDonar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:'',
      projects: [],
      loading: true,
      donationsMade : true,
      donationsRecieve : false,
      pageLimit:10,
      total_estimate_amount: 0
    };
  }
  componentDidMount = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed && parsed.page) {
      this.setState({ currentPage: parsed.page });
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
    this.donationsWillMade();
  };

  donationsWillMade = () => {
    user = JSON.parse(localStorage.getItem("user"));
    const currentPage = 1;
    this.setState({
      currentPage
    });
    if (currentPage !== this.state.currentPage) {
      //  this.props.history.push(`/transactions?page=${currentPage}`);
    }
    axios
    .get(`users/active-donations?userId=${user.userId}`)
    .then(response => {
      let total_estimate_amount = 0;
      let projectData = []
      if (response.data.data.length > 0) {
        for (let i=0; i < response.data.data.length ; i++){
          response.data.data[i].element ? projectData.push(response.data.data[i].element) : projectData.push(response.data.data[i])
        }
      }
      for (let i = 0; i < projectData.length; i++) {
        let item = projectData[i];
        if(item.is_recurring){
          total_estimate_amount = total_estimate_amount + parseFloat(item.amount);
        }
      }
      this.setState({
        total_estimate_amount : total_estimate_amount,
        projects: response.data.data,
        loading: false,
        totalRecords: response.data.data.count,
        donationsMade : true,
        donationsRecieve : false,
      });
    });
}

  donationsWillRecieve = () => {
    user = JSON.parse(localStorage.getItem("user"));
    const { pageLimit } = this.state;
    const currentPage = 1;
    this.setState({
      currentPage
    });
    axios
      .get(
        `/users/active-recieve-donations?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
      )
      .then(response => {
        let total_estimate_amount = 0;
        for (let i = 0; i < response.data.data.length; i++) {
          let item = response.data.data[i];
          total_estimate_amount = total_estimate_amount + parseFloat(item.amount);
        }
        this.setState({
          total_estimate_amount : total_estimate_amount,
          projects: response.data.data,
          totalRecords: response.data.count,
          donationsMade : false,
          donationsRecieve : true,
          loading: false
        });
      });
  };

  // donationsWillMade = () => {
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   if (user) {
  //     axios
  //       .get(`users/active-donations?userId=${user.userId}`)
  //       .then(response => {
  //         this.setState({
  //           projects: response.data.data,
  //           loading: false
  //         });
  //       });
  //   }
  // };

  handleSubscription = (
    projectId,
    userId,
    profile_id,
    userData,
    projectData,
    subscriptionID,
    subscribedBy
  ) => {
    let directDonation = false;
    if (profile_id) {
      directDonation = true;
    }
    const data = {
      projectId: projectId,
      userId: userId,
      directDonation: directDonation,
      profile_id: profile_id,
      subscriptionID,
      subscribedBy,
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You want to unsubscribe the project!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unsubscribe it!"
    })
      .then(result => {
        if (result.value) {
          axios
            .post("/payment/unsubscribe-payment", data)
            .then(resp => {
              toastr.success(
                `Your monthly donation for ${
                  profile_id
                    ? [userData.first_name, userData.last_name].join(" ")
                    : projectData.name
                } has been cancelled successfully`
              );
              this.donationsWillMade();
            })
            .catch(error => {
              toastr.error("Failed to unsubscribe!! Please try again");
            });
        }
      })
      .catch(error => {
        toastr.error("Failed to unsubscribe!! Please try again");
      });
  };

  render() {
    const { projects, loading, donationsMade, donationsRecieve, total_estimate_amount} = this.state;
    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1 activeDonationTitle">
                <span> Monthly Donations </span>
                <span className="estimatedAmount"> {donationsMade ? 'Estimated Payout amount' : 'Estimated Receiving amount' } - <span className="estimatedPrice"> ${total_estimate_amount
                  ? new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(total_estimate_amount)
                  : 0.0} </span></span>
              </div>
              <div className="form-actions form-btn-block text-center">
                <div className="time-category-wrap">
                  <div
                    className={
                      donationsMade === true
                        ? "time-category active-category"
                        : "time-category"
                    }
                    onClick={this.donationsWillMade}
                  >
                    Donations to be Made
                  </div>
                  <div
                    className={
                      donationsRecieve === true
                        ? "time-category active-category"
                        : "time-category"
                    }
                    onClick={this.donationsWillRecieve}
                  >
                    Donations to be Received
                  </div>
                </div>
              </div>

              <div className="project-card">
                {!loading ? (
                  projects.length ? (
                    <>
                      <div className="mobile-view-donation">
                        <div className="row donation-row">
                          {projects.map((item, index) => {
                            const project = item.element ? item.element : item;
                            return (
                              <div className="col-sm-6 col-md-6 donation-col" key={index}>
                                <div className="donation-tile ">
                                <h4 className="word-wrap">
                                        {!project.direct_donation &&
                                        project.Project ? (
                                          <Link
                                            to={`/${project.Project.url}`}
                                            className="product-title-box-projectname capitalize"
                                          >
                                            {project.Project.name}
                                          </Link>
                                        ) : item.profileInfo ? (
                                          <Link
                                            to={`/${item.profileInfo.profileUrl}`}
                                            className="product-title-box-projectname capitalize"
                                          >
                                            <span>
                                              {[
                                                item.profileInfo.first_name,
                                                item.profileInfo.last_name
                                              ].join(" ")}
                                            </span>
                                          </Link>
                                        ) : (
                                          "Profile"
                                        )}
                                      </h4>
                                  <div className="d-flex">
                                    <div className="flex-1">
                                      
                                      {donationsMade ? 
                                        <p className="capitalize"><b>Donation Method: </b>{item.subscribed_by}</p> : null}
                                        {donationsRecieve ? <p className="capitalize"><b>Receiving By: </b>{item.User ? 
                                        <span>
                                          {!item.User.anonymousUser ? [
                                            item.User.first_name,
                                            item.User.last_name
                                          ].join(" ") : "Anonymous"}
                                        </span> 
                                      : null} </p> : null}
                                      <p>
                                        {project.next_donation_date ? (
                                          <b>{donationsMade ? "Next Donation Date: " : "Receiving Date: "}</b>
                                        ) : null}
                                        {project.next_donation_date
                                          ? moment(
                                              project.next_donation_date
                                            ).format("MMM Do YYYY")
                                          : ""}
                                      </p>
                                      <p>
                                        <b>Status: </b>
                                        {project.is_recurring === true ? (
                                          <span
                                            className=" donations_success"
                                            onClick={() =>
                                              this.handleSubscription(
                                                project.project_id,
                                                project.user_id,
                                                project.profile_id,
                                                item.profileInfo,
                                                project.Project,
                                                project.subscription_id,
                                                project.subscribed_by,
                                              )
                                            }
                                          >
                                            Unsubscribe
                                          </span>
                                        ) : (
                                          <span className=" donations_cancel">
                                            Cancelled
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="price">
                                        $
                                        {project.amount
                                          ? new Intl.NumberFormat("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2
                                            }).format(project.amount)
                                          : 0.0}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="dashboard-project-list-wrap transation-table-wrap desktop-view-donation">
                        <div
                          className="common-table-wrap table-responsive-lg"
                          style={{ overflow: "auto" }}
                        >
                          <table className="table-bordered responsive table table-striped table-hover">
                            <thead className="thead_color">
                              <tr>
                                <th className="producttitle text-center">
                                  S.No.
                                </th>
                                <th
                                  className="productimg"
                                  style={{ minWidth: "240px" }}
                                >
                                  Project/People
                                </th>
                                {donationsMade ? <th
                                  className="rised-price"
                                  style={{ minWidth: "150px" }}
                                >
                                  Receiving Method
                                </th> : null}
                                {donationsRecieve ? <th
                                  className="rised-price"
                                  style={{ minWidth: "150px" }}
                                >
                                  Receiving By
                                </th> : null}
                                {donationsMade ?
                                <th
                                  className="rised-price text-center"
                                  style={{ minWidth: "150px" }}
                                >
                                  Next Donation Date
                                </th> : <th
                                  className="rised-price text-center"
                                  style={{ minWidth: "150px" }}
                                >
                                  Receiving Date
                                </th> }
                                <th className="goal-price text-center">
                                  Amount
                                </th>
                                {donationsMade ?
                                <th className="goal-price text-center">
                                  Unsubscribe
                                </th> : null }
                              </tr>
                            </thead>
                            <tbody>
                              {projects.map((item, index) => {
                                const project = item.element
                                  ? item.element
                                  : item;
                                return (
                                  <tr key={index}>
                                    <td className="text-center">
                                      <span>{index + 1}</span>
                                    </td>
                                    <td className="text-left">
                                      <div className="product-title-box capitalize">
                                        {!project.direct_donation &&
                                        project.Project ? (
                                          <Link
                                            to={`/${project.Project.url}`}
                                            className="product-title-box-projectname capitalize"
                                          >
                                            {project.Project.name}
                                          </Link>
                                        ) : item.profileInfo ? (
                                          <Link
                                            to={`/${item.profileInfo.profileUrl}`}
                                            className="product-title-box-projectname capitalize"
                                          >
                                            <span>
                                              {[
                                                item.profileInfo.first_name,
                                                item.profileInfo.last_name
                                              ].join(" ")}
                                            </span>
                                          </Link>
                                        ) : (
                                          "Profile"
                                        )}
                                      </div>
                                    </td>
                                    {donationsMade ? <td className="text-left capitalize">{project.subscribed_by}</td> : null}
                                    {donationsRecieve ? <td className="text-left">
                                      <div className="product-title-box capitalize">
                                            {project.User ? <span>
                                              {!project.User.anonymousUser ? [
                                                project.User.first_name,
                                                project.User.last_name
                                              ].join(" ") : "Anonymous"}
                                            </span> : null}
                                      </div>
                                    </td> : null}
                                    <td className="text-center">
                                      <div className="product-title-box">
                                        {project.next_donation_date ? (
                                          <div className="product-title-tile">
                                            {moment(
                                              project.next_donation_date
                                            ).format("MMM Do YYYY")}
                                            {/* {project.next_donation_date} */}
                                            <br />
                                          </div>
                                        ) : (
                                          "-"
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <div className="doller-text">
                                        $
                                        {project.amount
                                          ? new Intl.NumberFormat("en-US", {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2
                                            }).format(project.amount)
                                          : 0.0}
                                      </div>
                                    </td>
                                    
                                    {donationsMade ? 
                                    <td className="text-center">
                                      {project.is_recurring === true ? (
                                        <div
                                          className="btn btn-xs btn-success"
                                          onClick={() =>
                                            this.handleSubscription(
                                              project.project_id,
                                              project.user_id,
                                              project.profile_id,
                                              item.profileInfo,
                                              project.Project,
                                              project.subscription_id,
                                              project.subscribed_by,
                                            )
                                          }
                                        >
                                          Unsubscribe
                                        </div>
                                      ) : (
                                        <div className="btn btn-xs btn-danger">
                                          Cancelled
                                        </div>
                                      )}
                                    </td> : null }

                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="project-not-found text-center">
                    { donationsMade ? 
                      <h3 className="pb-3">
                        Looks like you haven’t donated to any projects or people
                        yet. 
                      </h3> : 
                        <h3 className="pb-3">
                        No active donations on your account.
                    </h3> }
                      <Link className="btn btn-donate-big" to="/projects">
                        Explore Projects & People
                      </Link>
                    </div>
                  )
                ) : (
                  <Loader />
                )}
              </div>
              {/* {totalRecords ? (
                           <div className="d-flex justify-content-center">
                              <Pagination
                                 totalRecords={totalRecords}
                                 currentPage={currentPage}
                                 pageLimit={pageLimit}
                                 pageNeighbours={pageNeighbours}
                                 onPageChanged={this.onPageChanged}
                              />
                           </div>
                        ) : (
                              ""
                           )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveDonar;
