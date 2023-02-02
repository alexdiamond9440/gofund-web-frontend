import React from 'react';
import moment from 'moment';
import ReactPlayer from 'react-player/lazy';
import { Backend_url } from 'constants';

const UpdatesSection = ({ updates, updatesCount, loadMoreUpdates }) => {
  return (
    <>
      <div className="update-list">
        {updates?.map((update, index) => {
          let image = null;
          try {
            image = JSON.parse(update.image);
          } catch (error) {}
          return (
            <div className="update-div" key={index}>
              <div className="update-date">{moment(update.date).format('lll')}</div>
              <span className="update-number">#{updatesCount - index}</span>
              {image && (
                <div className="text-center">
                  <img
                    width="100px"
                    src={`${Backend_url}/${image?.thumbnailImage}`}
                    alt="GoFundHer.com"
                  />
                </div>
              )}
              <br />
              <div
                dangerouslySetInnerHTML={{
                  __html: update.content
                }}
                className="update-desc clearfix"
              />
              <br />

              {update.youtube_link && (
                <div className="row">
                  <div className="col-xs-12 col-md-8 col-md-offset-2">
                    <div className="embed-responsive embed-responsive-16by9">
                      <ReactPlayer
                        style={{ position: 'absolute', top: 0, bottom: 0 }}
                        width="100%"
                        height="auto"
                        url={update.youtube_link}
                        light
                      />
                    </div>
                  </div>
                </div>
              )}
              <br />
            </div>
          );
        })}
      </div>
      {updates?.length < updatesCount ? (
        <div onClick={() => loadMoreUpdates()} className="text-center">
          <span className="read-more-btn">Load More</span>
        </div>
      ) : null}
    </>
  );
};

export default UpdatesSection;
