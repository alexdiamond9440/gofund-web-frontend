import React, { Component } from "react";

class ReadMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readMoreStatus: true,
    };
  }
  readMore = () => {
    this.setState({
      readMoreStatus: !this.state.readMoreStatus,
    });
  };
  textTruncate = ({ str, limit }) => {
    if (str && str.length >= limit) {
      let limitStr = str.substring(0, limit) + "...";
      return <p dangerouslySetInnerHTML={{ __html: limitStr }} />;
    } else {
      return <p dangerouslySetInnerHTML={{ __html: str }} />;
    }
  };
  render() {
    const { internDescription, limit } = this.props;
    const { readMoreStatus } = this.state;
    return (
      <div>
        {readMoreStatus
          ? this.textTruncate({ str: internDescription, limit })
          : this.textTruncate({ str: internDescription })}
        {internDescription.length >= limit ? (
          <button className='read-more-btn' onClick={this.readMore}>
            {readMoreStatus ? "Read More" : "Read Less"}
          </button>
        ) : null}
      </div>
    );
  }
}

export default ReadMore;
