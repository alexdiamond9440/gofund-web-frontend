/** @format */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/lazy';

const youtubeFeedUrl = `https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=${process.env.REACT_APP_YOUTUBE_CHANNEL_ID}&maxResults=3&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;

const YouTubeFeeds = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    axios.get(youtubeFeedUrl).then((response) => {
      setFeeds(response.data.items);
    });
  }, []);

  return (
    <>
      {/* start intro section */}
      {feeds && feeds.length ? (
        <div className="insta-section ">
          <div className="container">
            <div className="section-title text-center">
              <h2 className="small-text-bg">YouTube Videos</h2>
            </div>
            <div className="row">
              {feeds.map((video, index) => {
                if (index < 4)
                  return (
                    <div
                      className="col-lg-4 col-md-4 col-sm-6 col-xs-12"
                      style={{ paddingTop: 20 }}
                      key={index}>
                      <div className="embed-responsive embed-responsive-16by9">
                        <ReactPlayer
                          style={{ position: 'absolute', top: 0, bottom: 0 }}
                          width="100%"
                          height="auto"
                          url={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                          light
                        />
                      </div>
                    </div>
                  );
                return true;
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default YouTubeFeeds;
