import { frontUrl } from 'constants';
import { Link } from 'react-router-dom';
import './StartMyPage.scss';

export const StartMyPage = () => {
  return (
    <section className="StartMyPage">
      <h2 className="StartMyPage__title text-center">Find Monthly Sponsors</h2>
      <div className="StartMyPage__input-container">
        <span className="StartMyPage__domain">
          {frontUrl.replace('http://', '').replace('https://', '')}/
        </span>
        <input className="StartMyPage__input" placeholder="yourname" />
        <Link to="/join" className="StartMyPage__cta">
          Start my page
        </Link>
      </div>
      <Link to="/join" className="StartMyPage__cta is-mobile">
        Start my page
      </Link>
    </section>
  );
};
