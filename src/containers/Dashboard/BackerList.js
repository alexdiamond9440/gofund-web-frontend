import React, { Component } from 'react';
import axios from 'axios';

import 'react-circular-progressbar/dist/styles.css';
import * as moment from 'moment';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
const queryString = require('query-string');

class BackerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1,
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
    const url = this.props.match.params.projectUrl;
    const { currentPage, pageLimit } = this.state;
    axios
      .get(
        `/projects/donation_data?projectUrl=${url}&page=${currentPage}&limit=${pageLimit}`,
      )
      .then(response => {
        this.setState({
          projects: response.data.doantionData.rows,
          totalRecords: response.data.doantionData.count,
          loading: false,
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
      });
  };
  onPageChanged = data => {
    const url = this.props.match.params.projectUrl;
    const { currentPage, pageLimit } = data;
    if (currentPage !== this.state.currentPage) {
      this.props.history.push(
        `/my-sponsor-pages/backer-list/${url}?page=${currentPage}`,
      );
    }
    axios
      .get(
        `/projects/donation_data?projectUrl=${url}&page=${currentPage}&limit=${pageLimit}`,
      )
      .then(response => {
        this.setState({
          projects: response.data.doantionData.rows,
          totalRecords: response.data.doantionData.count,
          loading: false,
          currentPage,
        });
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
    let count = (currentPage - 1) * 10 + 1;

    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1">Donors list</div>
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
                              <th className="productimg">Name</th>
                              <th className="producttitle text-center">
                                Transfer Id
                              </th>
                              <th className="goal-price text-center">Amount</th>
                              <th className="rised-price text-center ">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projects.map((project, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">
                                    <span>{count++}</span>
                                  </td>
                                  <td className="text-center">
                                    <div className="product-title-box">
                                      {project.full_name || 'Anonymous'}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <div className="product-title-box">
                                      {project.transfer_id}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <div className="doller-text">
                                      $
                                      {project.amount
                                        ? new Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          }).format(project.amount)
                                        : 0.0}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    {moment(project.createdAt).format('LL')}
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
                      <h3 className="pb-3">No donor record available.</h3>
                    </div>
                  )
                ) : (
                  <Loader />
                )}
              </div>
              {totalRecords ? (
                <Pagination
                  totalRecords={totalRecords}
                  currentPage={currentPage}
                  pageLimit={pageLimit}
                  pageNeighbours={pageNeighbours}
                  onPageChanged={this.onPageChanged}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackerList;
