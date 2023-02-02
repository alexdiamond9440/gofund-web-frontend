import React, { Component } from 'react';
import AutosizeInput from 'react-input-autosize';
import { Form } from 'react-bootstrap';
import './Project.css';
class SearchBlock extends Component {
  getTextWidth() {
    const text = document.getElementById('suggestion-tags');
    let width;
    text.style.font = 'times new roman';
    text.style.fontSize = 28 + 'px';
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = 'Hello World';
    width = Math.ceil(text.clientWidth);
    const formattedWidth = width + 35 + 'px';

    document.querySelector('.output').textContent = formattedWidth;
    document.body.removeChild(text);
  }
  render() {
    const { name, category, percentage, projectList } = this.props;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <div className="full-search-box">
          <div className="new-search-box">
            <label className={`search-label ${name ? 'd-none' : ''}`}>
              <i className="fas fa-search"></i>
            </label>
            <span
              className={` ${name ? 'refresh-icon' : 'd-none'}`}
              onClick={this.props.handleReset}>
              <i className="fas fa-undo-alt"></i>
            </span>&nbsp;&nbsp;&nbsp;
            <AutosizeInput
              className="search-input"
              id="suggestion-tags"
              name="name"
              value={name}
              type="text"
              placeholder="Search"
              onChange={this.props.handleChange}
            />
            {name ? (<div className="search-btn" onClick={this.props.handleSubmit}>Search</div>) : null}
          </div>
        </div>
        {projectList ? (
          <div className="select-wrap">
            <div className="new-select-box">
              <label htmlFor="categories" className="select-label">
                Category
              </label>
              <select
                name="category"
                value={category}
                onChange={this.props.handleChange}
                className="select-input">
                <option value="">All</option>
                <option value="Community">Community</option>
                <option value="Business">Business</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            <div className="new-select-box">
              <label htmlFor="percentage" className="select-label">
                % Funded
              </label>
              <select
                name="percentage"
                value={percentage}
                onChange={this.props.handleChange}
                className="select-input">
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="50%-75%">50% - 75%</option>
                <option value="75%-100%">75% - 100%</option>
                <option value="100%">Above 100% Funded</option>
              </select>
            </div>
          </div>
        ) : (
          ''
        )}
      </Form>
    );
  }
}

export default SearchBlock;
