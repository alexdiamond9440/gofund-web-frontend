import React, { Component } from "react";
import { Link } from "react-router-dom";

class ThankYou extends Component {
  render() {
    return (
      <div className="start-wrapper theme-background">
        
          {/* <div className='section-title text-center'>
						<h2>
							Start Your <span className='small-text-bg'>Project</span>
						</h2>
						<h3>The time to make it happen is now!</h3>
						<p>
							After filling in the form below, you will be sent to your project
							page in 'Draft mode'. In 'Draft Mode' you will add the rewards for
							your backers, <br />
							and can share the page with your friends to collect feedback and
							sharpen your project even more.
						</p>
					</div> */}
          <div className="row">
            <div className="col-sm-12 start-tabs-wrap">
              <div className="common-tab-wrapper">
                <div className="tab-content">
                  <div className="text-center tab-thankyou">
                    <div>
                      <img
                        src="/assets/img/checked-mark.svg"
                        width="50px"
                        alt=""
                      />
                      <h4>Thank you, For creating Projects on our Platform</h4>
                      <p>
                        You have completed all the previous steps successfully.
                      </p>
                      <p>
                        To check your project{" "}
                        <Link to={`/${this.props.url}`}>Click Here.</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       
      </div>
    );
  }
}

export default ThankYou;
