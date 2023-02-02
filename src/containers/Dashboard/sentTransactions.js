/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import * as moment from 'moment';
import { toastr } from 'react-redux-toastr';
import FileSaver from 'file-saver';
import { ExportToCsv } from 'export-to-csv';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import 'react-dates/initialize';
import { connect } from 'react-redux';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import { INPUT_DATE_FROMAT, DATE_FORMAT } from '../../constants';

const queryString = require('query-string');

let user = JSON.parse(localStorage.getItem('user'));

class SentTransactions extends Component {
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
      totalSentAmount: 0,
      nextMonthEstimation: null,
      success: false, //unsubscribe success status
      donationOn: '',
      donationDuration: 'today',
      donationStatus: '',
      startDate: moment(),
      endDate: moment(),
      focusedInput: '',
      projectId: '',
      userProjets: [],
      isFilterApplied: false,
      isExportLoading: false
    };
  }

  componentDidMount() {
    this.handleQueryParam();
  }

  fetchProject() {
    user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`/users/project-list?userId=${user.userId}`)
        .then((response) => {
          this.setState({
            userProjets: response.data.data
          });
        })
        .catch((err) => {
          console.log(err, 'caught error');
          this.setState({
            loading: false
          });
        });
    }
  }
  handleQueryParam = () => {
    const { oneTime } = this.state;
    const parsed = queryString.parse(this.props.location.search);
    let donationDuration = this.state.donationDuration;
    let donationOn;
    let donationStatus = this.state.donationStatus;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    let page = '';
    let projectId = '';
    if (parsed) {
      if (
        parsed.donationDuration ||
        parsed.donationOn ||
        parsed.donationStatus ||
        parsed.startDate ||
        parsed.endDate
      ) {
        this.setState({ isFilterApplied: true });
      }
      donationDuration = parsed.donationDuration ? parsed.donationDuration : 'allTime';
      page = parsed.page ? parseInt(parsed.page) : 1;
      donationOn = parsed.donationOn ? parsed.donationOn : '';
      donationStatus = parsed.donationStatus ? parsed.donationStatus : '';
      startDate = parsed.startDate
        ? moment(parsed.startDate)
        : moment(this.props.profileInfo.createdAt);
      endDate = parsed.endDate ? moment(parsed.endDate) : moment();
      if (donationDuration !== '') {
        if (donationDuration === 'today') {
          startDate = moment();
          endDate = moment();
        } else if (donationDuration === 'month') {
          startDate = moment().startOf('month');
          endDate = moment().endOf('month');
        } else if (donationDuration === 'week') {
          startDate = moment().startOf('week');
          endDate = moment().endOf('week');
        } else if (donationDuration === 'allTime') {
          startDate = moment(this.props.profileInfo.createdAt);
          endDate = moment();
        }
      }
      this.setState(
        {
          currentPage: page,
          donationOn,
          startDate,
          endDate,
          donationStatus,
          donationDuration,
          projectId
        },
        () => {
          if (oneTime) {
            this.getProjects();
          } else {
            this.handleMonthly();
          }
        }
      );
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleQueryParam();
    }
  };

  getProjects = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit, startDate, endDate, donationOn, donationStatus } = this.state;

    if (user) {
      this.setState({ loading: true });
      let tempStartDate = moment(this.props.profileInfo.createdAt);
      let tempEndDate = moment();
      const from = startDate
        ? moment(startDate).format(DATE_FORMAT)
        : moment(tempStartDate).format(DATE_FORMAT);
      const to = endDate ? moment(endDate).format(DATE_FORMAT) : moment(tempEndDate);
      axios
        .get(
          `/users/sent-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donationOn}&status=${donationStatus}`
        )
        .then((response) => {
          this.setState({
            projects: response.data.data.rows,
            totalRecords: response.data.data.count,
            totalSentAmount: response.data.totalSentAmount,
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

  handleDateChange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
      donationDuration: 'custom'
    });
  };
  handleChange = (event) => {
    let startDate = '';
    let endDate = '';

    const {
      target: { name, value }
    } = event;

    if (name === 'donationOn') {
      this.setState({ donationOn: value });
    }
    if (name === 'donationDuration') {
      this.setState({ donationDuration: value });
      if (value === 'today') {
        startDate = moment();
        endDate = moment();
      } else if (value === 'month') {
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
      } else if (value === 'week') {
        startDate = moment().startOf('week');
        endDate = moment().endOf('week');
      } else if (value === 'last7Days') {
        startDate = moment().subtract(6, 'd');
        endDate = moment();
      } else if (value === 'last30Days') {
        startDate = moment().subtract(29, 'd');
        endDate = moment();
      } else if (value === 'allTime') {
        startDate = moment(this.props.profileInfo.createdAt);
        endDate = moment();
      } else {
        startDate = '';
        endDate = '';
      }

      this.setState({
        startDate,
        endDate
      });
    }
    if (name === 'donationStatus') {
      this.setState({ donationStatus: value });
    }
  };
  handleSearch = () => {
    this.setState({ isFilterApplied: true });
    let data = {};
    const { donationOn, donationStatus, donationDuration, startDate, endDate } = this.state;
    this.setState({
      isFilterApplied: true
    });
    if (donationOn) {
      data.donationOn = donationOn;
    }
    if (donationStatus) {
      data.donationStatus = donationStatus;
    }
    if (donationDuration) {
      data.donationDuration = donationDuration;
    }
    if (startDate) {
      data.startDate = moment(startDate).format(DATE_FORMAT);
    }
    if (endDate) {
      data.endDate = moment(endDate).format(DATE_FORMAT);
    }
    let url = queryString.stringify(data);
    this.props.history.push(`/money/sent?${url}&page=1`);
  };
  handleReset = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed) {
      this.props.history.push('/money/sent');
    } else {
      this.setState({
        donationOn: ''
      });
    }
  };
  onPageChanged = (data) => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit } = data;
    let pathName = this.props.location.pathname;
    let queryParam = queryString.parse(this.props.location.search);

    if (currentPage !== this.state.currentPage) {
      this.props.history.push(
        [pathName, queryString.stringify({ ...queryParam, page: currentPage })].join('?')
      );
    }
    const { endDate, startDate, donationOn, donationStatus } = this.state;
    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    let StartDate = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    let EndDate = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);

    if (this.state.oneTime === true) {
      axios
        .get(
          `/users/sent-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donationOn}&status=${donationStatus}`
        )
        .then((response) => {
          this.setState({
            projects: response.data.data.rows,
            totalRecords: response.data.data.count,
            loading: false,
            totalSentAmount: response.data.totalSentAmount,
            currentPage,
            nextMonthEstimation: response.data.nextMonthEstimation
          });
        });
    }
    if (this.state.monthly === true) {
      axios
        .get(
          `/users/sent-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donationOn}&status=${donationStatus}`
        )
        .then((response) => {
          const { data } = response.data;
          const { rows, activeDonors, totalSentAmount, nextMonthEstimation } = data;
          let tempData = [];
          let isSubscribed = '';
          if (rows && rows.length) {
            try {
              rows.map((value) => {
                if (activeDonors && activeDonors.length) {
                  if (value.element) {
                    isSubscribed = activeDonors.filter(
                      (item) => item.profile_id === value.element.profile_id
                    );
                    if (isSubscribed && isSubscribed.length) {
                      let data = value;
                      data.element.isSubscribed = isSubscribed[0].is_recurring;
                      data.element.subscribedBy = isSubscribed[0].subscribed_by;
                      data.element.subscription_id = isSubscribed[0].subscription_id;
                      tempData.push({ ...data });
                    } else {
                      tempData.push({ ...value });
                    }
                  } else {
                    isSubscribed = response.data.data.activeDonors.filter(
                      (item) => item.project_id === value.project_id
                    );
                    if (isSubscribed && isSubscribed.length) {
                      tempData.push({
                        ...value,
                        isSubscribed: isSubscribed[0].is_recurring,
                        subscribedBy: isSubscribed[0].subscribed_by,
                        subscription_id: isSubscribed[0].subscription_id
                      });
                    } else {
                      tempData.push({ ...value });
                    }
                  }
                } else {
                  tempData.push({ ...value });
                }

                return true;
              });
            } catch (error) {}
          }
          this.setState({
            projects: tempData,
            totalRecords: response.data.data.count,
            loading: false,
            currentPage,
            nextMonthEstimation: nextMonthEstimation.total_amount,
            totalSentAmount: totalSentAmount
          });
        });
    }
  };

  handleOneTime = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { pageLimit, startDate, endDate, donationOn, projectId, donationStatus } = this.state;
    const currentPage = 1;
    this.setState({
      currentPage
    });
    if (currentPage !== this.state.currentPage) {
      //this.props.history.push(`/transactions?page=${currentPage}`);
    }

    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    let StartDate = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    let EndDate = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    axios
      .get(
        `/users/sent-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donationOn}&projectId=${projectId}&status=${donationStatus}`
      )
      .then((response) => {
        this.setState({
          projects: response.data.data.rows,
          totalRecords: response.data.data.count,
          totalSentAmount: response.data.totalSentAmount,
          monthly: false,
          oneTime: true,
          loading: false
        });
      });
  };

  handleMonthly = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { pageLimit, startDate, endDate, donationOn, donationStatus } = this.state;
    const currentPage = 1;
    this.setState({
      currentPage
    });
    if (currentPage !== this.state.currentPage) {
      //this.props.history.push(`/transactions?page=${currentPage}`);
    }
    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    let from = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    let to = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    axios
      .get(
        `/users/sent-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donationOn}&status=${donationStatus}`
      )
      .then((response) => {
        const { data } = response.data;
        const { rows, activeDonors, nextMonthEstimation, totalSentAmount } = data;
        let tempData = [];
        let isSubscribed = '';
        if (rows && rows.length) {
          try {
            rows.map((value, index) => {
              if (activeDonors && activeDonors.length) {
                if (value.element) {
                  isSubscribed = activeDonors.filter(
                    (item) => item.profile_id === value.element.profile_id
                  );
                  if (isSubscribed && isSubscribed.length) {
                    let data = value;
                    data.element.isSubscribed = isSubscribed[0].is_recurring;
                    data.element.subscribedBy = isSubscribed[0].subscribed_by;
                    data.element.subscription_id = isSubscribed[0].subscription_id;
                    tempData.push({ ...data });
                  } else {
                    tempData.push({ ...value });
                  }
                } else {
                  isSubscribed = activeDonors.filter(
                    (item) => item.project_id === value.project_id
                  );
                  if (isSubscribed && isSubscribed.length) {
                    tempData.push({
                      ...value,
                      isSubscribed: isSubscribed[0].is_recurring,
                      subscribedBy: isSubscribed[0].subscribed_by,
                      subscription_id: isSubscribed[0].subscription_id
                    });
                  } else {
                    tempData.push({ ...value });
                  }
                }
              } else {
                tempData.push({ ...value });
              }
              return true;
            });
          } catch (error) {}
        }

        this.setState({
          projects: tempData,
          totalRecords: response.data.data.count,
          monthly: true,
          oneTime: false,
          loading: false,
          nextMonthEstimation: nextMonthEstimation.total_amount,
          totalSentAmount: totalSentAmount
        });
      });
  };
  handleSubscription = (id, userId, donateTo, subscribedBy, subscriptionID) => {
    let data = {};
    if (donateTo === 'profile') {
      data = {
        profile_id: id,
        userId: userId,
        directDonation: true,
        subscribedBy,
        subscriptionID
      };
    } else {
      data = {
        projectId: id,
        userId: userId,
        directDonation: false,
        subscribedBy,
        subscriptionID
      };
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to unsubscribe this ${donateTo}!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, unsubscribe it!'
    })
      .then((result) => {
        if (result.value) {
          axios.post('/payment/unsubscribe-payment', data).then((resp) => {
            this.handleMonthly();
            this.setState({
              success: resp.data.success
            });
          });
        }
      })
      .catch((error) => {
        toastr.error('Failed to unsubscribe!! Please try again');
      });
  };
  handleExport = async (exportType) => {
    user = JSON.parse(localStorage.getItem('user'));
    const { pageLimit, startDate, endDate, projectId, donationOn, donationStatus, oneTime } =
      this.state;
    const currentPage = 1;
    this.setState({
      currentPage,
      isExportLoading: true
    });
    if (currentPage !== this.state.currentPage) {
      //  this.props.history.push(`/transactions?page=${currentPage}`);
    }
    const tempStartDate = moment(this.props.profileInfo.createdAt);
    const tempEndDate = moment();
    const StartDate = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    const EndDate = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    const tz = moment.tz.guess();

    const donationType = oneTime ? 'oneTime' : 'monthly';
    if (exportType === 'csv') {
      await axios
        .get(
          `/users/export-sentdonationcsv-report?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donationOn}&projectId=${projectId}&status=${donationStatus}&donationType=${donationType}&tz=${tz}`
        )
        .then((response) => {
          const { data } = response;
          this.setState({
            isExportLoading: false
          });
          const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: false,
            showTitle: true,
            title: 'Recieve Donation Report',
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true
            // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
          };

          const csvExporter = new ExportToCsv(options);

          csvExporter.generateCsv(data);
        })
        .catch((errr) => {
          this.setState({
            isExportLoading: false
          });
        });
    } else {
      await axios
        .get(
          `/users/export-sentdonationxls-report?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donationOn}&projectId=${projectId}&status=${donationStatus}&donationType=${donationType}&tz=${tz}`,
          {
            responseType: 'blob'
          }
        )
        .then((response) => {
          this.setState({
            isExportLoading: false
          });
          let blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });

          FileSaver.saveAs(blob, moment().format('YYYY_MM_DD') + '_paypal_donation_report.xlsx');
        })
        .catch((err) => {
          this.setState({
            isExportLoading: false
          });
        });
    }
  };
  render() {
    const {
      projects,
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      pageNeighbours,
      oneTime,
      monthly,
      totalSentAmount,
      nextMonthEstimation,
      donationOn,
      donationDuration,
      startDate,
      endDate,
      donationStatus,
      focusedInput,
      isFilterApplied,
      isExportLoading
    } = this.state;
    let count = (currentPage - 1) * 10 + 1;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return (
      <>
        <div className="col-md-12 col-sm-12 dashboard-right-warp">
          <div className="dashboard-right">
            <div className="user-profile-overview clearfix">
              <div className="col-md-12">
                <div className="big_label1 activeDonationTitle">
                  <span>Money Out </span>
                  {oneTime ? (
                    totalSentAmount ? (
                      <span className="estimatedAmount">
                        <div>
                          Total Sent:
                          <span className="estimatedPrice">
                            ${totalSentAmount ? totalSentAmount : 0.0}
                          </span>
                        </div>
                      </span>
                    ) : null
                  ) : nextMonthEstimation ? (
                    <span className="estimatedAmount">
                      <div>
                        Total Sent:
                        <span className="estimatedPrice">
                          ${totalSentAmount ? totalSentAmount : 0.0}
                        </span>
                      </div>
                      <div>
                        Next Month:
                        <span className="estimatedPrice">${nextMonthEstimation || 0.0}</span>
                      </div>
                    </span>
                  ) : null}
                </div>
                <div className="form-actions form-btn-block text-center">
                  <div className="time-category-wrap">
                    <div
                      className={
                        oneTime === true ? 'time-category active-category' : 'time-category'
                      }
                      onClick={this.handleOneTime}>
                      OneTime
                    </div>
                    <div
                      className={
                        monthly === true ? 'time-category active-category' : 'time-category'
                      }
                      onClick={this.handleMonthly}>
                      Monthly
                    </div>
                  </div>
                </div>
                <div className="dropdown report-drop">
                  <button className="dropbtn">
                    Download report
                    {isExportLoading ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-chevron-down icon-report"></i>
                    )}
                  </button>
                  <div className="dropdown-content">
                    <a onClick={() => this.handleExport('xls')} className="cursor-pointer">
                      Transaction report(xls)
                    </a>
                    <a onClick={() => this.handleExport('csv')} className="cursor-pointer">
                      Transaction report(csv)
                    </a>
                  </div>
                </div>
                <div className="filter-row sm-relative">
                  <div className="form-group ">
                    <label>Filter</label>
                    <select
                      className="form-control"
                      name="donationOn"
                      value={donationOn}
                      onChange={this.handleChange}>
                      <option value="all">All</option>
                      <option value="0">Sponsor Pages</option>
                      <option value="1">Profile</option>
                    </select>
                  </div>
                  <div className="form-group width-auto">
                    <label>Date</label>
                    <div className="duration-form">
                      <select
                        className="form-control"
                        name="donationDuration"
                        value={donationDuration}
                        onChange={this.handleChange}>
                        <option value="">Select</option>
                        {/* <option value="allTime">All Time</option> */}
                        <option value="today">Today</option>
                        {/* <option value='week'>This Week</option> */}
                        <option value="last7Days">Last 7 Days</option>
                        <option value="last30Days">Last 30 Days</option>
                        <option value="month">This Month</option>
                        <option value="allTime">All Time</option>
                        <option value="custom">Custom Range</option>
                      </select>
                      <DateRangePicker
                        // name="satrtDate"
                        numberOfMonths={1}
                        startDate={startDate}
                        startDateId="your_unique_start_date_id"
                        endDate={endDate}
                        small={true}
                        endDateId="your_unique_end_date_id"
                        onDatesChange={({ startDate, endDate }) =>
                          this.handleDateChange(startDate, endDate)
                        } // PropTypes.func.isRequired,
                        focusedInput={focusedInput}
                        onFocusChange={(focusedInput) => this.setState({ focusedInput })}
                        isOutsideRange={(day) => !isInclusivelyBeforeDay(day, moment())}
                        displayFormat={() => INPUT_DATE_FROMAT}
                        minimumNights={0}
                        // daySize ={'200px'}
                      />
                    </div>
                  </div>

                  <div className="form-group sm-status ">
                    <label>Status</label>
                    <select
                      className="form-control"
                      name="donationStatus"
                      value={donationStatus}
                      onChange={this.handleChange}>
                      <option value="all">All</option>
                      <option value="Failed">Failed</option>
                      <option value="Completed">Success</option>
                    </select>
                  </div>
                  <div className="filter-btn ">
                    <TooltipComponent message={'Click here to search'}>
                      <button
                        className="btn btn-default btn-search"
                        type="submit"
                        disabled={
                          donationOn || donationStatus || startDate || endDate ? false : true
                        }
                        onClick={this.handleSearch}>
                        <i className="fas fa-search" />
                        <span className="search-text">Search</span>
                      </button>
                    </TooltipComponent>
                    <TooltipComponent message={'Click here to reset'}>
                      <button
                        className="btn btn-default btn-reset"
                        onClick={this.handleReset}
                        disabled={
                          donationOn || donationStatus || startDate || endDate ? false : true
                        }>
                        <i className="fas fa-undo-alt" />
                      </button>
                    </TooltipComponent>
                  </div>
                </div>

                <div className="project-card filter-table-box">
                  {!loading ? (
                    isFilterApplied || projects.length ? (
                      <>
                        <div className="mobile-view-donation ">
                          <div className="row donation-row">
                            {projects.length ? (
                              projects.map((item, index) => {
                                const project = item.element ? item.element : item;
                                let reward =
                                  item.Project && item.Project.reward && item.reward_id
                                    ? JSON.parse(item.Project.reward).find(
                                        (reward) => reward.id === item.reward_id
                                      )
                                    : '';
                                return (
                                  <div className="col-sm-6 col-md-6 donation-col" key={index}>
                                    <div className="donation-tile ">
                                      <div className="d-flex">
                                        <div className="flex-1">
                                          <h4>
                                            {!project.direct_donation && project.Project ? (
                                              <Link
                                                to={`/${project.Project.url}`}
                                                className="product-title-box-projectname capitalize">
                                                {project.Project.name}
                                              </Link>
                                            ) : item.profileInfo ? (
                                              <Link
                                                to={`/${item.profileInfo.profileUrl}`}
                                                className="product-title-box-projectname capitalize">
                                                <span>
                                                  {[
                                                    item.profileInfo.first_name,
                                                    item.profileInfo.last_name
                                                  ].join(' ')}
                                                </span>
                                              </Link>
                                            ) : (
                                              '-'
                                            )}
                                          </h4>
                                          <p>
                                            <b>Donation ID: </b>
                                            {project.donation_id}
                                          </p>
                                          <p>
                                            <b>Reward: </b>
                                            {reward ? <span>{reward.reward_title}</span> : null}
                                          </p>
                                          <p>
                                            <span className="mobile_payment">
                                              <b>Payment Date:</b>{' '}
                                              {moment(project.createdAt).format('MMM DD, YYYY')}
                                            </span>
                                            {this.state.monthly === true ? (
                                              <span>
                                                <b>Next Donation Date:</b>{' '}
                                                <span>
                                                  {project.next_donation_date
                                                    ? moment(project.next_donation_date).format(
                                                        'MMM DD, YYYY'
                                                      )
                                                    : '-'}
                                                </span>
                                                <br />
                                                {project.next_donation_date &&
                                                moment(project.next_donation_date).isAfter() &&
                                                project.isSubscribed ? (
                                                  <TooltipComponent
                                                    message="Click here to unsubscribe your next donation"
                                                    id={'stripe'}>
                                                    {project.Project ? (
                                                      <div
                                                        className="btn btn-xs btn-success"
                                                        style={{
                                                          marginTop: '6px'
                                                        }}
                                                        onClick={() =>
                                                          this.handleSubscription(
                                                            project.Project.id,
                                                            project.user_id,
                                                            'project',
                                                            project.subscribedBy,
                                                            project.subscription_id
                                                          )
                                                        }>
                                                        Unsubscribe
                                                      </div>
                                                    ) : (
                                                      <div
                                                        className="btn btn-xs btn-success"
                                                        style={{
                                                          marginTop: '6px'
                                                        }}
                                                        onClick={() =>
                                                          this.handleSubscription(
                                                            project.profile_id,
                                                            project.user_id,
                                                            'profile',
                                                            project.subscribedBy,
                                                            project.subscription_id
                                                          )
                                                        }>
                                                        Unsubscribe
                                                      </div>
                                                    )}
                                                  </TooltipComponent>
                                                ) : project.next_donation_date &&
                                                  !project.isSubscribed ? (
                                                  <div
                                                    className="btn btn-xs btn-danger"
                                                    style={{ marginTop: '6px' }}>
                                                    Cancelled
                                                  </div>
                                                ) : (
                                                  ''
                                                )}
                                                {/* {moment(
                                                project.next_donation_date
                                              ).format('MMM DD, YYYY')} */}
                                              </span>
                                            ) : null}
                                          </p>
                                          <p>
                                            <b>Status: </b>
                                            {project.status ? (
                                              <span className=" success">Success</span>
                                            ) : (
                                              <span className=" fail">Failed</span>
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="price">
                                            $
                                            {project.amount
                                              ? new Intl.NumberFormat('en-US', {
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
                              })
                            ) : (
                              <div className="project-not-found text-center">
                                <h5 className="pb-3">No data found related to your search</h5>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="dashboard-project-list-wrap transation-table-wrap desktop-view-donation">
                          <div
                            className="common-table-wrap table-responsive-lg"
                            style={{ overflow: 'auto' }}>
                            <table className="table-bordered responsive table table-striped table-hover">
                              <thead className="thead_color">
                                <tr>
                                  <th className="producttitle text-center">S.No.</th>
                                  <th className="productimg" style={{ minWidth: '240px' }}>
                                    Project/ People
                                  </th>
                                  <th className="producttitle text-center ">Donation Id</th>
                                  <th className="goal-price text-center">Amount</th>
                                  <th className="goal-price text-center">Reward</th>
                                  <th className="goal-price text-center">Method</th>
                                  <th
                                    className="rised-price text-center"
                                    style={{ minWidth: '150px' }}>
                                    Payment Date
                                  </th>
                                  {this.state.monthly === true ? (
                                    <th
                                      className="rised-price text-center"
                                      style={{ minWidth: '150px' }}>
                                      Next donation date
                                    </th>
                                  ) : null}
                                  <th className="rised-price text-center">Status</th>
                                  {/* {this.state.monthly === true ? (
                                    <th className="rised-price text-center">
                                      Unsubscribe
                                    </th>
                                  ) : null} */}
                                </tr>
                              </thead>
                              <tbody>
                                {projects.length ? (
                                  projects.map((item, index) => {
                                    const project = item.element ? item.element : item;
                                    let reward =
                                      item.Project && item.Project.reward && item.reward_id
                                        ? JSON.parse(item.Project.reward).find(
                                            (reward) => reward.id === item.reward_id
                                          )
                                        : '';
                                    return (
                                      <tr key={project.id}>
                                        <td className="text-center">
                                          <span>{count++}</span>
                                        </td>
                                        <td className="text-left">
                                          <div className="product-title-box capitalize">
                                            {!project.direct_donation && project.Project ? (
                                              <Link
                                                to={`/${project.Project.url}`}
                                                className="product-title-box-projectname capitalize">
                                                {project.Project.name}
                                              </Link>
                                            ) : item.profileInfo ? (
                                              <Link
                                                to={`/${item.profileInfo.profileUrl}`}
                                                className="product-title-box-projectname capitalize">
                                                <span>
                                                  {[
                                                    item.profileInfo.first_name,
                                                    item.profileInfo.last_name
                                                  ].join(' ')}
                                                </span>
                                              </Link>
                                            ) : (
                                              '-'
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
                                              ? new Intl.NumberFormat('en-US', {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2
                                                }).format(project.amount)
                                              : 0.0}
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          {reward ? <div>{reward.reward_title}</div> : '-'}
                                        </td>
                                        <td>
                                          {project.payment_by === 'paypal' ? 'Paypal' : 'Card'}
                                        </td>
                                        <td className="text-center">
                                          {moment(project.createdAt).format('MMM DD, YYYY')}
                                        </td>
                                        {this.state.monthly === true ? (
                                          <td className="text-center">
                                            <span>
                                              {moment(project.next_donation_date).format(
                                                'MMM DD, YYYY'
                                              )}
                                            </span>{' '}
                                            <br />
                                            {project.next_donation_date &&
                                            moment(project.next_donation_date).isAfter() &&
                                            project.isSubscribed ? (
                                              <TooltipComponent
                                                message="Click here to unsubscribe your next donation"
                                                id={'stripe'}>
                                                {project.Project ? (
                                                  <div
                                                    className="btn btn-xs btn-success"
                                                    style={{ marginTop: '6px' }}
                                                    onClick={() =>
                                                      this.handleSubscription(
                                                        project.Project.id,
                                                        project.user_id,
                                                        'project',
                                                        project.subscribedBy,
                                                        project.subscription_id
                                                      )
                                                    }>
                                                    Unsubscribe
                                                  </div>
                                                ) : (
                                                  <div
                                                    className="btn btn-xs btn-success"
                                                    style={{ marginTop: '6px' }}
                                                    onClick={() =>
                                                      this.handleSubscription(
                                                        project.profile_id,
                                                        project.user_id,
                                                        'profile',
                                                        project.subscribedBy,
                                                        project.subscription_id
                                                      )
                                                    }>
                                                    Unsubscribe
                                                  </div>
                                                )}
                                              </TooltipComponent>
                                            ) : !project.isSubscribed ? (
                                              <div
                                                className="btn btn-xs btn-danger"
                                                style={{ marginTop: '6px' }}>
                                                Cancelled
                                              </div>
                                            ) : (
                                              ''
                                            )}
                                          </td>
                                        ) : null}
                                        <td className="text-center">
                                          {project.status ? (
                                            <span className="badge badge-active">Success</span>
                                          ) : (
                                            <span className="badge badge-fail">Failed</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <div className="project-not-found text-center">
                                    <h3 className="pb-3">No data found related to your search</h3>
                                  </div>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="project-not-found text-center">
                        <h3 className="pb-3">
                          Looks like you haven’t sponsored any girls or women yet.
                        </h3>
                        <Link className="btn btn-donate-big" to="/search">
                          Explore Projects & People
                        </Link>
                      </div>
                    )
                  ) : (
                    <Loader />
                  )}
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};
export default withRouter(connect(mapStateToProps)(SentTransactions));

// export default withRouter(SentTransactions);
