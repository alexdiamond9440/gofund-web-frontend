import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import * as moment from 'moment';
import { toastr } from 'react-redux-toastr';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
const queryString = require('query-string');

let user = JSON.parse(localStorage.getItem('user'));

class SentTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      sendDonationData: [],
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1,
      oneTime: true,
      monthly: false,
      success: false //unsubscribe success status
    };
    this.getProjects();
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed && parsed.page) {
      this.setState({ currentPage: parsed.page });
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
  }

  getProjects = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit } = this.state;
    if (user) {
      axios
        .get(
          `/users/sent-project-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
        )
        .then((response) => {
          const { data } = response.data;
          const { rows, activeDonars } = data;
          let tempData = [];
          let isSubscribed = '';
          if (rows && rows.length) {
            try {
              rows.map((value) => {
                if (activeDonars && activeDonars.length && value.is_recurring && value.Project) {
                  isSubscribed = response.data.data.activeDonars.filter(
                    (item) => item.project_id === value.Project.id
                  );
                  if (isSubscribed && isSubscribed.length) {
                    tempData.push({
                      ...value,
                      isSubscribed: isSubscribed[0].is_recurring,
                      subscribed_by: isSubscribed[0].subscribed_by,
                      subscription_id: isSubscribed[0].subscription_id
                    });
                  }
                } else {
                  tempData.push({ ...value });
                }
                return true;
              });
            } catch (error) {}
          }
          this.setState({
            sendDonationData: tempData,
            totalRecords: response.data.data.count,
            loading: false
          });
        })

        .catch((err) => {
          this.setState({
            loading: false
          });
        });
    }
  };
  componentDidUpdate = () => {
    user = JSON.parse(localStorage.getItem('user'));
  };
  onPageChanged = (data) => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit } = data;
    if (currentPage !== this.state.currentPage) {
      //this.props.history.push(`/transactions?page=${currentPage}`);

      if (this.state.oneTime === true) {
        axios
          .get(
            `/users/sent-project-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
          )
          .then((response) => {
            let tempData = [];
            const { data } = response.data;
            const { rows, activeDonars } = data;
            let isSubscribed = '';
            try {
              if (rows && rows.length) {
                rows.map((value) => {
                  if (activeDonars && activeDonars.length && value.is_recurring && value.Project) {
                    isSubscribed = response.data.data.activeDonars.filter(
                      (item) => item.project_id === value.Project.id
                    );
                    if (isSubscribed && isSubscribed.length) {
                      tempData.push({
                        ...value,
                        isSubscribed: isSubscribed[0].is_recurring,
                        subscribed_by: isSubscribed[0].subscribed_by,
                        subscription_id: isSubscribed[0].subscription_id
                      });
                    }
                  } else {
                    tempData.push({ ...value });
                  }
                  return true;
                });
              }
            } catch (error) {}

            this.setState({
              sendDonationData: tempData,
              totalRecords: response.data.data.count,
              loading: false,
              currentPage
            });
          });
      }
    }
  };

  handleSubscription = (projectId, userId, projectData, subscriptionID, subscribedBy) => {
    let directDonation = false;
    const data = {
      projectId: projectId,
      userId: userId,
      directDonation: directDonation,
      profile_id: '',
      subscriptionID,
      subscribedBy: subscribedBy,
      fundraiserId: projectData.userId
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to unsubscribe the project!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unsubscribe it!'
    })
      .then((result) => {
        if (result.value) {
          axios
            .post('/payment/unsubscribe-payment', data)
            .then((resp) => {
              toastr.success(
                `Your monthly donation for ${projectData.name} has been cancelled successfully`
              );
              this.getProjects();
            })
            .catch((error) => {
              toastr.error('Failed to unsubscribe!! Please try again');
            });
        }
      })
      .catch((error) => {
        toastr.error('Failed to unsubscribe!! Please try again');
      });
  };
  render() {
    const { loading, totalRecords, currentPage, pageLimit, pageNeighbours, sendDonationData } =
      this.state;

    let count = (currentPage - 1) * 10 + 1;

    return (
      <>
        {!loading ? (
          sendDonationData.length ? (
            <>
              <div className="mobile-view-donation ">
                <div className="row donation-row">
                  {sendDonationData.map((item, index) => {
                    // const project = item.element
                    //   ? item.element
                    //   : item;
                    return (
                      <div className="col-sm-6 col-md-6 donation-col" key={index}>
                        <div className="donation-tile ">
                          <h4 className="word-wrap">
                            {!item.direct_donation && item.Project ? (
                              <Link
                                to={`/${item.Project.url}`}
                                className="product-title-box-projectname capitalize">
                                {item.Project.name}
                              </Link>
                            ) : (
                              // :
                              // item.profileInfo ? (
                              //   <Link
                              //     to={`/${item.profileInfo.profileUrl}`}
                              //     className="product-title-box-projectname capitalize"
                              //   >
                              //     <span>
                              //       {[
                              //         item.profileInfo.first_name,
                              //         item.profileInfo.last_name
                              //       ].join(" ")}
                              //     </span>
                              //   </Link>
                              // )
                              '-'
                            )}
                          </h4>
                          <div className="d-flex">
                            <div className="flex-1">
                              <p>
                                <b>Donation ID: </b>
                                {item.donation_id}
                              </p>
                              <p>
                                <span className="mobile_payment">
                                  <b>Payment Date:</b>{' '}
                                  {moment(item.createdAt).format('MMM DD, YYYY')}
                                </span>

                                {/* {this.state.monthly === true ? ( */}
                                <span>
                                  <b>Next Donation Date:</b>
                                  <span>
                                    {item.next_donation_date
                                      ? moment(item.next_donation_date).format('MMM DD, YYYY')
                                      : '-'}
                                  </span>
                                  <br />
                                  {item.next_donation_date &&
                                  moment(item.next_donation_date).isAfter() &&
                                  item.isSubscribed ? (
                                    <TooltipComponent
                                      message="Click here to unsubscribe your next donation"
                                      id={'stripe'}>
                                      <div
                                        className="btn btn-xs btn-success"
                                        style={{ marginTop: '6px' }}
                                        onClick={() =>
                                          this.handleSubscription(
                                            item.Project.id,
                                            item.user_id,
                                            item.Project,
                                            item.subscription_id,
                                            item.subscribed_by
                                          )
                                        }>
                                        Unsubscribe
                                      </div>
                                    </TooltipComponent>
                                  ) : item.next_donation_date && !item.isSubscribed ? (
                                    <div
                                      className="btn btn-xs btn-danger"
                                      style={{ marginTop: '6px' }}>
                                      Cancelled
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </span>
                                {/* : null} */}
                              </p>
                              <p>
                                <span className="mobile_payment">
                                  <b>Payment Type:</b> {!item.is_recurring ? 'One Time' : 'Monthly'}
                                </span>

                                {/* {this.state.monthly === true ? ( */}
                                {/* : null} */}
                              </p>
                              <p>
                                <b>Status: </b>
                                {item.status ? (
                                  <span className=" success">Success</span>
                                ) : (
                                  <span className=" fail">Failed</span>
                                )}
                              </p>
                            </div>
                            <div>
                              <span className="price">
                                $
                                {item.amount
                                  ? new Intl.NumberFormat('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    }).format(item.amount)
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
                <div className="common-table-wrap table-responsive-lg" style={{ overflow: 'auto' }}>
                  <table className="table-bordered responsive table table-striped table-hover">
                    <thead className="thead_color">
                      <tr>
                        <th className="producttitle text-center">S.No.</th>
                        <th className="productimg" style={{ minWidth: '150px' }}>
                          Sponsor Page
                        </th>
                        <th className="producttitle text-center " style={{ minWidth: '95px' }}>
                          Donation Id
                        </th>
                        <th className="goal-price text-center">Amount</th>
                        <th className="rised-price text-center" style={{ minWidth: '110px' }}>
                          Payment Date
                        </th>

                        {/* {this.state.monthly === true ? ( */}
                        <th className="rised-price text-center" style={{ minWidth: '140px' }}>
                          Next donation date
                        </th>
                        <th className="rised-price text-center" style={{ minWidth: '100px' }}>
                          Payment Type
                        </th>
                        <th className="rised-price text-center">Status</th>
                        {/* ) 
                                  : null} */}
                        {/* {this.state.monthly === true ? (
                                    <th className="rised-price text-center">
                                      Unsubscribe
                                    </th>
                                  ) : null} */}
                      </tr>
                    </thead>
                    <tbody>
                      {sendDonationData.map((item, index) => {
                        // const project = item.element
                        //   ? item.element
                        //   : item;
                        return (
                          <tr key={item.id}>
                            <td className="text-center">
                              <span>{count++}</span>
                            </td>
                            <td className="text-left">
                              <div className="product-title-box capitalize">
                                {!item.direct_donation && item.Project ? (
                                  <Link
                                    to={`/${item.Project.url}`}
                                    className="product-title-box-projectname capitalize">
                                    {item.Project.name}
                                  </Link>
                                ) : (
                                  // item.profileInfo ? (
                                  //   <Link
                                  //     to={`/${item.profileInfo.profileUrl}`}
                                  //     className="product-title-box-projectname capitalize"
                                  //   >
                                  //     <span>
                                  //       {[
                                  //         item.profileInfo.first_name,
                                  //         item.profileInfo.last_name
                                  //       ].join(" ")}
                                  //     </span>
                                  //   </Link>
                                  // )
                                  // :
                                  '-'
                                )}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="product-title-box">{item.donation_id}</div>
                            </td>

                            <td className="text-center">
                              <div className="doller-text">
                                $
                                {item.amount
                                  ? new Intl.NumberFormat('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2
                                    }).format(item.amount)
                                  : 0.0}
                              </div>
                            </td>
                            <td className="text-center">
                              {moment(item.createdAt).format('MMM DD, YYYY')}
                            </td>
                            {/* {this.state.monthly === true ? ( */}
                            <td className="text-center">
                              <span>
                                {item.next_donation_date
                                  ? moment(item.next_donation_date).format('MMM DD, YYYY')
                                  : '-'}
                              </span>
                              <br />
                              {item.next_donation_date &&
                              moment(item.next_donation_date).isAfter() &&
                              item.isSubscribed ? (
                                <TooltipComponent
                                  message="Click here to unsubscribe your next donation"
                                  id={'stripe'}>
                                  <div
                                    className="btn btn-xs btn-success"
                                    style={{ marginTop: '6px' }}
                                    onClick={() =>
                                      this.handleSubscription(
                                        item.Project.id,
                                        item.user_id,
                                        item.Project,
                                        item.subscription_id,
                                        item.subscribed_by
                                      )
                                    }>
                                    Unsubscribe
                                  </div>
                                </TooltipComponent>
                              ) : item.next_donation_date && !item.isSubscribed ? (
                                <div className="btn btn-xs btn-danger" style={{ marginTop: '6px' }}>
                                  Cancelled
                                </div>
                              ) : (
                                ''
                              )}
                            </td>
                            <td className="text-center">
                              {!item.is_recurring ? 'One Time' : 'Monthly'}
                            </td>
                            <td className="text-center">
                              {item.status ? (
                                <span className="badge badge-active">Success</span>
                              ) : (
                                <span className="badge badge-fail">Failed</span>
                              )}
                            </td>
                            {/* ) 
                            : null} */}
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
              <h3 className="pb-3">
                Looks like you haven't donated to any sponsor page or people yet.
              </h3>
              <Link className="btn btn-donate-big" to="/search">
                Explore Sponsor Page & People
              </Link>
            </div>
          )
        ) : (
          <Loader />
        )}
        {/* </div> */}
        {totalRecords ? (
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
          ''
        )}
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}
      </>
    );
  }
}

export default withRouter(SentTransactions);
