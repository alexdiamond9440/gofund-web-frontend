import { useState } from 'react';
import axios from 'axios';

export const PaypalOnboarding = ({ status }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const {
        data: { links }
      } = await axios.post('/payment/paypal/create-onboarding-link');
      const actionUrl = links.find((link) => link.rel === 'action_url');
      if (actionUrl) {
        window.location.href = actionUrl.href;
      }
    } catch (error) {
      setIsLoading(false);
      setIsErrored(false);
    }
  };

  if (status === 'ACTIVE') {
    return null;
  }

  return (
    <div>
      <div className="connect-onboard">
        <p className="verification-note">
          In order to enable payments and payouts please connect to Paypal.
        </p>
        <div className="connect-section">
          <button
            className="connectBtn is-paypal"
            onClick={handleGenerateLink}
            disabled={isLoading}>
            {isLoading ? 'Loading....' : 'Connect Paypal'}
          </button>
        </div>
        {isErrored && (
          <div className="text-danger">
            An error occurred while connecting to Paypal. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};
