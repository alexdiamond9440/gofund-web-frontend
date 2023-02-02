import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getProfile } from './../../store/actions/ProfileInfo';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { contactusValidator } from '../../helpers/contactus';
import './style.css';

const donors_list = [
  {
    amount: `5,000,000`
  },
  {
    amount: `1,000,000`
  },
  {
    amount: `500,000`
  },
  {
    amount: `250,000`
  },
  {
    amount: `100,000`
  }
];

function SponsorPage(props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (!props.profileInfo.id) {
      setInput(() => ({
        name: '',
        email: '',
        message: ''
      }));
    } else if (props.profileInfo && props.profileInfo.id) {
      const { email, first_name, last_name } = props.profileInfo;
      setInput((prevInput) => ({
        ...prevInput,
        name: `${first_name} ${last_name}`,
        email: email
      }));
      setIsDisabled(true);
    }
  }, [props.profileInfo]);

  const handleChange = (e) => {
    const {
      target: { name, value }
    } = e;
    setInput((newInput) => ({ ...newInput, [name]: value }));
    setError((newError) => ({ ...newError, [name]: '' }));
  };

  const saveContact = async (e) => {
    e.preventDefault();

    const { formIsValid, errors } = contactusValidator(input);
    if (formIsValid) {
      try {
        setIsLoading(true);
        const response = await axios.post('/contact/create', {
          name: input.name,
          email: input.email,
          message: input.message,
          user_id: props.profileInfo.id
        });
        setIsLoading(false);
        if (response) {
          toastr.success('Success', 'Thank you for contacting us, We will Contact you soon');
          if (props.profileInfo && props.profileInfo.id) {
            setInput(() => ({ ...input, message: '' }));
          } else {
            setInput({
              name: '',
              email: '',
              message: ''
            });
          }
        }
      } catch (err) {
        if (err && err.response && err.response.data)
          toastr.error('Error', err.response.data.message);
        setIsLoading(false);
      }
    } else {
      setError(errors);
    }
  };

  return (
    <section className="main-section">
      <div style={{ position: 'relative' }}></div>
      <div className="container">
        <p className="sponsor-heading">Check Out Our Sponsors:</p>
        <p className="sponsor-heading">
          Simple Retro and GoFundHer Join Forces to Empower Female Entrepreneurs{' '}
        </p>
        <div className="youtube-video">
          <iframe
            className="embed-responsive-item"
            width={'100%'}
            height={'600px'}
            title={'video'}
            frameBorder="0"
            src={`https://www.youtube.com/embed/OSQ_LuosSqQ?autoplay=0&loop=0&mute=0&controls=0&enablejsapi=1`}
            allowFullScreen></iframe>
        </div>
        <p className="newyork-paragraph">
          New York, NY, May 2021 – New York City-based womenswear brand, Simple Retro, is pleased to
          announce its latest partnership with City Girls Big Dreams INC and GoFundHer.com, a
          digital financial platform empowering women to connect with sponsors worldwide to help
          turn their dreams into reality.{' '}
        </p>
        <p>
          On a mission to empower women, Simple Retro has teamed up with GoFundHer and City Girls
          Big Dreams INC to showcase the inspiring women on the platform through a campaign shot in
          New York City. A diverse group of eight women with bold ideas for the future are
          spotlighted in the campaign debuting the latest release from Simple Retro’s spring
          collection. Simple Retro will also be sponsoring ten of GoFundHer’s female leaders across
          the country, helping them to dress for success as they prepare to present their ideas to
          potential investors through the platform.{' '}
        </p>
        <div className="row">
          <div className="col-md-4 col-sm-4 img-block">
            <img src="assets/img/sponsor-imgs/img1.jpg" alt="gofundher-girls" />
          </div>
          <div className="col-md-4 col-sm-4 img-block">
            <img src="assets/img/sponsor-imgs/img2.jpg" alt="gofundher-girls" />
          </div>
          <div className="col-md-4 col-sm-4 img-block">
            <img src="assets/img/sponsor-imgs/img3.jpg" alt="gofundher-girls" />
          </div>
        </div>
        <p className="mission-para">
          With a shared mission to empower women and eliminate inequality, Simple Retro and
          GoFundHer will be hosting a virtual event on June 18th, 2021 to celebrate GoFundHer’s
          2-year anniversary. The event will take place on Zoom, inviting female entrepreneurs from
          across the country to connect and creating a supportive atmosphere for exchanging ideas
          for a brighter future. The event will be open to guests interested in supporting the
          GoFundHer campaigns, giving potential donors deeper insight into the visions these female
          leaders have and how they hope to use funds raised through the platform to build a better
          tomorrow.
        </p>
        <p>
          As a woman-owned business, Simple Retro seeks to empower women universally with an
          inclusive approach to design, offering timeless garments at an attainable price point.
          Aiming to create a wardrobe that allows for self-expression, Simple Retro strives to
          broaden their vision by incorporating diverse perspectives of women throughout the design
          process.
        </p>
        <p>
          “Real empowerment starts by enhancing the confidence of female entrepreneurs and this
          begins with the bank account,” says Tracy Garley, CEO of GoFundHer.com and founder of City
          Girls Big Dreams. “We believe the best way to support women-owned businesses is through
          direct deposit – if you believe in her, go fund her.”
        </p>
        <p>
          Those interested in joining the GoFundHer X CityGirlsBigDreams 2 Year Anniversary
          Celebration on June 18th 2021, can request access by RSVPing to Info@GoFundHer.com or
          visiting CityGirlsBigDreams.com.
        </p>
        <div>
          <img src="assets/img/sponsor-imgs/img4.jpg" className="mainimg" alt="gofundher-group" />
        </div>
        <p className="about-heading">About Simple Retro:</p>
        <p>
          On a mission to deliver fresh designs inspired by iconic vintage silhouettes, Simple Retro
          is a female-founded business launched in 2015 to bring some of the most sought after
          classic styles to women around the globe at an attainable price point. Seeking inspiration
          from decades passed, Simple Retro explores the history of fashion, carefully curating
          design concepts that revisit the most popular style periods with each weekly-released
          capsule collection.
        </p>
        <p>
          Simple Retro’s design ethos focuses on creating pieces that are effortless and which
          transcend seasonal trends, fitting seamlessly within any modern wardrobe. As a woman-owned
          brand, Simple Retro seeks to empower women universally with a deep commitment to a
          price-inclusive approach when creating the brand’s timeless designs.
        </p>
        <p className="text-center">
          For more information on Simple Retro, please visit{' '}
          <a className="more-info-link" href="https://www.simpleretro.com/">
            www.SimpleRetro.com
          </a>
          .
        </p>
        <p className="about-heading">About City Girls Big Dreams:</p>
        <p>
          City Girls Big Dreams is a holistic social networking platform designed to build up and
          validate girls and women. The platform was created to enlighten, empower, and inspire
          women’s dreams to come true. City Girls Big Dreams, in partnership with GoFundHer.com,
          combines the best of financial sponsorship with a powerful mentoring ecosystem. The sister
          organizations allow users gain knowledge and live more fulfilling, financially sound
          lives.
        </p>
        <p className="text-center more-info-text">
          For more information on City Girls Big Dreams, please visit{' '}
          <a className="more-info-link" href="http://www.citygirlsbigdreams.com/">
            {' '}
            www.CityGirlsBigDreams.com
          </a>
          .
        </p>
        <section id="contact-us">
          <div className="section-title text-center active-project-wrap">
            <h2 className="small-text-bg">Become a Yearly Sponsor</h2>
          </div>
          <form onSubmit={saveContact}>
            <div className="contact-wrapper">
              <div className="input-block form-group login-form-group">
                <input
                  className="form-control form-input"
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={input.name}
                  disabled={isDisabled}
                  onChange={handleChange}
                />
                <span className="form-icon">
                  <img src="/assets/img/partner/user.svg" alt="icon" />
                </span>
                {error && error.name ? <p className="text-danger">{error.name}</p> : null}
              </div>
              <div className="input-block form-group login-form-group">
                <input
                  className="form-control form-input"
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={input.email}
                  disabled={isDisabled}
                  onChange={handleChange}
                />
                <span className="form-icon">
                  <img src="/assets/img/partner/mail.svg" alt="icon" />
                </span>
                {error && error.email ? <p className="text-danger">{error.email}</p> : null}
              </div>
              <div className="input-block form-group login-form-group">
                <textarea
                  placeholder="Message"
                  className="form-control form-input"
                  cols="30"
                  rows="5"
                  name="message"
                  value={input.message}
                  onChange={handleChange}
                  maxLength={500}></textarea>
                {error && error.message ? <p className="text-danger">{error.message}</p> : null}
              </div>
              <div className="text-center">
                <button onClick={saveContact} className="btn btn-submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </form>
        </section>
        <section className="donors-wrapper">
          <div className="container w-900">
            {donors_list.length && donors_list
              ? donors_list.map((item, index) => <DonorListItem donor={item} />)
              : null}
          </div>
        </section>
      </div>
    </section>
  );
}

const DonorListItem = ({ donor }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleAmountClick = () => {
    setIsVisible((prevState) => !prevState);
  };
  const handleClick = () => {
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    const section = document.getElementById(`contact-us`);
    const scrollTo = section ? section.getBoundingClientRect().top + window.scrollY - 50 : 0;
    console.log(supportsNativeSmoothScroll, 'supportsNativeSmoothScroll');
    if (supportsNativeSmoothScroll) {
      window.scroll({
        top: scrollTo,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, scrollTo);
    }
  };

  return (
    <div className="donors-logo-wrap border-0">
      <h3 className="sponsor-heading donors-title" onClick={handleAmountClick}>
        ${donor.amount}+ <span>Yearly</span>
      </h3>
      <div className={`donors-contact text-center ${!isVisible && 'hidden'}`}>
        <span onClick={handleClick}>
          <i class="fas fa-chevron-right"></i> Contact Us
        </span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { profileInfo } = state.ProfileReducer;
  return {
    profileInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProfile: () => {
      dispatch(getProfile());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SponsorPage);
