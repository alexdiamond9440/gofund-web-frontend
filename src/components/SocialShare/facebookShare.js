import React, { Component } from "react";
import { fbShareURL, frontUrl } from "../../constants";
class FacebookShare extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  share = e => {
    e.preventDefault();
    const { projectData } = this.props;
    const { name, featured_image, url, punch_line } = projectData;
    const uri = `${frontUrl}/${url}`;
    const desc = punch_line
      ? punch_line.replace(new RegExp(/[ +#]/g), '_')
      : "";
    const image = `${[frontUrl, featured_image].join("").trim()}`;
    const title = name.replace(new RegExp(/[ +#]/g), '_');
    const URL = encodeURIComponent(
      `${fbShareURL}?title=${title}&description=${desc}&image=${image}&url=${uri}`
    );
    window.open(
      `https://www.facebook.com/dialog/share?app_id=940608772955423&display=popup&href=${URL}`
    );
  };

  render() {
    return (
      <div className="share-facebook-wrap list-page-wrap">
        <div className="share-facebook-wrap detail-page-share">
          <button
            className="share-facebook-btn"
            onClick={e => {
              this.share(e);
            }}
          >
            <span className="icon-wrap">
              <i className="fab fa-facebook-f" />
            </span>
            <span className="text-wrap">Share On Facebook</span>
          </button>
        </div>
      </div>
    );
  }
}

export default FacebookShare;
