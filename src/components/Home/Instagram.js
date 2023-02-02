/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import { instaFeedUserName } from '../../constants';
const scrapePostData = function(post) {
  var scrapedData = {
    media_id: post.node.id,
    shortcode: post.node.shortcode,
    text:
      post.node.edge_media_to_caption.edges[0] &&
      post.node.edge_media_to_caption.edges[0].node.text,
    comment_count: post.node.edge_media_to_comment.count,
    like_count: post.node.edge_liked_by.count,
    display_url: post.node.display_url,
    owner_id: post.node.owner.id,
    date: post.node.taken_at_timestamp,
    thumbnail: post.node.thumbnail_src,
    thumbnail_resource: post.node.thumbnail_resources,
    is_video: post.node.is_video,
  };

  if (post.node.is_video) {
    scrapedData.video_view_count = post.node.video_view_count;
  }

  return scrapedData;
};

class InstagramPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instagramPost: [],
    };
  }

  componentDidMount = async () => {
    axios.get(`/fetch-instagram-feed`).then(response => {
      if (response) {
        let regex = /_sharedData = ({.*);<\/script>/m;
        let temp = regex.exec(response.data.data);
        if (temp && temp.length) {
          let json = JSON.parse(regex.exec(response.data.data)[1]);
          if (
            json.entry_data &&
            json.entry_data.ProfilePage &&
            json.entry_data.ProfilePage[0]
          ) {
            var medias = [];
            let edges =
              json.entry_data.ProfilePage[0].graphql.user
                .edge_owner_to_timeline_media.edges;
            edges.forEach(post => {
              if (
                post.node.__typename === 'GraphImage' ||
                post.node.__typename === 'GraphSidecar' ||
                post.node.__typename === 'GraphVideo'
              ) {
                medias.push(scrapePostData(post));
              }
            });
            this.setState({ instagramPost: medias });
          }
        }
      }
    });
  };
  render() {
    const { instagramPost } = this.state;
    return (
      <>
        {/* start intro section */}
        {instagramPost && instagramPost.length ? (
          <div className='insta-section '>
            <div className='container'>
              <div className='section-title text-center'>
                <h2 className='small-text-bg'>Instagram</h2>
              </div>
              <div className='row'>
                {instagramPost.map((value, index) => {
                  if (index < 4)
                    return (
                      <div
                        className='col-lg-3 col-md-3 col-sm-6 col-xs-12'
                        key={index}
                      >
                        <a
                          href={`https://www.instagram.com/p/${value.shortcode}/`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <div className='instagram-post'>
                            <img src={value.display_url} alt='' className='' />
                            <span className='insta-icon'>
                              <i
                                className='fab fa-instagram'
                                aria-hidden='true'
                              />
                            </span>
                          </div>
                        </a>
                      </div>
                    );
                  return true;
                })}
              </div>
              <div className='text-center'>
                <a
                  href={`https://www.instagram.com/${instaFeedUserName}/`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='insta-link'
                >
                  <i className='fab fa-instagram' aria-hidden='true'></i>Follow
                  GoFundHer on Instagram
                </a>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
export default InstagramPost;
