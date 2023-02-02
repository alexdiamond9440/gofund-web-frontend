import { numberWithCommas } from 'helpers/numberWithCommas';
import { Link } from 'react-router-dom';
import './ProfileRewardListItem.scss';

export const ProfileRewardListItem = ({ reward, profileUrl }) => {
  return (
    <Link className="ProfileReward" to={`/sponsor/profile/${profileUrl}/${reward.id}`}>
      <h5 className="ProfileReward__subTitle">{reward.reward_title}</h5>
      <p className="ProfileReward__title">
        Sponsor ${numberWithCommas(reward.donate_amount)} or more
      </p>
      <p className="ProfileReward__description">{reward.reward_description}</p>
      <div className="ProfileReward__btn" type="button">
        Sponsor
      </div>
    </Link>
  );
};
