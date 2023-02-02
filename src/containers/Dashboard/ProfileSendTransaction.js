import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import * as moment from "moment";
import { toastr } from "react-redux-toastr";
import Loader from "../../components/Loader";
import Pagination from "../Pagination";
import Swal from "sweetalert2";
import { withRouter } from "react-router";
import TooltipComponent from "../../components/TooltipComponent/TooltipComponent";
const queryString = require("query-string");

let user = JSON.parse(localStorage.getItem("user"));

class ProfileSentTransactions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			loading: true,
			totalRecords: 0,
			currentPage: 1,
			pageLimit: 10,
			pageNeighbours: 1,
			oneTime: true,
			monthly: false,
			total_estimate_amount: 0,
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
		user = JSON.parse(localStorage.getItem("user"));
		const { currentPage, pageLimit } = this.state;
		if (user) {
			axios
				.get(
					`/users/sent-profile-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
				)
				.then(response => {
					const { data } = response.data
					const { rows, activeDonars } = data
					let tempData = []
					let isSubscribed = ''
					this.setState({ loading: false })
					if (rows && rows.length) {
						try {
							rows.map((value) => {
								if (activeDonars && activeDonars.length && value.element.is_recurring) {
									isSubscribed = response.data.data.activeDonars.filter((item) => item.profile_id === value.element.profile_id)
									if (isSubscribed && isSubscribed.length) {
										tempData.push({ ...value, isSubscribed: isSubscribed[0].is_recurring, subscribed_by: isSubscribed[0].subscribed_by, subscription_id: isSubscribed[0].subscription_id })
									}

								}
								else {
									tempData.push({ ...value })
								}
								return true
							})
						} catch (error) {
						}
						this.setState({
							projects: tempData,
							totalRecords: response.data.data.count.count,

						});
					}

				})


		}
	};
	componentDidUpdate = () => {
		user = JSON.parse(localStorage.getItem("user"));
	};
	onPageChanged = data => {
		user = JSON.parse(localStorage.getItem("user"));
		const { currentPage, pageLimit } = data;
		if (currentPage !== this.state.currentPage) {
			//this.props.history.push(`/transactions?page=${currentPage}`);
		}
		if (this.state.oneTime === true) {
			axios
				.get(
					`/users/sent-profile-donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
				)
				.then(response => {
					const { data } = response.data
					const { rows, activeDonars } = data
					let tempData = []
					let isSubscribed = ''
					if (rows && rows.length) {
						try {
							rows.map((value) => {
								if (activeDonars && activeDonars.length && value.element.is_recurring) {
									isSubscribed = response.data.data.activeDonars.filter((item) => item.profile_id === value.element.profile_id)
									if (isSubscribed && isSubscribed.length) {
										tempData.push({
											...value, isSubscribed: isSubscribed[0].is_recurring,
											subscribed_by: isSubscribed[0].subscribed_by, subscription_id: isSubscribed[0].subscription_id
										})
									}

								}
								else {
									tempData.push({ ...value })
								}
								return true
							})
						} catch (error) {
						}
						this.setState({
							projects: tempData,
							totalRecords: response.data.data.count.count,
							loading: false,
							currentPage
						});
					}

				});
		}
	};

	//   handleOneTime = () => {
	//     user = JSON.parse(localStorage.getItem("user"));
	//     const { pageLimit } = this.state;
	//     const currentPage = 1;
	//     this.setState({
	//       currentPage
	//     });
	//     if (currentPage !== this.state.currentPage) {
	//       //this.props.history.push(`/transactions?page=${currentPage}`);
	//     }
	//     axios
	//       .get(
	//         `/users/sent-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
	//       )
	//       .then(response => {
	//         this.setState({
	//           projects: response.data.data.rows,
	//           totalRecords: response.data.data.count,
	//           monthly: false,
	//           oneTime: true,
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
	//       //this.props.history.push(`/transactions?page=${currentPage}`);
	//     }
	//     axios
	//       .get(
	//         `/users/sent-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
	//       )
	//       .then(response => {
	//         this.setState({
	//           projects: response.data.data.rows,
	//           totalRecords: response.data.data.count,
	//           monthly: true,
	//           oneTime: false,
	//           loading: false
	//         });
	//       });
	//   };
	handleSubscription = (userId, profile_id, userData, subscriptionID,
		subscribedBy) => {
		let directDonation = true;
		const data = {
			userId: userId,
			directDonation: directDonation,
			profile_id: profile_id,
			fundraiserId: userData.id,
			subscriptionID,
			subscribedBy

		};
		Swal.fire({
			title: "Are you sure?",
			text: "You want to unsubscribe this project!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, unsubscribe it!"
		})
			.then(result => {
				if (result.value) {
					axios.post("/payment/unsubscribe-payment", data).then(resp => {
						toastr.success(
							`Your monthly donation for ${profile_id
								? [userData.first_name, userData.last_name].join(" ")
								: ''
							} has been cancelled successfully`
						);
						this.getProjects();
						this.setState({
							success: resp.data.success
						});
					});
				}
			})
			.catch(error => {
				toastr.error("Failed to unsubscribe!! Please try again");
			});
	};
	render() {
		const {
			projects,
			loading,
			totalRecords,
			currentPage,
			pageLimit,
			pageNeighbours,
		} = this.state;
		// const { sendDonationData } = this.props
		let count = (currentPage - 1) * 10 + 1;

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, "0");
		var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
		var yyyy = today.getFullYear();
		today = yyyy + "-" + mm + "-" + dd;
		return (
			<>
				{/* <div className="col-md-12 col-sm-12 dashboard-right-warp"> */}
				{/* <div className="dashboard-right"> */}
				{/* <div className="user-profile-overview clearfix"> */}
				{/* <div className="col-md-12"> */}
				{/* <div className="big_label1">Sent Donations</div> */}

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
					projects.length ? (
						<>
							<div className="mobile-view-donation ">
								<div className="row donation-row">
									{projects.map((item, index) => {
										const project = item.element
											? item.element
											: item;
										return (
											<div className="col-sm-6 col-md-6 donation-col" key={index}>
												<div className="donation-tile ">
													<div className="d-flex">
														<div className="flex-1">
															<h4 >
																{item.profileInfo ?
																	(
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
																	)
																	: (
																		"-"
																	)}
															</h4>
															<p>
																<b>Donation ID: </b>{project.donation_id}
															</p>
															<p>
																<span className="mobile_payment">
																	<b>Payment Date:</b>   {moment(project.createdAt).format(
																		"MMM DD, YYYY"
																	)}
																</span>
																<p>
																	<span className="mobile_payment">
																		<b>Payment Type:</b> {!project.is_recurring ? 'One Time'
																			: "Monthly"}
																	</span>
																</p>
																{/* {this.state.monthly === true ? ( */}

																<span>
																	<b>Next Donation Date:</b>
																	<span>{project.next_donation_date ?
																		moment(
																			project.next_donation_date
																		).format("MMM DD, YYYY")
																		: "-"}</span><br />
																	{project.next_donation_date && moment(project.next_donation_date).isAfter() && item.isSubscribed ?
																		<TooltipComponent
																			message='Click here to unsubscribe your next donation'
																			id={'stripe'}
																		>
																			<div className="btn btn-xs btn-success"
																				style={{ marginTop: "6px" }}
																				onClick={() => this.handleSubscription(
																					item.element.user_id,
																					item.element.profile_id,
																					item.profileInfo,
																					item.subscription_id,
																					item.subscribed_by
																				)

																				}>Unsubscribe</div>
																		</TooltipComponent> : project.next_donation_date && !item.isSubscribed ? <div
																			className="btn btn-xs btn-danger"
																			style={{ marginTop: "6px" }}>Cancelled</div> : ""}
																</span>
																{/* : null} */}
															</p>
															<p>
																<b>Status: </b>{project.status ? (
																	<span className=" success">
																		Success
																	</span>
																) : (
																	<span className=" fail">
																		Failed
																	</span>
																)}
															</p>
														</div>
														<div>
															<span className="price">$
																{project.amount
																	? new Intl.NumberFormat("en-US", {
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2
																	}).format(project.amount)
																	: 0.0}</span>
															{/* {item.amount
																	? new Intl.NumberFormat("en-US", {
																		minimumFractionDigits: 2,
																		maximumFractionDigits: 2
																	}).format(item.amount)
																	: 0.0}</span> */}
														</div>
													</div>
												</div>
											</div>
										)
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
													style={{ minWidth: "150px" }}
												>
													People
												</th>
												<th className="producttitle text-center " style={{ minWidth: "95px" }}>
													Donation Id
												</th>
												<th className="goal-price text-center">
													Amount
												</th>
												<th
													className="rised-price text-center"
													style={{ minWidth: "110px" }}
												>
													Payment Date
												</th>

												{/* {this.state.monthly === true ? ( */}
												<th
													className="rised-price text-center"
													style={{ minWidth: "140px" }}
												>
													Next donation date
												</th>
												<th
													className="rised-price text-center"
													style={{ minWidth: "100px" }}
												>
													Payment Type
												</th>
												<th className="rised-price text-center">
													Status
												</th>
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
											{projects.map((item, index) => {
												const project = item.element
													? item.element
													: item;
												return (
													<tr key={project.id}>
														<td className="text-center">
															<span>{count++}</span>
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
																	"-"
																)}
															</div>
														</td>
														<td className="text-center">
															<div className="product-title-box">
																{project.donation_id}
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


														<td className="text-center">
															{moment(project.createdAt).format(
																"MMM DD, YYYY"
															)}
														</td>


														{/* {this.state.monthly === true ? ( */}
														<td className="text-center">
															<span  >{project.next_donation_date ? moment(
																project.next_donation_date
															).format("MMM DD, YYYY") : "-"}
															</span><br />
															{project.next_donation_date && moment(project.next_donation_date).isAfter() && item.isSubscribed ?
																<TooltipComponent
																	message='Click here to unsubscribe your next donation'
																	id={'stripe'}
																>
																	<div
																		className="btn btn-xs btn-success"
																		style={{ marginTop: "6px" }}
																		onClick={() => this.handleSubscription(
																			item.element.user_id,
																			item.element.profile_id,
																			item.profileInfo,
																			item.subscription_id,
																			item.subscribed_by

																		)}

																	>Unsubscribe</div>
																</TooltipComponent> : item.element.next_donation_date && !item.isSubscribed ? <div className="btn btn-xs btn-danger" style={{ marginTop: "6px" }}>Cancelled</div> : ""}
														</td>
														<td className="text-center">
															{!project.is_recurring ? 'One Time' : "Monthly"}
														</td>
														<td className="text-center">
															{project.status ? (
																<span className="badge badge-active">
																	Success
																</span>
															) : (
																<span className="badge badge-fail">
																	Failed
																</span>
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
								Looks like you haven't donated to any projects or
								people yet.
							</h3>
							<Link className="btn btn-donate-big" to="/search">
								Explore Projects & People
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
					""
				)}
				{/* </div> */}
				{/* </div> */}
				{/* </div> */}
				{/* </div> */}
			</>
		);
	}
}

export default withRouter(ProfileSentTransactions);
