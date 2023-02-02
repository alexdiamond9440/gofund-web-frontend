import { Link } from 'react-router-dom';

export const PrivacyPolicyAccept = () => (
  <div className="pt-4">
    By continuing, you agree to the GoFundHer.com <Link to="/terms-of-use">terms</Link> and
    acknowledge receipt of our <Link to="/privacy-policy">privacy policy</Link>.
  </div>
);
