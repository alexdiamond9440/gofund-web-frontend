import React from 'react';
import { Link } from 'react-router-dom';
import { frontUrl } from './../../constants';
import DonateNow from './../../components/DonateSection/Donate-now';
import './ProjectItem.scss';

export const ProjectItem = ({ project }) => {
  const receivedAmount = project.total_pledged
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(project.total_pledged)
    : '$0.00';
  const { first_name, last_name, profileUrl } = project.User;

  const percentage = project.percentage;
  return (
    <div className="ProjectItem">
      <Link to={`/${project.url}`}>
        <div
          className="ProjectItem__img"
          style={{
            backgroundImage: `url(${[frontUrl, project.thumbnail_image].join('').trim()})`
          }}
        />
      </Link>
      <div className="ProjectItem__content">
        <h5 className="ProjectItem__title">
          <Link to={`/${project.url}`}>{project.name}</Link>
        </h5>

        <p className="ProjectItem__punchline">
          {first_name && (
            <>
              By{' '}
              <Link to={`${profileUrl}`}>
                {first_name} {last_name}
              </Link>
              <br />
            </>
          )}
          {project.punch_line}
        </p>
      </div>
      <div className="ProjectItem__progress-container">
        <div className="clearfix">
          <strong className="font-bold">{receivedAmount}</strong>
          <small style={{ paddingLeft: 2 }}>USD raised</small>
          <span className="float-right">{Number(percentage).toFixed(0)}%</span>
        </div>
        <div className="progress" style={{ height: 10 }}>
          <div
            className="progress-bar progress-bar-success ProjectItem__progress-bar"
            role="progressbar"
            aria-valuenow="60"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <DonateNow projectData={project} />
      </div>
    </div>
  );
};
