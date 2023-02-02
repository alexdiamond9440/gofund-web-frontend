/** @format */

import React, { Component } from 'react';
import axios from 'axios';
import { Backend_url, regForUrl } from 'constants';
import { toastr } from 'react-redux-toastr';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import FullPageLoader from '../Dashboard/FullPageLoader';
import '../../../node_modules/croppie/croppie.css';
import { ImageCropper } from 'components/common/ImageCropper';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesData: [],
      featuredImg: '',
      thumbImage: null,
      isSubmitted: false,
      video: '',
      error: '',
      isLoading: false,
      originalImage: null,
      isFileUploaded: false,
      isCroppedImageUploading: false,
      isOriginalImageUploading: false,
      imageUrl: null
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.gallery !== prevProps.gallery) {
      this.getData();
    }
  };

  getData = () => {
    if (this.props.gallery !== '') {
      const { featuredImg, thumbImage, video } = this.props.gallery;
      this.setState({
        featuredImg,
        thumbImage,
        video
      });
    } else {
      this.setState({
        featuredImg: '',
        thumbImage: '',
        video: ''
      });
    }
  };

  setThumb = (event) => {
    const imgData = event.target.files[0];
    this.setState({ isSubmitted: true });
    const img = new Image();
    img.src = imgData ? URL.createObjectURL(imgData) : '';

    if (imgData.size > 20000000) {
      this.setState({
        imgError: 'Please upload sponsor page image less than 20MB'
      });
      return;
    }
    img.onerror = () => {
      this.setState({
        imgError: 'You can upload only images of type jpg, jpeg, png, gif, svg'
      });
    };
    img.onload = () => {
      this.setState({
        imgError: ''
      });
      this.setState({ isFileUploaded: true }, () => {
        const reader = new FileReader();
        const file = imgData;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.setState(() => ({ imageUrl: reader.result }));
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      });
      this.setState({
        originalImage: imgData
      });
    };
  };

  removeImage = (index) => {
    const imagesData = [...this.state.imagesData];
    imagesData.splice(index, 1);
    this.setState({ imagesData });
  };

  handleSave = (event) => {
    event.preventDefault();
    this.setState({ isSubmitted: true });
    const { featuredImg, thumbImage, video, error } = this.state;
    const gallery = {
      featuredImg,
      thumbImage,
      video
    };
    if (featuredImg && error === '') {
      this.setState({
        imgError: ''
      });
      this.props.handleChange(4, 'gallery', gallery);
    } else if (video && error !== '') {
      this.setState({
        error: 'Please enter valid url'
      });
    } else {
      this.setState({
        imgError: 'Please upload your sponsor page image'
      });
      return;
    }
  };

  handleImageCropped = async (formData) => {
    const { originalImage } = this.state;

    this.setState({
      featuredImg: '',
      isCroppedImageUploading: true,
      isOriginalImageUploading: true
    });

    const originalFormData = new FormData();
    originalFormData.append('file', originalImage);
    //To upload original image
    try {
      const response = await axios.post('/uploads/upload', originalFormData);
      this.setState(
        {
          featuredImg: response.data.data
        },
        () => {
          // To upload cropped image
          axios
            .post('/uploads/upload', formData)
            .then((response2) => {
              this.setState(
                {
                  thumbImage: response2.data.fileData.data,
                  isLoading: false,
                  isFileUploaded: false,
                  isCroppedImageUploading: false,
                  isOriginalImageUploading: false
                },
                () => console.log()
              );
            })
            .catch((err) => {
              let errorData = err.response ? err.response.data : err;
              toastr.error('Error', errorData.message);
              this.setState({
                featuredImg: '',
                thumbImage: '',
                isLoading: false,
                isCroppedImageUploading: false,
                isOriginalImageUploading: false
              });
            });
        }
      );
    } catch (err) {
      const errorData = err.response ? err.response.data : err;
      toastr.error('Error', errorData.message);
      this.setState({
        featuredImg: '',
        thumbImage: '',
        isLoading: false
      });
    }
  };

  handleVideoUrl = (event) => {
    const { name, value } = event.target;
    if (!regForUrl.test(value)) {
      this.setState({
        error: 'Please enter valid url.'
      });
    } else {
      this.setState({
        error: ''
      });
    }
    if (!value) {
      this.setState({
        error: ''
      });
    }
    this.setState({
      [name]: value
    });
  };

  handleCancelCropping = () => {
    this.setState({
      isLoading: false,
      isFileUploaded: false
    });
  };

  render() {
    const {
      imageUrl,
      imgError,
      error,
      video,
      isSubmitted,
      isLoading,
      thumbImage,
      isFileUploaded,
      isCroppedImageUploading,
      isOriginalImageUploading
    } = this.state;
    return (
      <div className="">
        <div className="rewads-heading text-center">
          <h2>Sponsor Page image and video</h2>
          <p>
            Add an image that clearly represents your sponsor page. Minimum image resolution size
            should be at least <span className="image-size-text">400 x 400.</span>
          </p>
        </div>
        <div className="col-sm-10 center-block">
          <form className="form-horizontal">
            <div className="form-group">
              <label className="col-md-4 control-label">Enter Video Url Link :</label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  name="video"
                  value={video}
                  placeholder="Ex. https://www.youtube.com/watch?v=ezMGod7tDAY"
                  onChange={this.handleVideoUrl}
                />
                {error ? <div className="text-danger">{error}</div> : ''}
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">
                Upload Image
                <span className="mandatory">*</span>
                <OverlayTrigger
                  overlay={<Tooltip id={'id'}>Image size should be minimum 400*400</Tooltip>}
                  placement="top">
                  <i className="fas fa-info-circle" />
                </OverlayTrigger>{' '}
                :
              </label>
              <div className="col-md-8 d-flex flex-column">
                <div className="fileinput fileinput-new" data-provides="fileinput">
                  <div className="fileinput-preview" data-trigger="fileinput">
                    {isLoading ? (
                      <FullPageLoader />
                    ) : (
                      <>
                        <label htmlFor={'imgUpload'}>
                          <i className={'fa fa-upload'}></i>
                          &nbsp; &nbsp;Upload Image
                        </label>
                        <input
                          className="imgUpload img_up"
                          name="image"
                          type="file"
                          accept="image/x-png,image/jpeg ,image/jpg, image/png ,image/svg"
                          onChange={this.setThumb}
                          ref={this.file}
                          id={'imgUpload'}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className={'image-upload-preview d-flex flex-row'}>
                  <div className={'thumbnail position-relative'}>
                    <img
                      className="upload-thumb-image"
                      id="upload-default-image"
                      src={
                        thumbImage ? `${Backend_url + thumbImage}` : '/assets/img/upload-image.png'
                      }
                      alt=""
                    />
                  </div>
                </div>
                {imgError && isSubmitted ? (
                  <div className="text-danger d-flex">{imgError}</div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </form>
          {isFileUploaded && (
            <ImageCropper
              loading={!isFileUploaded || isCroppedImageUploading || isOriginalImageUploading}
              imageUrl={imageUrl}
              onCropped={this.handleImageCropped}
              onCancel={this.handleCancelCropping}
            />
          )}
        </div>
        <div className="clearfix" />
        <div className="col-sm-10 center-block">
          <div className="form-actions form-btn-block text-center start-project-wrap">
            <button className="btn btn-back" type="submit" onClick={() => this.props.handleBack(3)}>
              Back
            </button>
            <button
              className="btn btn-donate-big"
              type="submit"
              onClick={this.handleSave}
              disabled={this.state.loading}>
              {this.state.loading ? 'Uploading image...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
