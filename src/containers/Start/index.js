import React from 'react';
import axios from 'axios';
import Reward from './Reward';

class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: '',
      name: '',
      description: '',
      caption: '',
      category: 'Community',
      video: '',
      related_links: '',
      amount_to_raise: '',
      thumbnail: '',
      photos: [],
      photos_count: 0,
      terms: false,
      location: '',
      rewards: [
        {
          id: 1,
          donate_amount: null,
          delivery_date: null,
          reward_title: '',
          reward_description: ''
        }
      ],
      errors: {
        slug: '',
        name: '',
        description: '',
        caption: '',
        category: '',
        amount_to_raise: '',
        video: '',
        terms: '',
        thumbnail: ''
      }
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  setThumb = (event) => {
    let image;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (newEvent) => {
        image = newEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    let fileReader = new FileReader();
    fileReader = fileReader.readAsDataURL(event.target.files[0]);

    return;
    this.setState({
      thumbnail: image
    });
  };

  setPhotos = (img_url) => {
    let photos = this.state.photos.slice();
    photos[this.state.photos_count] = img_url.fileUrl;
    this.setState({
      photos,
      photos_count: this.state.photos_count + 1
    });
  };

  removePhoto = (img_url) => {
    let photos = this.state.photos.slice();
    let photos_count = this.state.photos_count || 0;
    const positon = photos.indexOf(img_url);
    if (positon !== -1) {
      photos.splice(positon, 1);
      this.setState({
        photos,
        photos_count: photos_count - 1
      });
    }
  };

  projectSubmit = (event) => {
    event.preventDefault();
    const projectData = {
      slug: this.state.slug,
      name: this.state.name,
      description: this.state.description,
      caption: this.state.caption,
      category: this.state.category,
      video: this.state.video,
      related_links: this.state.related_links,
      amount_to_raise: this.state.amount_to_raise,
      thumbnail: this.state.thumbnail,
      photos: this.state.photos,
      terms: this.state.terms,
      location: this.state.location
    };

    axios
      .post('projects', projectData)
      .then((response) => {})
      .catch((err) => {});
    return;
    this.props.submitNewProject(projectData, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="wrapper ">
        <div className="gray sp_container">
          <div className="container sp_content">
            <div className="sp_content_inner">
              <div className="sp_title1">START YOUR Sponsor PAGE</div>
              <div className="sp_title2">The time to make it happen is now!</div>

              <div className="sp_title3">
                After filling in the form below, you will be sent to your sponsor page in 'Off
                mode'. In 'Draft Mode' you will add the rewards for your backers, and can share the
                page with your friends to collect feedback and sharpen your sponsor page even more.
              </div>

              <div className="sp_title4 hidden">
                The information filled in below is not definitive, but remember that the more
                consistent you are in your sponsor page submission, the faster it will go live.
                <br />
                <br />
                <b>Important</b>: GoFundher is curated platform, which means that the founders of
                this site will evaluate the focus, the feasibility and consistency of your sponsor
                page during the Draft phase. If we believe that your sponsor page does not comply
                with our selection criteria, it may be refused.
              </div>
            </div>
          </div>
          <form onSubmit={this.projectSubmit}>
            <div className="container sp_content2">
              <div className="sp_content_inner">
                <div className="row">
                  <div className="col-md-4 sp_title5">
                    TYPE YOUR PREFERRED Sponsor PAGE URL / Sponsor PAGE NAME
                  </div>
                  <div className="col-md-8">
                    <div className="container_input">
                      <span>http://www.gofundher.com/</span>
                      <input
                        type="text"
                        className="form-control input_project_url"
                        name="slug"
                        onChange={this.handleInputChange}
                        value={this.state.slug}
                      />
                    </div>
                    {errors.slug && errors.slug.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">{errors.slug}</div>
                    ) : (
                      ''
                    )}
                    <div className="sp_title6">
                      Go simple. Your backers should be able to remember the URL to your sponsor
                      page. Try not to use underline, hyphens etc.
                    </div>
                  </div>
                </div>

                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor PAGE NAME</div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.name}
                      onChange={this.handleInputChange}
                      name="name"
                    />
                    {errors.name && errors.name.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">{errors.name}</div>
                    ) : (
                      ''
                    )}
                    <div className="sp_title6">
                      Be as objective as you can. Leave explanations for the About section. Do not
                      exceed 50 characters
                    </div>
                  </div>
                </div>

                <div className="row element_row">
                  <div className="col-md-4 sp_title5">
                    TELL US ABOUT YOUR Sponsor PAGE. HOW WILL YOU SPEND THE MONEY YOU WANT TO RAISE?
                  </div>
                  <div className="col-md-8">
                    <textarea
                      className="form-control element_textarea"
                      rows={10}
                      value={this.state.description}
                      onChange={this.handleInputChange}
                      name="description"
                    />
                    {errors.description && errors.description.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">
                        {errors.description}
                      </div>
                    ) : (
                      ''
                    )}
                    <div className="sp_title6">
                      Tell us about what inspired you to come up with this sponsor page. Be
                      objective and charming, present your readers with something that moves them
                      while being very transparent over the expectations on your sponsor page! Don't
                      make it too long! Give links so people can know more about your work.
                    </div>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor PAGE CAPTION</div>
                  <div className="col-md-8">
                    <textarea
                      type="text"
                      className="form-control element_textarea"
                      rows={10}
                      value={this.state.caption}
                      onChange={this.handleInputChange}
                      name="caption"
                    />
                    {errors.caption && errors.caption.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">{errors.caption}</div>
                    ) : (
                      ''
                    )}
                    <div className="sp_title6">
                      Summarize your sponsor page in 140 characters. This sentence will be the first
                      contact people will have with your sponsor page, before even seeing the video.
                      Be creative, clear and direct.
                    </div>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor PAGE CATEGORY</div>
                  <div className="col-md-8">
                    <select
                      className="form-control"
                      onChange={this.handleInputChange}
                      name="category"
                      value={this.state.category}>
                      <option value="Community">Community</option>
                      <option value="Business">Business</option>
                      <option value="Personal">Personal/Creative</option>
                    </select>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">HOW MUCH DO YOU INTEND TO RAISE?</div>
                  <div className="col-md-8">
                    <div className="container_input">
                      <span>$</span>
                      <input
                        className="form-control input_intend_raise"
                        type="text"
                        onChange={this.handleInputChange}
                        name="amount_to_raise"
                        value={this.state.amount_to_raise}
                      />
                      {errors.amount_to_raise && errors.amount_to_raise.length > 0 ? (
                        <div className="alert alert-danger in row_margin_sm">
                          {errors.amount_to_raise}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">VIDEO</div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      onChange={this.handleInputChange}
                      name="video"
                      value={this.state.video}
                    />
                    {errors.video && errors.video.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">{errors.video}</div>
                    ) : (
                      ''
                    )}
                    <div className="sp_title6">
                      Paste the URL from a <a href="#">Vimeo</a> video. We recommend Vimeo because
                      it looks better and doesn't have ads. This way, your project will look better
                      too! Produce your video the best you can and make a video specifically for
                      your campaign. If there is a single thing that differentiates the sponsor page
                      that reach the goal from the others is the video.
                    </div>
                  </div>
                </div>

                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor PAGE THUMBNAIL</div>
                  <div>
                    <div className="image-upload-wrap">
                      <input
                        type="file"
                        className="form-control file-upload-input"
                        id="single_file_to_upload"
                        onChange={this.setThumb}
                      />
                    </div>
                    <div className="image-upload-footer">
                      <a
                        href="#"
                        className="btn btn-danger remove_field btn-xs"
                        data-dismiss="fileinput"
                        title="Delete"
                        onClick={this.removeThumb}>
                        <i className="fa fa-trash-o" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor PAGE PHOTO(S)</div>
                  <input
                    type="file"
                    name="thumbnail"
                    value={this.state.photos}
                    onChange={this.setPhotos}
                  />
                </div>
                <div className="row">
                  <div className="col-md-4 sp_title5 element_row">
                    BACKER REWARDS
                    <div className="sp_title6">
                      Businesses & organizations will fund your sponsor page at a higher rate if you
                      offer “thank you!” videos as perks/rewards.
                    </div>
                  </div>
                  <div className="col-md-8">
                    <Reward heading="Sponsor Rewards" />
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5">Sponsor Page Location</div>
                  <div className="col-md-8">
                    <input
                      type="text"
                      onChange={this.handleInputChange}
                      name="location"
                      value={this.state.location}
                      className="form-control"
                    />
                    <div className="sp_title6">
                      Enter sponsor page location: Zipcode , city , or state
                    </div>
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-4 sp_title5" />
                  <div className="col-md-offset-4 col-md-8">
                    <span className="text-gray remember">
                      <label className="sp_title7">
                        <input
                          type="checkbox"
                          name="checkbox"
                          value={this.state.terms}
                          onChange={this.handleInputChange}
                          name="terms"
                        />
                        I have read and accepted the{' '}
                        <a href="/terms-use" target="_blank">
                          <span className="">terms of use.</span>
                        </a>
                      </label>
                    </span>
                    {errors.terms && errors.terms.length > 0 ? (
                      <div className="alert alert-danger in row_margin_sm">{errors.terms}</div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="row element_row">
                  <div className="col-md-offset-4 col-md-8 text_left">
                    <button type="submit" className="btn btn-4 dark_blue btn_submit">
                      SUBMIT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="container sp_footer">
            <div className="row">
              <div className="col-md-4 sp_title8 element_center">QUESTIONS?</div>
              <div className="col-md-5 sp_title9 element_center">
                View Endless Crowds Help center to aid your sponsor page.
              </div>
              <div className="col-md-3 element_center">
                <a
                  href="https://endlesscrowds.zendesk.com/hc/en-us"
                  target="_blank"
                  className="btn btn-4 light_white"
                  rel="noreferrer">
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// Start.propTypes = {
// 	submitNewProject: PropTypes.func.isRequired,
// 	auth: PropTypes.object.isRequired,
// 	errors: PropTypes.object.isRequired,
// };

export default Start;
