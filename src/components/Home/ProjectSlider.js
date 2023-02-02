import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { frontUrl } from '../../constants';
import DonateNow from '../DonateSection/Donate-now';
import ProgressBarComponent from '../ProgressBar';
import Loader from '../Loader/index';
import './Home.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../containers/Dashboard/transation.css';
import 'react-circular-progressbar/dist/styles.css';
import ProjectItem from 'components/ProjectItem';

class ProjectSliderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const settings = {
      // nextArrow: <NextArrow />,
      // prevArrow: <PrevArrow />,
      dots: true,
      arrow: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      className: 'project-slider',
      autoplay: true,
      autoplaySpeed: 5000,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        },
        {
          breakpoint: 575,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    const { projects, heading, loading } = this.props;
    return (
      <div className="causes-section home-cases-section">
        <div className="container">
          <div className="project-card">
            {!loading ? (
              <>
                {projects && projects.length ? (
                  <>
                    <div className="section-title text-center active-project-wrap">
                      <h2 className="small-text-bg">{heading ? heading : 'Sponsor Pages'}</h2>
                    </div>
                    <Slider {...settings}>
                      {projects.map((project, index) => {
                        return (
                          <div className="project-slider-item" key={index}>
                            <ProjectItem project={project} />
                          </div>
                        );
                      })}
                      {/* </div> */}
                    </Slider>
                  </>
                ) : null}
              </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectSliderComponent;
