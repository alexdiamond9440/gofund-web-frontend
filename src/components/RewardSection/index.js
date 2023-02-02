import React from 'react';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
const { REACT_APP_BACKEND_URL } = process.env;

const RewardSection = (props) => {
  return props.rewards.map((reward, index) => {
    let image = null;
    try {
      if (reward.reward_image) {
        image = JSON.parse(reward.reward_image);
      }
    } catch (e) {}
    return (
      <li className="reward-block" key={index}>
        <div className="reward-inner-block" style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div>
            {image && (
              <Link
                to={{
                  pathname: `/money/${props.projectData.url}/${reward.id}`,
                  state: { project: props.projectData }
                }}>
                <img
                  width="100px"
                  style={{ borderRadius: 5 }}
                  src={`${REACT_APP_BACKEND_URL}/${image.thumbnailImage}`}
                  alt={reward.reward_title}
                />
              </Link>
            )}
          </div>
          <div className="reward-text-wrap default-cursor w-100">
            <Link
              className="d-flex justify-content-between"
              to={{
                pathname: `/money/${props.projectData.url}/${reward.id}`,
                state: { project: props.projectData }
              }}>
              <div className="position-relative">
                <h1 className="reward-block-name">Sponsor ${reward.donate_amount} or more</h1>
                <h2 className="mb-2">{reward.reward_title}</h2>
              </div>
              <div className="text-center sponsor-donate-btn align-items-center">
                <div className="btn btn-donate-big">Sponsor</div>{' '}
              </div>
            </Link>
            <p className="m-t-2">{reward.reward_description}</p>
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
        </div>
      </li>
    );
  });
};

export default RewardSection;
