import React from 'react';
import { Link } from 'react-router-dom';
import SocialShare from '../SocialShare';

const DonateNow = (props) => {
  const { projectData } = props;
  let isStripeConnected =
    projectData.User && projectData.User.is_acc_updated && projectData.User.is_verified
      ? true
      : false;
  let isPaypalConnected = projectData.User && projectData.User.is_paypal_connected;
  return (
    <>
      {isStripeConnected || isPaypalConnected ? (
        <>
          <Link
            className="btn btn-donate-big"
            to={{
              pathname: `/money/${projectData.url}`,
              state: { project: projectData }
            }}>
            Sponsor Now
          </Link>
          <SocialShare projectData={projectData} />
        </>
      ) : (
        <div className="custom-tooltip-wrap">
          <div className="tooltip-inner">
            <div>
              This sponsor page will accept donations after the Sponsor Page-Creator has connected
              STRIPE or PayPAL.
            </div>
          </div>
          <div className="disabled-wrap">
            <button className="btn btn-donate-big donate-disbaled-btn" disabled>
              Sponsor Now
            </button>
            <SocialShare projectData={projectData} />
          </div>
        </div>
      )}
    </>
  );
};

export default DonateNow;
