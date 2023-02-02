import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "react-circular-progressbar/dist/styles.css";
import * as moment from "moment";
import Loader from "../../components/Loader";
import Pagination from "../Pagination";
const queryString = require("query-string");

let user = JSON.parse(localStorage.getItem("user"));

class BackedProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
      projects: [],
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1
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
          `/users/donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
        )
        .then(response => {
          this.setState({
            projects: response.data.data.rows,
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
      this.props.history.push(`/transactions?page=${currentPage}`);
    }
    axios
      .get(
        `/users/donation-data?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}`
      )
      .then(response => {
        this.setState({
          projects: response.data.data.rows,
          totalRecords: response.data.data.count,
          loading: false,
          currentPage
        });
      });
  };

  handleChange = key => {
    this.setState({
      key
    });
  };

  render() {
    const {
      projects,
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      pageNeighbours
    } = this.state;
    let count = (currentPage - 1) * 10 + 1;
    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview transation-main-section clearfix">
            <div className="col-md-12">
              <div className="big_label1">Transactions</div>
              {/* <div className="project-card  ">
                <div className="col-sm-12">
                  <Tabs
                    activeKey={this.state.key}
                    onSelect={this.handleChange}
                    id="controlled-tab-example"
                    className="common-tab-wrapper"
                    justify
                  >
                    <Tab
                      eventKey={1}
                      title={
                        <span className="transation-heading-wrap">
                          <i
                            className="fa fa-paper-plane"
                            aria-hidden="true"
                          ></i>
                          <span className="transation-heading">
                            Sent Transactions
                          </span>
                        </span>
                      }
                    >
                      <SentTransactions handleChange={this.handleChange} />
                    </Tab>
                    <Tab
                      eventKey={2}
                      title={
                        <span className="transation-heading-wrap">
                          <i className="fab fa-get-pocket"></i>
                          <span className="transation-heading">
                            Received Transactions
                          </span>
                        </span>
                      }
                    >
                      {" "}
                      <ReceivedTransactions handleChange={this.handleChange} />
                    </Tab>
                    <Tab
                      eventKey={3}
                      title={
                        <span className="transation-heading-wrap">
                          <i className="fa fa-check-circle"></i>
                          <span className="transation-heading">
                            Active Donars
                          </span>
                        </span>
                      }
                    >
                      {" "}
                      <ActiveDonar handleChange={this.handleChange} />
                    </Tab>
                  </Tabs>
                </div>
              </div> */}

              <div className="project-card">
                {!loading ? (
                  projects.length ? (
                    <div className="dashboard-project-list-wrap">
                      <div className="common-table-wrap table-responsive-lg">
                        <table className="table-bordered responsive table table-striped table-hover">
                          <thead className="thead_color">
                            <tr>
                              <th className="producttitle text-center">
                                S.No.
                              </th>
                              <th className="productimg">
                                Project
                              </th>
                              <th className="producttitle text-center ">
                                Transaction Id
                              </th>
                              <th className="goal-price text-center">Amount</th>
                              <th className="rised-price text-center">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">
                                    <span>{count++}</span>
                                  </td>
                                  <td className="text-left">
                                    <div className="product-title-box">
                                      {project.Project
                                        ? project.Project.name
                                        : ""}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <div className="product-title-box">
                                      {project.checkout_id}
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
                                    {moment(project.createdAt).format("LL")}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="project-not-found text-center">
                      <h3 className="pb-3">
                        Looks like you haven’t donated to any projects or people
                        yet.
                      </h3>
                      <Link className="btn btn-donate-big" to="/projects">
                        Explore Projects & People
                      </Link>
                    </div>
                  )
                ) : (
                  <Loader />
                )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackedProject;
