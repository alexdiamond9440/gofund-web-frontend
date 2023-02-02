/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import { withRouter } from 'react-router';
import FileSaver from 'file-saver';
import { ExportToCsv } from 'export-to-csv';
import 'react-dates/initialize';
import { connect } from 'react-redux';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import queryString from 'query-string';
import { Bar } from 'react-chartjs-2';

import { INPUT_DATE_FROMAT, DATE_FORMAT } from '../../constants';

import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
import 'react-dates/lib/css/_datepicker.css';

let user = JSON.parse(localStorage.getItem('user'));

class ReceivedTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donationList: [],
      projects: [],
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1,
      oneTime: true,
      monthly: false,
      totalReceivedAmount: 0,
      nextMonthEstimation: null,
      donationOn: '',
      donationDuration: 'today',
      donationStatus: '',
      startDate: moment(),
      endDate: moment(),
      focusedInput: '',
      projectId: '',
      totalSponsor: 0,
      isFilterApplied: false,
      isExportLoading: false,
      oneTimeSponsor: 0,
      monthlySponsor: 0
    };
  }

  componentDidMount = async () => {
    this.setState({
      startDate: moment(this.props.profileInfo.createdAt)
    });
    this.handleQueryParam();
    this.fetchProject();
  };
  getTotalSponsor = async (queryObj = {}) => {
    const { donationType } = queryObj;
    await axios
      .get(`/users/total-sponsor`, {
        params: {
          userId: user.userId,
          ...queryObj
        }
      })
      .then((response) => {
        const { data: { data } = {} } = response;
        if (data) {
          this.setState({
            [`${donationType}Sponsor`]: data && data.length ? data[0].count || 0 : 0
          });
        }
      });
  };
  getDonationChart = async () => {
    const { startDate, endDate, donationOn, projectId, donationStatus, oneTime } = this.state;
    const getMonthArray = () => {
      const months = [];
      const dateStart = moment(startDate).startOf('year');
      const dateEnd = moment(endDate).startOf('year').add(12, 'month');

      while (dateEnd.diff(dateStart, 'month') > 0) {
        months.push(`${dateStart.format('MMMM')} ${moment(dateStart).format('YYYY')}`);
        dateStart.add(1, 'month');
      }
      return months;
    };
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    let StartDate = moment(startDate).format(DATE_FORMAT);
    let EndDate = moment(endDate).format(DATE_FORMAT);

    const donationType = oneTime ? 'oneTime' : 'monthly';
    const monthArray = getMonthArray();
    await axios
      .get(
        `/users/donation-chart?userId=${user.userId}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}&donationType=${donationType}`
      )
      .then((response) => {
        const { data: { data } = {} } = response;
        let tempData = [];
        if (data && data.length) {
          const formattedResponse = data.map((value) => ({
            ...value,
            month: `${value.month} ${moment(value.createdAt).format('YYYY')}`
          }));
          monthArray.map((month) => {
            const value = formattedResponse.find((item) => item.month === month);
            value ? tempData.push(value.total_amount || '0') : tempData.push('0');
            return true;
          });
        } else {
          tempData = Array(monthArray.length).fill('0');
        }
        const chartArray = {
          labels: monthArray,
          datasets: [
            {
              label: 'Amount Received',
              backgroundColor: 'rgba(255,99,132,0.2)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              //stack: 1,
              hoverBackgroundColor: 'rgba(255,99,132,0.4)',
              hoverBorderColor: 'rgba(255,99,132,1)',
              data: tempData
            }
          ]
        };
        this.setState({
          chartData: chartArray
        });
      });
  };
  handleQueryParam = () => {
    const { oneTime } = this.state;
    const parsed = queryString.parse(this.props.location.search);
    let donationDuration = this.state.donationDuration;
    let donationOn = this.state.donationOn;
    let donationStatus = this.state.donationStatus;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    let projectId = '';
    let page = '';
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
      if (parsed.donationOn) {
        if (parsed.donationOn === 'profile') {
          donationOn = parsed.donationOn;
        } else {
          projectId = parseInt(parsed.donationOn);
        }
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
          let donatioOnValue = donationOn === 'profile' ? donationOn : '';
          this.getDonationChart();
          this.getTotalSponsor({
            startDate: moment(startDate).format(DATE_FORMAT),
            donationOn: donatioOnValue,
            endDate: moment(endDate).format(DATE_FORMAT),
            projectId,
            status: donationStatus,
            donationType: 'oneTime'
          });
          this.getTotalSponsor({
            startDate: moment(startDate).format(DATE_FORMAT),
            donationOn: donatioOnValue,
            endDate: moment(endDate).format(DATE_FORMAT),
            projectId,
            status: donationStatus,
            donationType: 'monthly'
          });
          if (oneTime) {
            this.getDonationData();
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

  fetchProject() {
    user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios
        .get(`/users/project-list?userId=${user.userId}`)
        .then((response) => {
          this.setState({
            projects: response.data.data
          });
        })
        .catch((err) => {
          this.setState({
            loading: false
          });
        });
    }
  }
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
    if (name === 'donationStatus') {
      this.setState({ donationStatus: value });
    }
  };
  handleSearch = () => {
    this.setState({ isFilterApplied: true });
    let data = {};
    const { donationOn, donationStatus, donationDuration, startDate, endDate } = this.state;
    if (donationOn) {
      data.donationOn = donationOn;
    }
    if (donationStatus) {
      data.donationStatus = donationStatus;
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
    this.props.history.push(`/money/received?${url}&page=1`);
  };
  handleReset = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed) {
      this.props.history.push('/money/received');
    } else {
      this.setState({
        donationOn: ''
      });
    }
  };
  getDonationData = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit, endDate, startDate, projectId, donationOn, donationStatus } =
      this.state;
    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    let StartDate = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    let EndDate = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    if (user) {
      axios
        .get(
          `/users/receive-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}`
        )
        .then((response) => {
          this.setState({
            donationList: response.data.data.rows,
            totalRecords: response.data.data.count,
            totalReceivedAmount: response.data.totalReceivedAmount
              ? response.data.totalReceivedAmount
              : '0.00',
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
  componentDidUpdate = (prevProps) => {
    user = JSON.parse(localStorage.getItem('user'));
    if (prevProps.location.search !== this.props.location.search) {
      this.handleQueryParam();
    }
  };
  onPageChanged = (data) => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit } = data;
    if (currentPage !== this.state.currentPage) {
      // this.props.history.push(`/transactions?page=${currentPage}`);
    }
    const { startDate, endDate, donationOn, projectId, donationStatus } = this.state;
    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    let StartDate = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    let EndDate = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    if (this.state.oneTime === true) {
      axios
        .get(
          `/users/receive-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}`
        )
        .then((response) => {
          this.setState({
            donationList: response.data.data.rows,
            totalRecords: response.data.data.count,
            totalReceivedAmount: response.data.totalReceivedAmount
              ? response.data.totalReceivedAmount
              : '0.00',
            loading: false,
            currentPage
          });
        });
    }
    if (this.state.monthly === true) {
      axios
        .get(
          `/users/receive-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${StartDate}&endDate=${EndDate}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}`
        )
        .then((response) => {
          this.setState({
            donationList: response.data.data.rows,
            totalRecords: response.data.data.count,
            nextMonthEstimation: response.data.nextMonthEstimation,
            loading: false,
            currentPage
          });
        });
    }
  };

  handleOneTime = () => {
    this.setState(
      {
        oneTime: true
      },
      () => {
        this.getDonationChart();
      }
    );
    user = JSON.parse(localStorage.getItem('user'));
    const { pageLimit, startDate, endDate, donationOn, projectId, donationStatus } = this.state;
    const currentPage = 1;
    this.setState({
      currentPage
    });
    let tempStartDate = moment(this.props.profileInfo.createdAt);
    let tempEndDate = moment();
    const from = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    const to = endDate ? moment(endDate).format(DATE_FORMAT) : moment(tempEndDate);
    if (currentPage !== this.state.currentPage) {
      //  this.props.history.push(`/transactions?page=${currentPage}`);
    }
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    axios
      .get(
        `/users/receive-donation-data-onetime?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}`
      )
      .then((response) => {
        this.setState({
          donationList: response.data.data.rows,
          totalRecords: response.data.data.count,
          totalReceivedAmount: response.data.totalReceivedAmount
            ? response.data.totalReceivedAmount
            : '0.00',
          oneTime: true,
          monthly: false,
          loading: false
        });
      });
  };

  handleMonthly = () => {
    this.setState(
      {
        oneTime: false
      },
      () => {
        this.getDonationChart();
      }
    );

    user = JSON.parse(localStorage.getItem('user'));
    const { pageLimit, startDate, endDate, projectId, donationOn, donationStatus } = this.state;
    const currentPage = 1;
    this.setState({
      currentPage
    });
    if (currentPage !== this.state.currentPage) {
      //  this.props.history.push(`/transactions?page=${currentPage}`);
    }
    const tempStartDate = moment(this.props.profileInfo.createdAt);
    const tempEndDate = moment();
    const from = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    const to = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    axios
      .get(
        `/users/receive-donation-data-monthly?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}`
      )
      .then((response) => {
        this.setState({
          donationList: response.data.data.rows,
          totalRecords: response.data.data.count,
          nextMonthEstimation: response.data.nextMonthEstimation,
          totalReceivedAmount: response.data.totalReceivedAmount
            ? response.data.totalReceivedAmount
            : '0.00',
          monthly: true,
          oneTime: false,
          loading: false
        });
      });
  };
  handleExport = async (exportType) => {
    user = JSON.parse(localStorage.getItem('user'));
    const {
      pageLimit,
      startDate,
      endDate,
      projectId,
      donationOn,
      donationStatus,
      oneTime,
      monthly
    } = this.state;
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
    const from = startDate
      ? moment(startDate).format(DATE_FORMAT)
      : moment(tempStartDate).format(DATE_FORMAT);
    const to = endDate
      ? moment(endDate).format(DATE_FORMAT)
      : moment(tempEndDate).format(DATE_FORMAT);
    let donatioOnValue = '';
    if (donationOn === 'profile') {
      donatioOnValue = donationOn;
    }
    const donationType = oneTime ? 'oneTime' : monthly ? 'monthly' : 'oneTime';
    const tz = moment.tz.guess();

    if (exportType === 'csv') {
      await axios
        .get(
          `/users/export-donation-report?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}&donationType=${donationType}&tz=${tz}`
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
            title: 'Receive Donation Report',
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
          `/users/export-donationxls-report?userId=${user.userId}&page=${currentPage}&limit=${pageLimit}&startDate=${from}&endDate=${to}&donationOn=${donatioOnValue}&projectId=${projectId}&status=${donationStatus}&donationType=${donationType}&tz=${tz}`,
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
          FileSaver.saveAs(blob, `${moment().format('YYYY_MM_DD')}_donation_report.xlsx`);
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
      donationList,
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      oneTime,
      monthly,
      pageNeighbours,
      totalReceivedAmount,
      nextMonthEstimation,
      donationOn,
      donationDuration,
      startDate,
      endDate,
      donationStatus,
      focusedInput,
      projects,
      chartData,
      isFilterApplied,
      isExportLoading,
      oneTimeSponsor,
      monthlySponsor
    } = this.state;
    let count = (currentPage - 1) * 10 + 1;
    const options = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return `${ctx.dataset.label}: $${ctx.formattedValue}`;
            }
          }
        }
      },
      scales: {
        x: [
          {
            gridLines: {
              display: false,
              drawTicks: false,
              color: '#d0cfcf',
              drawOnChartArea: false
            },
            ticks: {
              //display: false,
              fontSize: 1,
              fontColor: '#fff'
            }
          }
        ],
        y: {
          ticks: {
            fontColor: '#fff',
            beginAtZero: true,
            callback: function (value) {
              return `$${value}`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      cornerRadius: 6,
      animation: false,
      legend: {
        display: false
      },
      layout: {
        padding: 0
      }
    };

    return (
      <div className="col-md-12 col-sm-12 dashboard-right-warp">
        <div className="dashboard-right">
          <div className="user-profile-overview clearfix">
            <div className="col-md-12">
              <div className="big_label1 activeDonationTitle">
                <span>Money In</span>
                {oneTime ? (
                  totalReceivedAmount ? (
                    <span className="estimatedAmount">
                      <div>
                        Total received:
                        <span className="estimatedPrice">
                          ${totalReceivedAmount ? totalReceivedAmount : 0.0}
                        </span>
                      </div>
                      <div>
                        Total Sponsor:
                        <span className="estimatedPrice">
                          {parseInt(oneTimeSponsor || 0) + parseInt(monthlySponsor || 0)}
                        </span>
                      </div>
                      <div>
                        One-time Sponsors:
                        <span className="estimatedPrice">{oneTimeSponsor || 0}</span>
                      </div>
                      <div>
                        Monthly sponsors:
                        <span className="estimatedPrice">{monthlySponsor || 0}</span>
                      </div>
                    </span>
                  ) : null
                ) : totalReceivedAmount ? (
                  <span className="estimatedAmount">
                    <div>
                      Total received:
                      <span className="estimatedPrice">
                        ${totalReceivedAmount ? totalReceivedAmount : 0.0}
                      </span>
                    </div>
                    <div>
                      Sponsorships Next Month:
                      <span className="estimatedPrice">
                        {nextMonthEstimation
                          ? `$${nextMonthEstimation.total_amount || 0.0}`
                          : '$0.00'}
                      </span>
                    </div>
                    <div>
                      Total Sponsor:
                      <span className="estimatedPrice">
                        {parseInt(oneTimeSponsor) + parseInt(monthlySponsor)}
                      </span>
                    </div>
                    <div>
                      One-time Sponsors:
                      <span className="estimatedPrice">{oneTimeSponsor}</span>
                    </div>
                    <div>
                      Monthly sponsors:
                      <span className="estimatedPrice">{monthlySponsor}</span>
                    </div>
                  </span>
                ) : null}
                {/* {oneTime ? (
                  <span className="estimatedAmount">
                    Total Sponsor:
                    <span className="estimatedPrice">
                      ${totalSponsor ? totalSponsor : 0}
                    </span>
                  </span>
                ) :
                  <span className="estimatedAmount">
                    Total Sponsor:
                    <span className="estimatedPrice">
                      ${totalSponsor ? totalSponsor : 0}
                    </span>
                  </span>
                } */}
              </div>
              <div className="form-actions form-btn-block text-center">
                <div className="time-category-wrap">
                  <div
                    className={oneTime === true ? 'time-category active-category' : 'time-category'}
                    onClick={this.handleOneTime}>
                    OneTime
                  </div>
                  <div
                    className={monthly === true ? 'time-category active-category' : 'time-category'}
                    onClick={this.handleMonthly}>
                    Monthly
                  </div>
                </div>
              </div>
              <div class="hide-for-desktop">
                {chartData ? (
                  <div className="bar-chart">
                    <Bar
                      data={chartData}
                      width={600}
                      height={'292.5px'}
                      options={options}
                      className="donation-chart"
                    />
                  </div>
                ) : null}
              </div>
              <div className="dropdown report-drop moneyin-report">
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
                    <option value="">All</option>
                    {projects &&
                      projects.length &&
                      projects.map((project, index) => (
                        <option onChange={this.handleChange} value={project.id} key={index}>
                          {project.name}
                        </option>
                      ))}
                    <option value="profile">Profile page sponsors</option>
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
                    {/* <option value="all">All</option> */}
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    {/* <option value="1">Failed</option> */}
                  </select>
                </div>

                <div className="filter-btn ">
                  <TooltipComponent message={'Click here to search'}>
                    <button
                      className="btn btn-default btn-search"
                      type="submit"
                      disabled={donationOn || donationStatus || startDate || endDate ? false : true}
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
              <div class="hide-for-mobile">
                {chartData ? (
                  <div className="bar-chart">
                    <Bar
                      data={chartData}
                      width={600}
                      height={'292.5px'}
                      options={options}
                      className="donation-chart"
                    />
                  </div>
                ) : null}
              </div>
              <div className="project-card filter-table-box">
                {!loading ? (
                  isFilterApplied || donationList.length ? (
                    <>
                      <div className="mobile-view-donation ">
                        <div className="row donation-row">
                          {donationList.length ? (
                            donationList.map((item, index) => {
                              const donationDetail = item.element ? item.element : item;
                              let reward =
                                donationDetail.Project &&
                                donationDetail.Project.reward &&
                                donationDetail.reward_id
                                  ? JSON.parse(donationDetail.Project.reward).find(
                                      (item) => item.id === donationDetail.reward_id
                                    )
                                  : '';
                              return (
                                <div className="col-sm-6 col-md-6 donation-col" key={index}>
                                  <div className="donation-tile ">
                                    <div className="d-flex">
                                      <div className="flex-1">
                                        <h4>
                                          {donationDetail.Project
                                            ? donationDetail.Project.name
                                            : 'My Profile'}
                                        </h4>
                                        <p>
                                          <b>Deposit ID: </b>
                                          {donationDetail.donation_id}
                                        </p>
                                        <p>
                                          <span className="mobile_payment">
                                            <b>Deposited By:</b>{' '}
                                            {donationDetail.is_info_sharable
                                              ? donationDetail.full_name
                                              : 'Anonymous'}
                                          </span>
                                          <span className="mobile_payment">
                                            <b>Sponsor Email address:</b>{' '}
                                            {donationDetail.is_info_sharable
                                              ? donationDetail.email || '-'
                                              : '-'}
                                          </span>
                                          {donationDetail.phone ? (
                                            <span className="mobile_payment">
                                              <b>Sponsor Phone:</b>{' '}
                                              {donationDetail.is_info_sharable ? (
                                                <a
                                                  href={`tel:${donationDetail.phone}`}
                                                  className="phone">
                                                  {donationDetail.phone}
                                                </a>
                                              ) : (
                                                '-'
                                              )}
                                            </span>
                                          ) : null}
                                          <p>
                                            <b>Reward: </b>
                                            {reward ? <span>{reward.reward_title}</span> : null}
                                          </p>
                                          <span className="mobile_payment">
                                            <b>Deposit Date:</b>{' '}
                                            {moment(donationDetail.createdAt).format(
                                              'MMM DD, YYYY'
                                            )}
                                          </span>
                                        </p>

                                        <p>
                                          <b>Status: </b>

                                          {(
                                            donationDetail.payment_by === 'paypal'
                                              ? donationDetail.payout_succeed
                                              : donationDetail.status
                                          ) ? (
                                            <span className="success">
                                              {donationDetail.payment_status === 'Completed'
                                                ? 'Success'
                                                : donationDetail.payment_status}
                                            </span>
                                          ) : (
                                            <span className="fail">
                                              {donationDetail.payment_by === 'paypal'
                                                ? 'Pending'
                                                : 'Failed'}
                                            </span>
                                          )}
                                        </p>
                                      </div>

                                      <div>
                                        <span className="price">
                                          $
                                          {donationDetail.payout_amount
                                            ? new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                              }).format(donationDetail.payout_amount)
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
                              <h5 className="pb-3">No Donations found related to your search</h5>
                              {/* <Link className="btn btn-donate-big" to="/projects">
                    Explore Projects & People
                  </Link> */}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="dashboard-project-list-wrap transation-table-wrap desktop-view-donation">
                        <div className="common-table-wrap table-responsive-lg">
                          <table className="table-bordered responsive table table-striped table-hover">
                            <thead className="thead_color">
                              <tr>
                                <th className="producttitle text-center">S.No.</th>
                                <th className="productimg">Deposited To</th>
                                <th className="producttitle text-center ">Deposit Id</th>
                                <th className="rised-price text-center">Deposited By</th>
                                <th className="rised-price text-center">Sponsor Email address</th>
                                <th className="goal-price text-center">Amount</th>
                                <th className="rised-price text-center">Reward</th>
                                <th className="rised-price text-center">Deposit Date</th>
                                <th className="rised-price text-center">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donationList.length ? (
                                donationList.map((donationDetail, index) => {
                                  let reward =
                                    donationDetail.Project &&
                                    donationDetail.Project.reward &&
                                    donationDetail.reward_id
                                      ? JSON.parse(donationDetail.Project.reward).find(
                                          (item) => item.id === donationDetail.reward_id
                                        )
                                      : '';

                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        <span>{count++}</span>
                                      </td>
                                      <td className="text-left">
                                        <div className="product-title-box capitalize ">
                                          {donationDetail.Project
                                            ? donationDetail.Project.name
                                            : 'My Profile'}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="product-title-box">
                                          {donationDetail.donation_id}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div className="product-title-box">
                                          {donationDetail.is_info_sharable
                                            ? donationDetail.full_name || '-'
                                            : 'Anonymous'}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        <div>
                                          {donationDetail.is_info_sharable
                                            ? donationDetail.email || '-'
                                            : '-'}
                                        </div>
                                        {donationDetail.is_info_sharable && donationDetail.phone ? (
                                          <div>
                                            <a
                                              href={`tel:${donationDetail.phone}`}
                                              className="phone-field doller-text">
                                              {donationDetail.phone}
                                            </a>
                                          </div>
                                        ) : null}
                                      </td>
                                      <td className="text-center">
                                        <div className="doller-text">
                                          $
                                          {donationDetail.payout_amount
                                            ? new Intl.NumberFormat('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                              }).format(donationDetail.payout_amount)
                                            : 0.0}
                                        </div>
                                      </td>
                                      <td className="text-center">
                                        {reward ? <div>{reward.reward_title}</div> : '-'}
                                      </td>
                                      <td className="text-center">
                                        {moment(donationDetail.createdAt).format('MMM DD, YYYY')}
                                      </td>

                                      <td className="text-center">
                                        {(
                                          donationDetail.payment_by === 'paypal'
                                            ? donationDetail.payout_succeed
                                            : donationDetail.status
                                        ) ? (
                                          <span
                                            className={`badge badge-active ${
                                              donationDetail.payment_status !== 'Completed'
                                                ? 'badge badge-fail'
                                                : ''
                                            }`}>
                                            {donationDetail.payment_status === 'Completed'
                                              ? 'Success'
                                              : donationDetail.payment_status}
                                          </span>
                                        ) : (
                                          <span className="badge badge-fail">
                                            {donationDetail.payment_by === 'paypal'
                                              ? 'Pending'
                                              : 'Failed'}
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <div className="project-not-found text-center">
                                  <h3 className="pb-3">
                                    No Donations found related to your search
                                  </h3>
                                  {/* <Link className="btn btn-donate-big" to="/projects">
                            Explore Projects & People
                          </Link> */}
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
                        Find more sponsors: Send message to 3 people everyday.
                      </h3>
                      {/* <Link className="btn btn-donate-big" to="/projects">
                            Explore Projects & People
                          </Link> */}
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
    );
  }
}
const mapStateToProps = (state) => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};

export default withRouter(connect(mapStateToProps)(ReceivedTransactions));
