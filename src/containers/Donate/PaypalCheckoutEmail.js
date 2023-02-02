/** @format */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from 'components/Loader';

const options = {
  clientId: process.env.REACT_APP_PAYPAL_CLIENT,
  merchantId: process.env.REACT_APP_PAYPAL_MERCHANT_ID
};

const PaypalCheckoutEmail = (props) => {
  const { metadata, isSubscription, onSuccessRedirect, isStripeConnected, planId } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
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
        setOrderId(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [metadata, orderId]);

  if (!isLoading && (!orderId || (!planId && isSubscription))) {
    return null;
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
        options,
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

export const PaypalDisabled = () => (
  <div className="custom-tooltip-wrap pt-4">
    <div className="text-center">
      <button className="paypal-disable-btn" disabled>
        <img src="/assets/img/paypal-img.svg" alt="Paypal" />
      </button>
    </div>
  </div>
);

export default PaypalCheckoutEmail;
