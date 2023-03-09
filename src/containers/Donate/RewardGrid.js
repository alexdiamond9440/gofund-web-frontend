/** @format */

import { numberWithCommas } from 'helpers/numberWithCommas';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';

const RewardGrid = (props) => {
  const {
    isStripeConnected,
    isPaypalConnected,
    reward,
    rewardId,
    //amount,
    handleRecurring,
    oneTime,
    monthly,
    projectName,
    //payTip,
    //toggle,
    //totalAmount,
    //tipAmount,
    handleToggle,
    handleToggleForContactInfo,
    handlePayTip,
    //comment,
    //isInfoSharable
  } = props;

  useEffect(() => {
    if (reward.id) {
      const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      const section = document.getElementById(`reward_id${reward.id}`);
      const scrollTo = section ? section.getBoundingClientRect().top + window.scrollY : 0;
      if (supportsNativeSmoothScroll) {
        window.scroll({
          top: scrollTo,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, scrollTo);
      }
    }
  }, [reward]);
  let image;
  try {
    image = JSON.parse(reward.reward_image);
  } catch (error) {
    image = {};
  }

  return (
    <li className="reward-block">
      <div className="reward-inner-block">
        <div className="reward-check-btn">
          <input
            type="radio"
            id={'id_' + reward.id}
            name="rewardId"
            value={reward.id}
            onChange={props.handleChange}
            checked={rewardId === reward.id ? true : false}
          />
          <label htmlFor={'id_' + reward.id} />
        </div>
        <div className="reward-text-wrap" onClick={props.handleChange} id={`reward_id${rewardId}`}>
          <h1 className="reward-block-name">
            {reward.donate_amount ? (
              <div>
                Sponsor{' '}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(reward.donate_amount)}{' '}
                or more
              </div>
            ) : null}
          </h1>
          <h2>{reward.reward_title}</h2>
          <p>{reward.reward_description} </p>
          {image?.thumbnailImage && (
            <div className="reward-image-wrap text-center">
              <img
                className="img-fluid"
                src={`${process.env.REACT_APP_BACKEND_URL}/${image.thumbnailImage}`}
                alt={reward.reward_title}
              />
            </div>
          )}
          {reward.youtube_link && (
            <div className="embed-responsive embed-responsive-16by9 mt-3">
              <ReactPlayer
                style={{ position: 'absolute', top: 0, bottom: 0 }}
                width="100%"
                height="auto"
                url={reward.youtube_link}
                light
              />
            </div>
          )}
        </div>
        {rewardId === reward.id ? (
          <div className="pledge-amount-wrap">
            <div className=" all-inputs-with-tip-wrap">
              <div className="row">
                <div className="col-md-6">
                  <div className="all-inputs-wrap d-flex">
                    <button
                      className={`btn btn-one-time mt-0 ${reward.oneTime ? 'active' : ''}`}
                      onClick={() => handleRecurring(reward.id, 'oneTime')}>
                      One Time
                    </button>
                    <button
                      className={`btn btn-recurring mt-0 ${reward.monthly ? 'active' : ''}`}
                      onClick={() => handleRecurring(reward.id, 'monthly')}>
                      Monthly
                    </button>
                  </div>
                  {reward.oneTime && (
                    <>
                      <div className="pledge-amount-block half-input-wrap">
                        <div className="input-group">
                          <div className="input-group-addon">
                            <i className="fas fa-dollar-sign" />
                          </div>
                          <input
                            className={`form-control form-input ${parseInt(reward.amount) < parseInt(reward.donate_amount) || reward.amount === ''
                              ? 'error'
                              : ''
                              }`}
                            type="text"
                            name="amount"
                            value={reward.amount}
                            onChange={(e) => props.handleInputChange(reward.id, e)}
                          />
                        </div>
                      </div>
                      <div className="donate-comment sponsor-donate">
                        <textarea
                          className="form-control custom-textarea"
                          rows={4}
                          cols={50}
                          name="comment"
                          value={reward.comment}
                          placeholder="Send message to fundraiser(optional)"
                          onChange={(e) => props.handleInputChange(reward.id, e)}
                          maxLength={500}
                        />
                      </div>
                    </>
                  )}
                  {!reward.oneTime && (
                    <>
                      <div className="pledge-amount-block half-input-wrap">
                        <div className="input-group">
                          <div className="input-group-addon">
                            <i className="fas fa-dollar-sign" />
                          </div>
                          <input
                            className={`form-control form-input`}
                            type="text"
                            name="amount"
                            value={reward.amount}
                            onChange={(e) => props.handleInputChange(reward.id, e)}
                          />
                        </div>
                      </div>
                      <div className="donate-comment sponsor-donate">
                        <textarea
                          className="form-control custom-textarea"
                          rows={4}
                          cols={50}
                          name="comment"
                          value={reward.comment}
                          placeholder="Send message to fundraiser(optional)"
                          onChange={(e) => props.handleInputChange(reward.id, e)}
                          maxLength={500}
                        />
                      </div>{' '}
                    </>
                  )}
                  <div className="mt-1">
                    <div className="input-group tip-amount-wrap new-my mb-0">
                      <div className="input-group-prepend">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="toggle"
                            checked={reward.isInfoSharable}
                            onChange={(e) => handleToggleForContactInfo(reward.id, e)}
                          />
                          <span className="slider round slide-yes-no-wrap">
                            <span className="yes-field">Yes</span>
                            <span className="no-field">No</span>
                          </span>
                        </label>
                      </div>
                      <div className="input-group text-input-wrp info-toggle-text d-flex align-items-center">
                        Share your contact information with {projectName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <>
                    <div className="mt-1">
                      <div className="input-group tip-amount-wrap new-my">
                        <div className="input-group-prepend">
                          <label className="switch">
                            <input
                              type="checkbox"
                              name="toggle"
                              checked={reward.toggle}
                              onChange={(e) => handleToggle(reward.id, e)}
                            />
                            <span className="slider round slide-yes-no-wrap">
                              <span className="yes-field">Yes</span>
                              <span className="no-field">No</span>
                            </span>
                          </label>
                        </div>
                        <div className="input-group text-input-wrp info-toggle-text d-flex align-items-center">
                          Pay platform fee for {projectName}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`input-group select-tip-wrap mt-0 ${reward.toggle ? 'tip-select-wrap' : 'tip-select-hide-wrap'
                        }`}>
                      <select
                        name="payTip"
                        value={reward.payTip}
                        onChange={(e) => handlePayTip(reward.id, e)}
                        className="form-control">
                        <option value="5">Tip GoFundHer 0%</option>
                        <option value="10">Tip GoFundHer 5%</option>
                        <option value="20">Tip GoFundHer 15%</option>
                        <option value="35">Tip GoFundHer 30%</option>
                        <option value="50">Tip GoFundHer 45%</option>
                      </select>
                    </div>
                    <div className="pledge-amout-text-wrp 2">
                      <div className="text-center mt-4">
                        <div className="small-title m-b-3">
                          Sponsorship: ${numberWithCommas(Number(reward.amount).toFixed(2))}
                        </div>
                        <div className="small-title m-b-3">
                          {`Fee ${reward.payTip > 5 ? '+ Tip' : ''}`}: $
                          {numberWithCommas(reward.tipAmount.toFixed(2))}
                        </div>
                        <div className="amount-text-wrap amount-with-fee mb-0">
                          {reward.totalAmount > 0 && `Total: $${numberWithCommas(reward.totalAmount.toFixed(2))}`}
                        </div>
                      </div>
                      <div className="amount-note remove-m-top">
                        {reward.monthly && 'Note: This amount has been rounded off*'}
                      </div>
                      <div className="checkout-btn">
                        {!isStripeConnected && !isPaypalConnected && (
                          <div className="custom-tooltip-wrap">
                            <div className="tooltip-inner">
                              <div>
                                This project will accept donations after the Project-Creator has
                                connected STRIPE or PayPAL.
                              </div>
                            </div>
                            <div className="disabled-wrap">
                              <button
                                className="btn btn-donate-big btn-checkout w-100"
                                disabled={true}>
                                SPONSOR
                              </button>
                            </div>
                          </div>
                        )}
                        {(isStripeConnected || isPaypalConnected) && (
                          <button
                            className="btn btn-donate-big btn-checkout w-100"
                            onClick={(e) => props.makePledge(reward.id)}
                            disabled={
                              reward.oneTime
                                ? parseInt(reward.amount) < parseInt(reward.donate_amount) || reward.amount === ''
                                : parseInt(reward.amount) < parseInt(reward.donate_amount) || reward.amount === ''
                            }>
                            SPONSOR
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </li>
  );
};

export default RewardGrid;
