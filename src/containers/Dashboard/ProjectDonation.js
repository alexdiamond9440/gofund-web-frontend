/** @format */

import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SentTransactions from './sentTransactions';
import ReceivedTransactions from './receivedTransactions';
import 'react-circular-progressbar/dist/styles.css';

class ProjectDonation extends Component {
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
      sendDonation: true,
      receiveDonation: false,
      success: false, //unsubscribe success status
    };
  }
  handlesentDonation = () => {
    this.setState({ sendDonation: !this.state.sendDonation });
  };
  getTotalAmount = amount => {
    this.setState({ totalAmount: amount });
  };
  render() {
    const { sendDonation, totalAmount } = this.state;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return (
      <>
        <div className='col-md-12 col-sm-12 dashboard-right-warp'>
          <div className='dashboard-right'>
            <div className='user-profile-overview clearfix'>
              <div className='col-md-12'>
                <div className='big_label1 activeDonationTitle'>
                  <span>Sponsor Page Donations</span>
                  {!sendDonation ? (
                    <span className='estimatedAmount'>
                      Estimated Receiving amount -
                      <span className='estimatedPrice'>
                        ${totalAmount ? totalAmount : 0}
                      </span>
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                <div className='form-actions form-btn-block text-center'>
                  <div className='time-category-wrap'>
                    <div
                      className={
                        sendDonation === true
                          ? 'time-category active-category'
                          : 'time-category'
                      }
                      onClick={this.handlesentDonation}
                    >
                      Sent Donations
                    </div>
                    <div
                      className={
                        !sendDonation
                          ? 'time-category active-category'
                          : 'time-category'
                      }
                      onClick={this.handlesentDonation}
                    >
                      Received Donations
                    </div>
                  </div>
                </div>

                <div className='project-card'>
                  {sendDonation ? (
                    <>
                      <SentTransactions />
                    </>
                  ) : (
                    <ReceivedTransactions
                      getTotalAmount={this.getTotalAmount}
                    />
                  )}
                </div>
                {/* {totalRecords ? (
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
									)} */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(ProjectDonation);
