import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'react-circular-progressbar/dist/styles.css';
import * as moment from 'moment';
import Loader from '../../components/Loader';
import Pagination from '../Pagination';
import { withRouter } from 'react-router';
import TooltipComponent from '../../components/TooltipComponent/TooltipComponent';
import 'react-dates/initialize';
import { DateRangePicker, isInclusivelyBeforeDay } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { INPUT_DATE_FROMAT, DATE_FORMAT } from '../../constants';
const queryString = require('query-string');

let user = JSON.parse(localStorage.getItem('user'));
let StartDate = moment().startOf('month');
let EndDate = moment().endOf('month');
class DonationCollectedTillNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      donationCollectedData: [],
      donationOn: '',
      donationDuration: 'nextMonth',
      donationType: '',
      startDate: moment(StartDate).add(1, 'months').startOf('isoMonths'),
      endDate: moment(EndDate).add(1, 'months').endOf('isoMonths'),
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1,
      oneTime: true,
      monthly: false,
      focusedInput: null,
      isFilterApplied: false,
      success: false //unsubscribe success status
    };
    // this.getProjects();
  }

  componentDidMount() {
    this.handleQueryParam();
  }
  handleQueryParam = () => {
    const parsed = queryString.parse(this.props.location.search);
    let donationDuration = this.state.donationDuration;
    let donationOn = this.state.donationOn;
    let donationType = this.state.donationType;
    let startDate = this.state.startDate;
    let endDate = this.state.endDate;
    if (parsed) {
      donationDuration = parsed.donationDuration ? parsed.donationDuration : donationDuration;
      donationOn = parsed.donationOn ? parsed.donationOn : donationOn;
      donationType = parsed.donationType ? parsed.donationType : donationType;
      startDate = parsed.startDate ? moment(parsed.startDate) : '';
      endDate = parsed.endDate ? moment(parsed.endDate) : '';
      if (donationDuration !== '') {
        if (donationDuration === 'thisMonth') {
          startDate = moment();
          endDate = moment().endOf('month');
        } else if (donationDuration === 'nextMonth') {
          startDate = moment(StartDate).add(1, 'months').startOf('isoMonths');
          endDate = moment(EndDate).add(1, 'months').endOf('isoMonths');
        } else if (donationDuration === 'nextWeek') {
          startDate = moment(StartDate).add(1, 'weeks').startOf('isoWeeks');
          endDate = moment(EndDate).add(1, 'weeks').endOf('isoWeeks');
        } else {
          startDate = this.state.startDate;
          endDate = this.state.endDate;
        }
      }
      this.setState(
        {
          currentPage: parsed.page,
          donationOn,
          startDate,
          endDate,
          donationType,
          donationDuration
        },
        () => this.getDonationCollectedData()
      );
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
  };
  getDonationCollectedData = () => {
    user = JSON.parse(localStorage.getItem('user'));
    const { currentPage, pageLimit, donationOn, startDate, endDate } = this.state;
    if (user) {
      this.setState({ loading: true });
      let StartDate = startDate ? moment(startDate).format('YYYY-MM-DD') : '';
      let EndDate = endDate ? moment(endDate).format('YYYY-MM-DD') : '';
      axios
        .get(
          `/users/donation-collected?userId=${user.userId}&donationOn=${donationOn}&startDate=${StartDate}&endDate=${EndDate}&page=${currentPage}&limit=${pageLimit}&donationCollected=future`
        )
        .then((response) => {
          const { data, totalPages } = response.data;
          this.props.getTotalAmount(
            response.data.totalAmount && response.data.totalAmount.length
              ? response.data.totalAmount[0].totalAmount
              : 0
          );
          this.setState({ donationCollectedData: data, totalRecords: totalPages, loading: false });
        })

        .catch((err) => {
          this.setState({
            loading: false
          });
        });
    }
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleQueryParam();
    }
  };
  handleDateChange = (startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
      donationDuration: 'custom'
    });
  };

  onPageChanged = (data) => {
    const { currentPage } = data;
    // const { category, name, percentage, username } = this.state;
    const { location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    if (currentPage !== this.state.currentPage) {
      this.props.history.push(
        [pathname, queryString.stringify({ ...query, page: currentPage })].join('?')
      );
    }
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
      if (value === 'thisMonth') {
        startDate = moment();
        endDate = moment().endOf('month');
      } else if (value === 'nextMonth') {
        startDate = moment(StartDate).add(1, 'months').startOf('isoMonths');
        endDate = moment(EndDate).add(1, 'months').endOf('isoMonths');
      } else if (value === 'nextWeek') {
        startDate = moment(StartDate).add(1, 'weeks').startOf('isoWeeks');
        endDate = moment(EndDate).add(1, 'weeks').endOf('isoWeeks');
      } else {
        startDate = '';
        endDate = '';
      }
      this.setState({
        startDate,
        endDate
      });
    }
  };

  handleSearch = () => {
    let data = {};
    const { donationOn, donationDuration, startDate, endDate } = this.state;
    this.setState({ isFilterApplied: true });
    if (donationOn) {
      data.donationOn = donationOn;
    }
    if (startDate) {
      data.startDate = moment(startDate).format(DATE_FORMAT);
    }
    if (endDate) {
      data.endDate = moment(endDate).format(DATE_FORMAT);
    }
    if (donationDuration) {
      data.donationDuration = donationDuration;
    }
    let url = queryString.stringify(data);
    this.props.history.push(`/money/collected?tab=upcoming&${url}&page=1`);
  };
  handleReset = () => {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({ isFilterApplied: false });
    if (parsed) {
      this.props.history.push('/money/collected?tab=upcoming');
    } else {
      this.setState({
        donationOn: '',
        donationType: ''
      });
    }
  };
  render() {
    const {
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      pageNeighbours,
      donationOn,
      donationDuration,
      donationCollectedData,
      donationType,
      focusedInput,
      startDate,
      endDate,
      isFilterApplied
    } = this.state;

    // const { sendDonationData } = this.props
    let count = (currentPage - 1) * 10 + 1;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return (
      <>
        <div className="filter-row">
          <div className="form-group ">
            <label>Donation On</label>
            <select
              className="form-control"
              name="donationOn"
              value={donationOn}
              onChange={this.handleChange}>
              <option value="">All</option>
              <option value="0">Sponsor Page</option>
              <option value="1">Profile</option>
            </select>
          </div>
          <div className="form-group width-auto">
            <label>Duration</label>
            <div className="duration-form">
              <select
                className="form-control"
                name="donationDuration"
                value={donationDuration}
                onChange={this.handleChange}>
                {/* <option value=''>Select</option> */}
                <option value="thisMonth">This Month</option>
                <option value="nextMonth">Next Month</option>
                <option value="nextWeek">Next Week</option>
                <option value="custom">Custom</option>
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
                isOutsideRange={(day) => isInclusivelyBeforeDay(day, moment())}
                displayFormat={() => INPUT_DATE_FROMAT}
                minimumNights={0}
              />
            </div>
          </div>

          <div className="filter-btn ">
            <TooltipComponent message={'Click here to search'}>
              <button
                className="btn btn-default btn-search"
                type="submit"
                disabled={donationOn || donationType || startDate || endDate ? false : true}
                onClick={this.handleSearch}>
                <i className="fas fa-search" />
              </button>
            </TooltipComponent>
            <TooltipComponent message={'Click here to reset'}>
              <button
                className="btn btn-default btn-reset"
                onClick={this.handleReset}
                disabled={donationOn || donationType || startDate || endDate ? false : true}>
                <i className="fas fa-undo-alt" />
              </button>
            </TooltipComponent>
          </div>
        </div>

        {!loading ? (
          donationCollectedData && donationCollectedData.length ? (
            <>
              <div className="mobile-view-donation ">
                <div className="row donation-row">
                  {donationCollectedData.map((item, index) => {
                    return (
                      <div className="col-sm-6 col-md-6 donation-col" key={index}>
                        <div className="donation-tile ">
                          <h4 className="word-wrap">
                            {!item.direct_donation ? (
                              <Link
                                to={`/${item.projectUrl}`}
                                className="product-title-box-projectname capitalize">
                                {item.projectName ? item.projectName : ''}
                              </Link>
                            ) : (
                              'Self'
                            )}
                          </h4>
                          <div className="d-flex">
                            <div className="flex-1">
                              <p>
                                <span className="mobile_payment">
                                  <b>Donation By:</b>{' '}
                                  {item.first_name && item.last_name && !item.anonymousUser ? (
                                    <Link
                                      to={`/${item.ProfileUrl}`}
                                      className="product-title-box-projectname capitalize">
                                      {[item.first_name, item.last_name].join(' ')}
                                    </Link>
                                  ) : (
                                    'Anonymous'
                                  )}
                                </span>
                                <span>
                                  <b>Estimated Donation Date:</b>
                                  <span>
                                    {item.next_donation_date
                                      ? moment(item.next_donation_date).format('MMM DD, YYYY')
                                      : '-'}
                                  </span>
                                  <br />
                                </span>
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
                        <th className="productimg">Sponsor Page/People</th>
                        <th className="rised-price text-center">Donated By</th>
                        <th className="goal-price text-center">Amount</th>
                        {/* {this.state.monthly === true ? ( */}
                        <th className="rised-price text-center">Estimated donation date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donationCollectedData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-center">
                              <span>{count++}</span>
                            </td>
                            <td className="text-left">
                              <div className="product-title-box capitalize">
                                {!item.direct_donation ? (
                                  <Link
                                    to={`/${item.projectUrl}`}
                                    className="product-title-box-projectname capitalize">
                                    {item.projectName}
                                  </Link>
                                ) : (
                                  'Self'
                                )}
                              </div>
                            </td>

                            <td className="text-center">
                              {item.first_name && item.last_name && !item.anonymousUser ? (
                                <Link
                                  to={`/${item.ProfileUrl}`}
                                  className="product-title-box-projectname capitalize">
                                  {[item.first_name, item.last_name].join(' ')}
                                </Link>
                              ) : (
                                'Anonymous'
                              )}
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

                            {/* {this.state.monthly === true ? ( */}
                            <td className="text-center">
                              <span>
                                {item.next_donation_date
                                  ? moment(item.next_donation_date).format('MMM DD, YYYY')
                                  : '-'}
                              </span>
                              <br />
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
            <div className="nodata-found text-center collected-no-data">
              {isFilterApplied ? (
                <h3 className="pb-3"> No donations found related to your search.</h3>
              ) : (
                <h3 className="pb-3">
                  You haven't received any donations yet on Profile and Sponsor Page.
                </h3>
              )}
            </div>
          )
        ) : (
          <div className="donation-page-loader">
            {' '}
            <Loader />
          </div>
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
      </>
    );
  }
}

export default withRouter(DonationCollectedTillNow);
