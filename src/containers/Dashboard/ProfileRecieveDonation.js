import React, { Component } from "react";
import axios from "axios";
import "react-circular-progressbar/dist/styles.css";
import * as moment from "moment";
import Loader from "../../components/Loader";
import Pagination from "../Pagination";
import { withRouter } from "react-router";
const queryString = require("query-string");

let user = JSON.parse(localStorage.getItem("user"));

class ProfileReceivedTransactions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			donationList: [],
			loading: true,
			totalRecords: 0,
			currentPage: 1,
			pageLimit: 10,
			pageNeighbours: 1,
			oneTime: true,
			monthly: false
		};
	}
	componentDidMount() {
		this.getProjects();
		const parsed = queryString.parse(this.props.location.search);
		if (parsed && parsed.page) {
			this.setState({ currentPage: parsed.page });
		}
		if (isNaN(parsed.page)) {
			this.setState({ currentPage: 1 });
		}
	}
	getProjects = () => {
		user = JSON.parse(localStorage.getItem("user"));
		const { currentPage, pageLimit } = this.state;
		if (user) {
			axios
				.get(
					`/users/receive-profile-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
				)
				.then(response => {
					this.props.getTotalAmount(response.data.totalAmount && response.data.totalAmount.length ? response.data.totalAmount[0].total_amount : 0)
					this.setState({
						donationList: response.data.data.rows,
						totalRecords: response.data.data.count,
						loading: false
					});
				})

				.catch(err => {
					this.setState({
						loading: false
					});
				});
		}
	};
	componentDidUpdate = () => {
		user = JSON.parse(localStorage.getItem("user"));
	};
	onPageChanged = data => {
		user = JSON.parse(localStorage.getItem("user"));
		const { currentPage, pageLimit } = data;
		if (currentPage !== this.state.currentPage) {
			// this.props.history.push(`/transactions?page=${currentPage}`);
		}
		axios
			.get(
				`/users/receive-profile-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
			)
			.then(response => {
				this.props.getTotalAmount(response.data.totalAmount && response.data.totalAmount.length ? response.data.totalAmount[0].total_amount : 0)
				this.setState({
					donationList: response.data.data.rows,
					totalRecords: response.data.data.count,
					loading: false,
					currentPage
				});
			});

		// if (this.state.monthly === true) {
		//   axios
		//     .get(
		//       `/users/receive-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
		//     )
		//     .then(response => {
		//       this.setState({
		//         donationList: response.data.data.rows,
		//         totalRecords: response.data.data.count,
		//         loading: false,
		//         currentPage
		//       });
		//     });
		// }
	};

	//   handleOneTime = () => {
	//     user = JSON.parse(localStorage.getItem("user"));
	//     const { pageLimit } = this.state;
	//     const currentPage = 1;
	//     this.setState({
	//       currentPage
	//     });
	//     if (currentPage !== this.state.currentPage) {
	//       //  this.props.history.push(`/transactions?page=${currentPage}`);
	//     }
	//     axios
	//       .get(
	//         `/users/receive-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
	//       )
	//       .then(response => {
	//         this.setState({
	//           donationList: response.data.data.rows,
	//           totalRecords: response.data.data.count,
	//           oneTime: true,
	//           monthly: false,
	//           loading: false
	//         });
	//       });
	//   };

	//   handleMonthly = () => {
	//     user = JSON.parse(localStorage.getItem("user"));
	//     const { pageLimit } = this.state;
	//     const currentPage = 1;
	//     this.setState({
	//       currentPage
	//     });
	//     if (currentPage !== this.state.currentPage) {
	//       //  this.props.history.push(`/transactions?page=${currentPage}`);
	//     }
	//     axios
	//       .get(
	//         `/users/receive-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
	//       )
	//       .then(response => {
	//         this.setState({
	//           donationList: response.data.data.rows,
	//           totalRecords: response.data.data.count,
	//           monthly: true,
	//           oneTime: false,
	//           loading: false
	//         });
	//       });
	//   };

	render() {
		const {
			donationList,
			loading,
			totalRecords,
			currentPage,
			pageLimit,
			pageNeighbours
		} = this.state;
		let count = (currentPage - 1) * 10 + 1;
		return (
			<>
				{/* <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1">Received Donations</div> */}

				{/* <div className="form-actions form-btn-block text-center">
                    <div className="time-category-wrap">
                      <div
                        className={
                          oneTime === true
                            ? "time-category active-category"
                            : "time-category"
                        }
                        onClick={this.handleOneTime}
                      >
                        OneTime
                      </div>
                      <div
                        className={
                          monthly === true
                            ? "time-category active-category"
                            : "time-category"
                        }
                        onClick={this.handleMonthly}
                      >
                        Monthly
                      </div>
                    </div>
                  </div> */}
				{/* <div className="project-card"> */}
				{!loading ? (
					donationList.length ? (
						<>
							{/* <div className="mobile-view-donation ">
                            <div className="row">
                              <div className="col-sm-6 col-md-6">
                                <div className="donation-tile ">
                                  <div className="d-flex">
                                    <h4 className="flex-1">
                                      HELP REALIZE THE DREAMS OF THESE STUDENTS TO
                                      REALITY
                                  </h4>
                                    <span className="price">$ 16.00</span>
                                  </div>
                                  <div className="d-flex ">
                                    <div className="flex-1">
                                      <b> Donation ID:</b> dsfgdgtrw435
                                  </div>
                                    <div className="text-center">
                                      <span className="badge fail">Failed</span>
                                    </div>
                                  </div>
                                  <p>
                                    <span>
                                      <b>Donated By:</b> John Doe
                                    </span>
                                    <br />
                                    <span>
                                      <b>Payment Date:</b> Aug 29, 2019
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div> */}
							<div className="mobile-view-donation ">
								<div className="row donation-row">
									{donationList.map((item, index) => {
										const donationDetail = item.element
											? item.element
											: item;
										return (
											<div className="col-sm-6 col-md-6 donation-col" key={index}>
												<div className="donation-tile ">
													<div className="d-flex">
														<div className="flex-1">
															{/* <h4 >
																{item.Project
																	? item.Project.name
																	: "Self"}
															</h4> */}
															<p>
																<b>Donation ID: </b>{donationDetail.donation_id}
															</p>
															<p>
																<span className="mobile_payment">
																	<b>Donation By:</b> {donationDetail.full_name && !donationDetail.User.anonymousUser
																		? donationDetail.full_name
																		: "Anonymous"}
																</span>
																<span className="mobile_payment">
																	<b>Payment Date:</b>   {moment(donationDetail.createdAt).format(
																		"MMM DD, YYYY"
																	)}
																</span>
															</p>
															<p>
																<span className="mobile_payment">
																	<b>Payment Type:</b> {!donationDetail.is_recurring ? 'One Time'
																		: "Monthly"}
																</span>
															</p>
															<p>
																<b>Status: </b>{(donationDetail.payment_by === "paypal" ? donationDetail.payout_succeed : donationDetail.status) ? (
																	<span className="success">
																		Success
																	</span>
																) : (
																		<span className="fail">{donationDetail.payment_by === "paypal" ? 'Pending' : 'Failed'}</span>
																	)}
															</p>
														</div>

														<div>
															<span className="price">$
                                          {donationDetail.amount
																	? new Intl.NumberFormat("en-US", {
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2
																	}).format(donationDetail.amount)
																	: 0.0}
															</span>
														</div>


													</div>


												</div>
											</div>
										)
									})}
								</div>
							</div>

							<div className="dashboard-project-list-wrap transation-table-wrap desktop-view-donation">
								<div className="common-table-wrap table-responsive-lg">
									<table className="table-bordered responsive table table-striped table-hover">
										<thead className="thead_color">
											<tr>
												<th className="producttitle text-center">
													S.No.
                                  </th>
												{/* <th className="productimg">
													People
                         </th> */}
												<th className="producttitle text-center ">
													Donation Id
                                  </th>
												<th className="rised-price text-center">
													Donated By
                                  </th>
												<th className="goal-price text-center">
													Amount
                                  </th>
												<th className="rised-price text-center">
													Payment Date
                                  </th>
												<th className="rised-price text-center">
													Payment Type
                                  </th>
												<th className="rised-price text-center">
													Status
                                  </th>
											</tr>
										</thead>
										<tbody>
											{donationList.map((donationDetail, index) => {
												return (
													<tr key={index}>
														<td className="text-center">
															<span>{count++}</span>
														</td>
														{/* <td className="text-left">
															<div className="product-title-box capitalize ">
																{donationDetail.Project
																	? donationDetail.Project.name
																	: "Self"}
															</div>
														</td> */}
														<td className="text-center">
															<div className="product-title-box">
																{donationDetail.donation_id}
															</div>
														</td>
														<td className="text-center">
															<div className="product-title-box">
																{donationDetail.full_name && donationDetail.User && !donationDetail.User.anonymousUser
																	? donationDetail.full_name
																	: "Anonymous"}
															</div>
														</td>
														<td className="text-center">
															<div className="doller-text">
																$
                                          {donationDetail.amount
																	? new Intl.NumberFormat("en-US", {
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2
																	}).format(donationDetail.amount)
																	: 0.0}
															</div>
														</td>
														<td className="text-center">
															{moment(donationDetail.createdAt).format(
																"MMM DD, YYYY"
															)}
														</td>
														<td className="text-center">
															{!donationDetail.is_recurring ? 'One Time' : 'Monthly'}
														</td>
														<td className="text-center">
															{(donationDetail.payment_by === "paypal" ? donationDetail.payout_succeed : donationDetail.status) ? (
																<span className="badge badge-active">
																	Success
																</span>
															) : (
																	<span className="badge badge-fail">
																		{donationDetail.payment_by === "paypal" ? 'Pending' : 'Failed'}
																	</span>
																)}
														</td>
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
									Looks like you haven't received donation yet.
                          </h3>
								{/* <Link className="btn btn-donate-big" to="/projects">
                            Explore Projects & People
                          </Link> */}
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
						""
					)}

				{/* </div>
          </div>
        </div>
      </div> */}
			</>
		);
	}
}

export default withRouter(ProfileReceivedTransactions);
