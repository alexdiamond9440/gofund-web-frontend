import React from "react";
import "react-circular-progressbar/dist/styles.css";
import ProgressBarComponent from "../../components/ProgressBar";

import DonateNow from "./Donate-now";

const DonateSection = (props) => {
  const { projectData } = props;

  return (
    <div className="widget sidebar-image">
      <div className="event-details-time">
        <div className="mobile-progress-bar">
          <span className="cause-count">
            <span className="donate-piechart tran3s">
              <ProgressBarComponent percentage={projectData.percentage} />
            </span>
          </span>
        </div>
        <div className="donate-calc-section">
          <span className="fund-raise-wrap rised">
            <span className="donate-r-heading">Raised</span>
            <span className="donate-r-amount" style={{ color: "black" }}>
              {" "}
              $
              {projectData.total_pledged
                ? new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(projectData.total_pledged)
                : "0.00"}
            </span>
          </span>
          <span className="cause-count desktop-progress-bar">
            <span className="donate-piechart tran3s">
              <ProgressBarComponent percentage={projectData.percentage} />
            </span>
          </span>
          <div className="fund-goal-wrap goal">
            <span className="donate-r-heading">Goal</span>
            <span className="donate-r-amount" style={{ color: "black" }}>
              {" "}
              $
              {projectData.amount
                ? new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(projectData.amount)
                : "0.00"}
            </span>
          </div>
        </div>
      </div>

      <div className="title" />

      <div className="event-details-button mt15">
        <DonateNow {...props} />
        {/* <div class="share-facebook-wrap detail-page-share">
                          <button
                            class="share-facebook-btn"
                            onClick={e => {
                              this.share(e, projectData);
                            }}
                          >
                            <span class="icon-wrap">
                              <i class="fab fa-facebook-f" />
                            </span>
                            <span class="text-wrap">Share On Facebook</span>
                          </button>
                        </div> */}
      </div>
    </div>
  );
};

export default DonateSection;
