import { UserContext } from 'contexts/UserContext';
import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router';

const DonateConfirm = (props) => {
  const user = useContext(UserContext);
  const history = useHistory();

  const {
    location: { state }
  } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log(state);
    console.log(user);
    if (!state || (state.userId && user && state.userId !== user.userId)) {
      history.replace('/404');
      return null;
    }
  }, [history, state, user]);

  return (
    <section className="payment-success-page margin50">
      <div className="container">
        <div className="row">
          <div className="thank-page-wrap">
            <div className="thank-page-section">
              <div className="thank-page-block-up">
                <div className="thank-page-img">
                  <img className="" src="/assets/img/icons/thank-page-icon.svg" alt="" />
                </div>
                <h1 className="thank-page-heading">Payment Successful!</h1>
              </div>
              <div className=" purchase-wrap">
                <div className="thankyou-content">
                  <div className="donation-amount">
                    Your donation amount of{' '}
                    <h2>${state && state.amount ? parseFloat(state.amount).toFixed(2) : 0.0}</h2>
                    <div className="success-massege">
                      to <span>{state && state.projectName}</span> was Successful.
                    </div>
                  </div>
                  <h4>This Contribution is going to make a big change.</h4>
                  <h4> Thank you for your support!</h4>
                </div>
                <div className="user-sent-info">
                  {state && state.userId ? (
                    <>
                      <div className="user-sent-info-heading">
                        A confirmation email has been sent to
                      </div>
                      <a
                        href={`mailto:${props.profileData.profileInfo.email}`}
                        className="user-sent-info-email">
                        {props.profileData.profileInfo.email}
                      </a>
                    </>
                  ) : null}
                  <div className="btn-contishop">
                    <a className="btn btn-donate-big" href="/">
                      Back To Home
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateConfirm;
