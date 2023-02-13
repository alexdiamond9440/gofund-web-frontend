/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import queryString from 'query-string';
import { Backend_url } from './../../constants';
import Loader from '../../components/Loader';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import Pagination from './../Pagination';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '';

class MyProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      checked: {},
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 6,
      pageNeighbours: 1,
      category: ''
    };
    // this.getProjects();
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
    const { currentPage, pageLimit } = this.state;
    user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      axios
        .get(`/projects/get_user_project?id=${user.userId}&page=${currentPage}&limit=${pageLimit}`)
        .then((response) => {
          this.setState({
            projects: response.data.data.rows,
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
  confirmBox = (id) => {
    if (id.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete all the sponsor page!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.handleDelete(id);
          /* toastr.success("Your file has been deleted successfully"); */
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this sponsor page!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.handleDelete(id);
          /* toastr.success("Your file has been deleted successfully"); */
        }
      });
    }
  };
  statusConfirmBox = (id, status) => {
    let temp = '';
    // eslint-disable-next-line
    {
      status === 'live' ? (temp = 'live') : (temp = 'draft');
    }

    if (id.length > 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to make all sponsor page ${temp}!`,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.value) {
          this.handleStatus(id, status);
        }
      });
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to make this sponsor page ${temp}!`,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.value) {
          this.handleStatus(id, status);
        }
      });
    }
  };
  componentDidUpdate = () => {
    user = JSON.parse(localStorage.getItem('user'));
  };
  onPageChanged = async ({ currentPage }) => {
    const { pageLimit } = this.state;

    user = JSON.parse(localStorage.getItem('user'));
    if (currentPage !== this.state.currentPage) {
      await this.setState({ loading: true });
      this.props.history.push(`/my-sponsor-pages?page=${currentPage}`);

      axios
        .get(`/projects/get_user_project?id=${user.userId}&page=${currentPage}&limit=${pageLimit}`)
        .then(async (response) => {
          const projects = ((response.data || {}).data || {}).rows;
          const totalRecords = ((response.data || {}).data || {}).count;
          await this.setState({
            currentPage,
            projects,
            totalRecords,
            loading: false
          });
        });
    }
  };
  handleChange = (event, index) => {
    const checked = { ...this.state.checked };
    checked[index] = !this.state.checked[index];
    this.setState({
      checked
    });
  };
  handleInputChange = (e) => {
    let { checked } = this.state;
    const { value } = e.target;
    checked = Object.keys(checked)
      .filter(function (k) {
        return checked[k];
      })
      .map(Number);
    if (value === 'delete') {
      this.confirmBox(checked);
    } else if (value === 'live') {
      this.statusConfirmBox(checked, value);
    } else {
      this.statusConfirmBox(checked, value);
    }
    // axios.delete(`/projects/delete-multiprojects`,)
    //   .then(response => {
    //
    //   });
  };
  toggleAllcheck = (event) => {
    const checked = { ...this.state.checked };
    this.state.projects.forEach(function (project, index) {
      checked[project.id] = event.target.checked;
    });

    this.setState({
      checked
    });
  };
  handleDelete = (id) => {
    const data = {
      projectId: id
    };

    if (id !== '') {
      axios
        .delete('projects/delete-project', { data: data })
        .then((resp) => {
          this.setState({
            checked: {}
          });
          toastr.success('Success', resp.data.message);
          this.getProjects();
        })
        .catch((error) => {
          let errorData = error.response ? error.response.data : error;
          toastr.error('Success', errorData.message);
        });
    } else {
      return;
    }
  };
  handleStatus = (id, status) => {
    let temp = '';

    status === 'live' ? (temp = 'Active') : (temp = 'Inactive');

    if (id !== '') {
      axios
        .put('projects/update_project_status', {
          projectId: id,
          status: status
        })
        .then((resp) => {
          this.setState({
            checked: {}
          });
          if (temp === 'Active') {
            toastr.success('Sponsor Page moved to live successfully');
          } else {
            toastr.success('Sponsor Page moved to draft mode successfully');
          }

          this.getProjects();
        })
        .catch((err) => {
          let errorData = err.response ? err.response.data : err;
          toastr.error('Error', errorData.message);
        });
    } else {
      return;
    }
  };

  render() {
    const { projects, loading, checked, totalRecords, currentPage, pageLimit, pageNeighbours } =
      this.state;

    const checkedData = Object.keys(checked)
      .filter(function (k) {
        return checked[k];
      })
      .map(Number);

    let temp = [];
    (this.state.projects || '').map((k, i) => {
      if (k.id === checkedData[0]) {
        temp = [k];
      }
      return temp;
    });

    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1">My Sponsor Pages</div>
              <div className="select-add-wrap ">
                {projects && projects.length ? (
                  <div className="commonstatus order-select-status">
                    <select
                      className="form-control form-input"
                      onChange={this.handleInputChange}
                      name="category"
                      value={this.state.category}>
                      <option value="">Select</option>
                      <option
                        disabled={checkedData && checkedData.length ? false : true}
                        value="delete">
                        Delete
                      </option>
                      {checkedData.length === 1 ? (
                        temp[0].status === 'draft' ? (
                          <option
                            disabled={checkedData && checkedData.length ? false : true}
                            value="live">
                            Live
                          </option>
                        ) : (
                          <option
                            disabled={checkedData && checkedData.length ? false : true}
                            value="draft">
                            Off
                          </option>
                        )
                      ) : (
                        <>
                          {' '}
                          <option
                            disabled={checkedData && checkedData.length ? false : true}
                            value="live">
                            Live
                          </option>
                          <option
                            disabled={checkedData && checkedData.length ? false : true}
                            value="draft">
                            Off
                          </option>
                        </>
                      )}
                    </select>
                    <div className="add-btn-wrap">
                      <button
                        className="btn btn-donate btn-all-wrap"
                        onClick={() => this.props.history.push('/start')}>
                        Add Sponsor Page
                      </button>
                    </div>
                  </div>
                ) : (
                  ' '
                )}
              </div>
              <div className="project-card">
                {!loading ? (
                  projects.length ? (
                    <div className="dashboard-project-list-wrap">
                      <div className="project-view-wrap">
                        {projects.map((project, index) => {
                          return (
                            <div className="project-view-sub-wrap" key={index}>
                              <div className="project-view-inner-wrap">
                                <div class="project-view-image">
                                  <img src={project.thumbnail_image
                                    ? [Backend_url, project.thumbnail_image].join('').trim()
                                    : '/assets/img/no-image-available.svg'
                                  } />
                                </div>
                                <div className="project-view-block">
                                  <div className="count-wrap">
                                    <div className="count-no">
                                      {(currentPage - 1) * pageLimit + index + 1}
                                    </div>
                                    <div className="package-id">
                                      <div className="term-check-wrap">
                                        <div className="text-center checkbox-input">
                                          <input
                                            className="styled"
                                            type="checkbox"
                                            id={`checkOne_${project.id}`}
                                            onChange={(event) =>
                                              this.handleChange(event, project.id)
                                            }
                                            checked={
                                              typeof checked[project.id] !== 'undefined'
                                                ? checked[project.id]
                                                : false
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="project-view-text-wrap">
                                    <div className="project-view-text">
                                      <div className="project-view-text-sub-wrap">
                                        <div className="product-title-box">
                                          {project.name ? (
                                            <Link
                                              to={`/${project.url}`}
                                              className="product-title-box-projectname capitalize">
                                              {project.name}
                                            </Link>
                                          ) : null}
                                        </div>
                                        <div className="capitalize word-wrap">
                                          {project.punch_line}
                                        </div>
                                        <div className="product-title-tile">
                                          <b>Created Date - </b>
                                          <i className="far fa-calendar-alt" />{' '}
                                          {moment(project.createdAt).format('LL')}
                                          <br />
                                        </div>
                                        <div className="product-title-tile">
                                          <b>Goal - </b>
                                          <span>
                                            {' '}
                                            <b>$</b>
                                            {project.amount
                                              ? Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                              }).format(parseInt(project.amount))
                                              : 0.0}
                                          </span>
                                        </div>
                                        <div className="product-title-tile">
                                          <b>Achieved - </b>
                                          <span>
                                            {' '}
                                            <b>$</b>
                                            {project.total_pledged
                                              ? Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                              }).format(Number(project.total_pledged))
                                              : 0.0}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="project-bottom-wrap">
                                <div className="status">
                                  <TooltipComponent
                                    message={
                                      project.status === 'live'
                                        ? 'Click here to inactive this sponsor page'
                                        : 'Click here to active this sponsor page'
                                    }>
                                    {/* <div
                                          className={`btn btn-xs ${
                                            project.status === "live"
                                              ? "btn-success"
                                              : "btn-danger"
                                          }`}
                                          onClick={() =>
                                            this.statusConfirmBox(
                                              project.id,
                                              project.status === "live"
                                                ? "draft"
                                                : "live"
                                            )
                                          }
                                        >
                                          {project.status === "live"
                                            ? "Active"
                                            : "Inactive"} </div>  */}
                                    <div className="project-toggle">
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          name="toggle"
                                          checked={project.status === 'live' ? true : false}
                                          onChange={() =>
                                            this.statusConfirmBox(
                                              project.id,
                                              project.status === 'live' ? 'draft' : 'live'
                                            )
                                          }
                                        />
                                        <span className="slider round slide-yes-no-wrap">
                                          <span className="yes-field">Live</span>
                                          <span className="no-field">Off</span>
                                        </span>
                                      </label>
                                    </div>
                                  </TooltipComponent>
                                </div>
                                <div className="action-table">
                                  {/* eslint-disable-next-line */}
                                  <Link to={`/edit/${project.url}?tab=updates`} className="btn">
                                    <TooltipComponent message={`Add updates to ${project.name}`}>
                                      <React.Fragment>Add Updates</React.Fragment>
                                    </TooltipComponent>
                                  </Link>

                                  <Link to={`/edit/${project.url}`} className="btn btn-edit">
                                    <TooltipComponent
                                      message={'Click here to edit sponsor page details'}>
                                      {/* <i className='far fa-edit' /> */}
                                      <React.Fragment>Edit</React.Fragment>
                                    </TooltipComponent>
                                  </Link>
                                  <div
                                    className="btn btn-delete"
                                    onClick={() => this.confirmBox(project.id)}>
                                    <TooltipComponent message={'Click here to delete sponsor page'}>
                                      {/* <i
                                            className='far fa-trash-alt'
                                           
                                          /> */}
                                      <React.Fragment>Delete</React.Fragment>
                                    </TooltipComponent>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="project-not-found text-center">
                      <h3 className="pb-3">Looks like you haven't created any sponsor page yet.</h3>
                      <Link className="btn btn-donate-big" to="/start">
                        Add Sponsor Page
                      </Link>
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

export default MyProjects;
