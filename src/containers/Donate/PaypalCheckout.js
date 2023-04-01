/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from 'components/Loader';

const options = {
  clientId: process.env.REACT_APP_PAYPAL_BUSINESS_CLIENT,
  merchantId: process.env.REACT_APP_PAYPAL_BUSINESS_MERCHANT_ID
};

const PaypalCheckout = (props) => {
  const { message, metadata, planId, isSubscription, onSuccessRedirect, isStripeConnected } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [merchantId, setMerchantId] = useState(null);

  useEffect(() => {
    if (typeof metadata.receiverId === 'undefined' || orderId) {
      return;
    }
    setIsLoading(true);
    (async () => {
      try {
        setIsLoading(false);
        const response = await axios.post('/payment/paypal/create-order', {
          ...metadata
        });

        console.log(response);
        setOrderId(response.data.data);
        setMerchantId(response.data.merchantId);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [metadata, orderId]);

  if (!isLoading && (!orderId || !merchantId || (!planId && isSubscription))) {
    return <PaypalDisabled message={message} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  const handleApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { orderID } = data;
      onSuccessRedirect(orderID);
    });
  };

  const handleCreateOrder = () => orderId;

  const handleApproveSubscription = (data, actions) => {
    return actions.subscription.get().then(async (details) => {
      const { subscriptionID, orderID } = data;
      const { custom_id: donationId } = details;

      await axios.post('/payment/paypal/update-subscription', {
        ...metadata,
        donationId,
        subscriptionID,
        orderID
      });
      onSuccessRedirect(subscriptionID);
    });
  };

  const handleCreateSubscription = (_, actions) => {
    return actions.subscription.create({
      plan_id: planId,
      quantity: metadata.amount,
      custom_id: orderId
    });
  };

  const buttonProps = isSubscription
    ? {
      options: { ...options, intent: 'subscription', vault: true },
      createSubscription: handleCreateSubscription,
      onApprove: handleApproveSubscription
    }
    : {
      options: { ...options, merchantId },
      createOrder: handleCreateOrder,
      onApprove: handleApprove
    };

  return (
    <>
      {isStripeConnected && (
        <div className="divider text-center mb-4 mt-4">
          <span>OR Donate via</span>
        </div>
      )}
      <div>
        <PayPalButton {...buttonProps} />
      </div>
    </>
  );
};

export const PaypalDisabled = ({ message }) => (
  <div className="custom-tooltip-wrap">
    <div className="text-center">
      <button className="paypal-disable-btn" disabled>
        <img src="/assets/img/paypal-img.svg" alt="Paypal" />
      </button>
    </div>
  </div>
);

export default PaypalCheckout;
