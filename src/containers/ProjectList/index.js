/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import * as queryString from 'query-string';
import ProjectDetail from '../ProjectDetail';
import Loader from '../../components/Loader';
import SearchBlock from './SearchBlock';
import Pagination from './../Pagination';
import 'react-circular-progressbar/dist/styles.css';
import ProjectItem from 'components/ProjectItem';

class ProjectList extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      category: '',
      username: '',
      name: '',
      percentage: '',
      loading: true,
      totalRecords: 0,
      currentPage: 1,
      pageLimit: 9,
      pageNeighbors: 1,
      changeData: ''
    };
  }
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  componentDidMount() {
    this.handleQueryParam();
  }
  handleQueryParam = () => {
    const parsed = queryString.parse(this.props.location.search);
    let page = '';
    let name = '';
    let category = '';
    let percentage = '';
    if (parsed) {
      page = parsed.page ? parseInt(parsed.page) : 1;
      name = parsed.search ? parsed.search : '';
      category = parsed.category ? parsed.category : '';
      percentage = parsed.percentage ? parsed.percentage : '';
    }
    if (isNaN(parsed.page)) {
      this.setState({ currentPage: 1 });
    }
    this.setState(
      {
        page,
        name,
        percentage,
        category,
        currentPage: page
      },
      () => this.getProjects()
    );
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.search !== this.props.location.search) {
      this.handleQueryParam();
    }
  };
  handleReset = () => {
    const parsed = queryString.parse(this.props.location.search);
    if (parsed) {
      this.props.history.push('/search');
      this.setState({
        category: '',
        name: '',
        percentage: '',
        username: '',
        currentPage: 1
      });
    } else {
      this.setState({
        name: ''
      });
    }
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, changeData: event.target.value.length }, () =>
      name === 'category' || name === 'percentage' ? this.handleSubmit() : ''
    );
  };

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    const myInputBox = document.getElementById('suggestion-tags');
    if (myInputBox) {
      myInputBox.blur();
    }
    let data = {};
    const { category, name, percentage } = this.state;
    if (name) {
      data.search = name;
    }
    if (category) {
      data.category = category;
    }
    if (percentage) {
      data.percentage = percentage;
    }
    let url = queryString.stringify(data);
    this.props.history.push(`/search?${url}&page=1`);
  };

  renderProject = (projectId) => {
    return <ProjectDetail projectId={projectId} />;
  };

  getProjects = () => {
    const { pageLimit, name, category, percentage, currentPage } = this.state;
    this.setState({
      loading: true
    });
    axios
      .get(
        `/projects/get_project?page=${currentPage}&limit=${pageLimit}&name=${name}&category=${category}&percentage=${percentage}`
      )
      .then((response) => {
        this.setState({
          projects: response.data.data.rows,
          totalRecords: response.data.data.count,
          loading: false
        });
      })
      .catch((err) => {
        this.setState({
          loading: false
        });
      });
  };
  handleClick = (page) => {
    this.setState({ page }, () => {
      this.getProjects();
    });
  };
  onPageChanged = async (data) => {
    const { currentPage } = data;

    const { location } = this.props;
    const { search, pathname } = location;
    const query = queryString.parse(search);
    if (currentPage !== this.state.currentPage) {
      this.props.history.push(
        [pathname, queryString.stringify({ ...query, page: currentPage })].join('?')
      );
    }
  };

  onUserProfile = (profileUrl) => {
    this.props.history.push(`/${profileUrl}`);
  };

  render() {
    const {
      projects,
      loading,
      totalRecords,
      currentPage,
      pageLimit,
      pageNeighbors,
      category,
      username,
      name,
      percentage,
      changeData
    } = this.state;

    return (
      <div>
        <div className="page-causes-section project-find-wrap">
          <div className="section-title text-center">
            <h2>
              <span className="small-text-bg">Support Girls & Women Now</span>
            </h2>
          </div>
          <SearchBlock
            category={category}
            name={name}
            percentage={percentage}
            username={username}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            handleReset={this.handleReset}
            changedata={changeData}
            projectList={true}
          />
          <div className="container">
            <div className="row justify-content-md-center row-project-list ">
              {projects?.map((project) => {
                return (
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12" key={project.id}>
                    <ProjectItem project={project} key={project.id} />
                  </div>
                );
              })}
              {!loading && projects.length === 0 && (
                <div className="empty-search-section">
                  <div className="empty-img">
                    <img src="/assets/img/no-search-found.svg" alt="" />
                  </div>
                  <div className="text-center">
                    {name || category || percentage ? (
                      <p>No sponsor page available related to your search.</p>
                    ) : (
                      <p>No sponsor page available.</p>
                    )}
                  </div>
                </div>
              )}
              {loading && <Loader />}
            </div>
            <div className="pagination-area">
              {totalRecords > 0 && (
                <Pagination
                  totalRecords={totalRecords}
                  currentPage={currentPage}
                  pageLimit={pageLimit}
                  pageNeighbours={pageNeighbors}
                  onPageChanged={this.onPageChanged}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectList;
