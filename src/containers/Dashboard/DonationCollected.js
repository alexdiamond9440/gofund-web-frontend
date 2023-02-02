import React, { Component } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { withRouter } from 'react-router';
import UpcomgDonationCollected from './UpcomindDonationCollected';
import DonationCollectedTillNow from './DonationCollectedTillNow';
const queryString = require('query-string');

class DonationsCollected extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 10,
      pageNeighbours: 1,
      sendDonationData: [],
      receiveDonationData: [],
      totalsendDonation: 0,
      donationTillNow: true,
      upcomingDonation: false,
      success: false //unsubscribe success status
    };
    // this.getProjects();
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed && parsed.tab === 'upcoming') {
      this.setState({ donationTillNow: !this.state.donationTillNow });
    } else {
      this.setState({
        donationTillNow: true
      });
    }
  }
  handlesentDonation = () => {
    const { donationTillNow } = this.state;
    if (donationTillNow) {
      this.props.history.push('/money/collected?tab=upcoming');
    } else {
      this.props.history.push('/money/collected?tab=till-now');
    }
    this.setState({ donationTillNow: !this.state.donationTillNow });
  };

  getTotalAmount = (amount) => {
    this.setState({ totalAmount: amount });
  };
  render() {
    const { donationTillNow, totalAmount } = this.state;
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
                  <span>Donations Collected</span>
                  {
                    <span className="estimatedAmount">
                      {donationTillNow ? 'Received amount' : 'Estimated Receiving amount'}-{' '}
                      <span className="estimatedPrice">${totalAmount ? totalAmount : 0}</span>
                    </span>
                  }
                </div>
                <div className="form-actions form-btn-block text-center">
                  <div className="time-category-wrap">
                    <div
                      className={
                        donationTillNow === true ? 'time-category active-category' : 'time-category'
                      }
                      onClick={this.handlesentDonation}>
                      Donations Till Now
                    </div>
                    <div
                      className={
                        !donationTillNow ? 'time-category active-category' : 'time-category'
                      }
                      onClick={this.handlesentDonation}>
                      Upcoming Donations
                    </div>
                  </div>
                </div>

                <div className="project-card">
                  {donationTillNow ? (
                    <>
                      <DonationCollectedTillNow getTotalAmount={this.getTotalAmount} />
                    </>
                  ) : (
                    <UpcomgDonationCollected getTotalAmount={this.getTotalAmount} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(DonationsCollected);
