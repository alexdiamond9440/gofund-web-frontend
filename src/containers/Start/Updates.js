import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import JoditEditor from 'jodit-react';
import { config } from './editorConfig';
import axios from 'axios';
import { regForUrl } from 'constants';

const { REACT_APP_BACKEND_URL } = process.env;

const EMPTY_UPDATE = {
  content: '',
  image: '{}',
  youtube_link: '',
  date: new Date()
};
class Updates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadingImage: false,
      updates: [EMPTY_UPDATE],
      errors: {},
      removedUpdates: []
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.updates !== prevProps.updates && this.props.updates) {
      this.getData();
    }
  };

  getData = () => {
    const { updates } = this.props;
    if (updates && updates.length) {
      this.setState({
        updates
      });
    } else {
      this.setState({
        updates: [EMPTY_UPDATE]
      });
    }
  };

  componentDidMount = () => {
    this.getData();
  };

  handleUpdateChange = (index, value) => {
    const { updates } = this.state;
    // To manage onchange that triggers on updates state changes
    if (updates[index] && updates[index].isupdatedFirst) {
      updates[index].isupdatedFirst = false;
    } else {
      updates[index].content = value;
      updates[index].date = new Date();
    }

    this.setState(() => ({ updates }));
  };

  uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      this.setState(() => ({ uploadingImage: true }));
      const response = await axios.post('/uploads/upload', formData);
      const {
        data: { fileData }
      } = response;
      return JSON.stringify({
        id: fileData.id,
        thumbnailImage: fileData.data,
        originalImage: fileData.data
      });
    } catch (error) {
      console.error('Error while uploading image', error);
      return null;
    } finally {
      this.setState(() => ({ uploadingImage: false }));
    }
  };

  handleInputChange = async (index, event) => {
    let { name, value } = event.target;
    const { updates, errors } = this.state;
    const list = [...updates];
    if (name === 'youtube_link') {
      const valid = regForUrl.test(String(value)) || !String(value);
      if (!valid) {
        this.setState(() => ({
          errors: {
            ...errors,
            [index]: { ...errors[index], [name]: 'Please enter a valid youtube link' }
          }
        }));
      } else {
        this.setState(() => ({
          errors: { ...errors, [index]: { ...errors[index], [name]: null } }
        }));
      }
    }
    if (name === 'image_file') {
      name = 'image';
      value = await this.uploadImage(event.target.files[0]);
    }

    list[index][name] = value;
    this.setState({
      updates: [...list]
    });
  };

  addUpdate = () => {
    this.setState((prevState) => {
      return {
        updates: [...prevState.updates, EMPTY_UPDATE]
      };
    });
  };

  removeUpdate = (index, id) => {
    const { updates } = this.state;
    let temp = updates
      .filter((_, i) => index !== i)
      .map((item) => ({
        ...item,
        isupdatedFirst: true // To manage date in handlechnage in this case
      }));
    this.setState({
      updates: temp
    });
    if (id) {
      this.setState({
        removedUpdates: [...this.state.removedUpdates, id]
      });
    }
  };

  confirmBox = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit the sponsor page!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    }).then((result) => {
      if (result.value) {
        this.props.handleSubmit();
        if (this.props.toastError) {
          toastr.success('Your sponsor page has been submitted successfully');
        }
        if (!this.props.isEditable && this.props.toastError === 'true') {
          toastr.success('Your sponsor page has been submitted successfully');
        }
      }
    });
  };

  handleSave = (event) => {
    event.preventDefault();
    const { updates, removedUpdates, errors } = this.state;
    // find all errors with property value of null in errors object
    const errorList = Object.values(errors).reduce((acc, next) => {
      return [...acc, ...Object.values(next).filter((i) => i !== null)];
    }, []);
    if (errorList.length > 0) {
      return;
    } else {
      this.props.handleChange(6, 'updates', { updates, removedUpdates });
      this.confirmBox();
    }
  };

  handleSkip = () => {
    const { updates } = this.props;
    this.props.handleChange(6, 'updates', { updates: updates ? updates : '' });
    this.confirmBox();
  };

  render() {
    const { updates, errors, uploadingImage } = this.state;
    const { loading } = this.props;
    return (
      <div>
        <div className="rewads-heading text-center">
          <h2>Updates</h2>
          <p>Posting updates sends an email to all of your sponsors!</p>
        </div>
        <div className="faq-points-wrapper">
          {updates?.map((item, index) => {
            return (
              <div className="faq-tile" key={index}>
                <div className="col-sm-8 center-block">
                  <form autoComplete="off" className="form-horizontal">
                    <div className="form-group">
                      <label className="col-md-4 control-label update-label">
                        Youtube video link
                      </label>
                      <div className="col-md-8">
                        <div className="">
                          <input
                            placeholder="https://www.youtube.com/watch?v=gleHGzbEvmo"
                            className="form-control form-input"
                            name="youtube_link"
                            value={String(item.youtube_link ?? '')}
                            onChange={(e) => this.handleInputChange(index, e)}
                          />
                        </div>
                        {errors?.[index]?.youtube_link && (
                          <div className="text-danger">{errors?.[index]?.youtube_link}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-4 control-label update-label">Add Image</label>
                      <div className="col-md-8">
                        {uploadingImage && <i className="fa fa-spinner fa-spin" />}
                        {!uploadingImage && item.image ? (
                          <img
                            height="50px"
                            src={`${REACT_APP_BACKEND_URL}/${
                              JSON.parse(item.image)?.thumbnailImage
                            }`}
                            alt={item.reward_title}
                          />
                        ) : (
                          ''
                        )}
                        <div className="">
                          <input name="image" type="hidden" defaultValue={item.image} />
                          <input
                            name="image_file"
                            className="form-control form-input"
                            onChange={(e) => this.handleInputChange(index, e)}
                            type="file"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-12 control-label update-label">
                        Content
                        <span className="mandatory">*</span>:
                      </label>
                      <div className="col-md-12">
                        <JoditEditor
                          config={config}
                          value={item.content}
                          tabIndex={1} // tabIndex of textarea
                          onChange={(content) => {
                            this.handleUpdateChange(index, content);
                          }}
                        />
                        {errors?.[index]?.content ? (
                          <div className="text-danger">Enter some content here..</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="fix-right-item">
                  <div className="add-more-reward-wrap ">
                    <OverlayTrigger
                      overlay={<Tooltip id={`tooltip`}>Add Another Update</Tooltip>}
                      placement="left">
                      <span className="btn_add_reward element_row" onClick={this.addUpdate}>
                        <i className="fas fa-plus" />
                      </span>
                    </OverlayTrigger>
                    {updates?.length > 1 ? (
                      <OverlayTrigger
                        overlay={<Tooltip id={`tooltip`}>Delete Update</Tooltip>}
                        placement="left">
                        <span
                          className="remove-reward-fields"
                          onClick={() => this.removeUpdate(index, item.id)}>
                          <i className="far fa-trash-alt" />
                        </span>
                      </OverlayTrigger>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="form-actions form-btn-block text-center reward-btn-block">
          <button className="btn btn-back" type="submit" onClick={() => this.props.handleBack(4)}>
            Back
          </button>
          <button className="btn btn-skip" type="submit" onClick={this.handleSkip}>
            Skip & Update
          </button>
          <button className="btn btn-donate-big" type="submit" onClick={this.handleSave}>
            {loading ? <i className="fa fa-spinner fa-spin" /> : 'Save & Update'}
          </button>
        </div>
      </div>
    );
  }
}

export default Updates;
