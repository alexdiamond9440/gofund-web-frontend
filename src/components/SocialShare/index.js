import React from 'react';
import { fbShareURL, frontUrl } from '../../constants';
import { isMobileOrTablet } from 'helpers/isMobileOrTablet';

const SocialShare = (props) => {
  const { projectData } = props;
  const { name, featured_image, url, punch_line } = projectData;
  const uri = `${frontUrl}/${url}`;
  const desc = punch_line ? punch_line.replace(new RegExp(/[ +!@#$%^&*().]/g), '_') : '';
  const image = featured_image ? `${[frontUrl, featured_image].join('').trim()}` : null;
  const title = name ? name.replace(new RegExp(/[ +!@#$%^&*().]/g), '_') : null;
  const URL = encodeURIComponent(
    `${fbShareURL}?title=${title}&description=${desc}&image=${image}&url=${uri}`
  );

  return (
    <div className="share-project ">
      <ul className="social-links clearfix">
        <li className="share-title">Share This:</li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.facebook.com/dialog/share?app_id=${process.env.REACT_APP_FACEBOOK_ID}&display=popup&href=${URL}`}>
            <img width="32px" src="/assets/img/icons/facebook-icon.svg" alt="facebook" />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://${isMobileOrTablet() ? 'api' : 'web'}.whatsapp.com/send?text=${URL}`}>
            <img width="32px" src="/assets/img/icons/whatsapp-icon.svg" alt="whatsapp" />
          </a>
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://twitter.com/share?url=${URL}`}>
            <img width="32px" src="/assets/img/icons/twitter-icon.svg" alt="twitter" />
          </a>
        </li>

        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.linkedin.com/shareArticle?url=${URL}`}>
            <img width="32px" src="/assets/img/icons/linkedin-icon.svg" alt="linkedin" />
          </a>
        </li>
      </ul>
    </div>
  );
};
export default SocialShare;
