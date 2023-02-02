import React, { Component } from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Backend_url, frontUrl } from "./../../constants";

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesData: [],
      featuredImg: "",
      isSubmitted: false,
      video_url: "",
      error: ""
    };
  }
  setThumb = event => {
    const file = new FormData();
    file.append("file", event.target.files[0]);

    axios
      .post("/uploads/upload", file)
      .then(response => {
        this.setState({
          featuredImg: response.data.data
        });
      })
      .catch(err => {});
    return;
    let image;
    // if (event.target.files && event.target.files[0]) {
    // 	console.log(event.target.files[0])
    // 	const img = formData.append('dhjfhfg',event.target.files[0]);
    // 	console.log(img);
    // 	const reader = new FileReader();
    // 	reader.onload = (newEvent) => {
    // 		console.log(newEvent.target);
    // 		console.log(newEvent.target.result);
    // 		image = newEvent.target.result
    // 	};
    // 	const data = reader.readAsDataURL(event.target.files[0]);
    // 	console.log(data);
    // }
    // return;
    // let fileReader = new FileReader();
    // fileReader = fileReader.readAsDataURL(event.target.files[0]);
    // return;
    // this.setState({
    // 	thumbnail: image,
    // });
  };
  // onDrop = (acceptedFiles, rejectedFiles) => {
  // 	const _this = this
  // 	const imgs = [..._this.state.imagesData];
  // 	acceptedFiles.forEach((file, index) => {
  // 		const reader = new FileReader();
  // 		imgs.push({
  // 			src: URL.createObjectURL(file),
  // 			name:file.name,
  // 			isFeaturedImage: false
  // 		});
  // 		reader.onload = (newEvent) => {
  // 			console.log(newEvent.target.result);
  // 		};
  // 		if (imgs.length) {
  // 			imgs[0].isFeaturedImage = true;
  // 		}
  // 		if (acceptedFiles.length - 1 === index) {
  // 			reader.readAsDataURL(file);
  // 			_this.setState({
  // 				imagesData: imgs,
  // 				featuredImg:imgs[0].name
  // 			})
  // 		}
  // 	});
  // }
  removeImage = index => {
    const imagesData = [...this.state.imagesData];
    imagesData.splice(index, 1);
    this.setState({ imagesData });
  };
  handleInputChange = (index, img) => {
    const imagesData = [...this.state.imagesData];
    imagesData[index].isFeaturedImage = !imagesData[index].isFeaturedImage;
    setTimeout(() => {
      this.setState({
        imagesData,
        featuredImg: img.name
      });
    }, 500);
  };
  handleSave = event => {
    event.preventDefault();
    this.setState({ isSubmitted: true });
    const { imagesData } = this.state;
    if (imagesData.length >= 1) {
      this.props.handleChange(3, "gallery", imagesData);
    } else {
      return;
    }
  };
  handleVideoUrl = event => {
    const { name, value } = event.target;

    let regForUrl = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    if (!regForUrl.test(value)) {
      this.setState({
        error: "Please enter valid url"
      });
    } else {
      this.setState({
        error: ""
      });
    }

    this.setState({
      [name]: value
    });
  };
  render() {
    const { featuredImg } = this.state;
    return (
      <div className="">
        <div className="rewads-heading text-center">
          <h2>Project image</h2>
          <p>
            Add an image that clearly represents your project. Minimum image
            resolution size should be at least 1024x576 pixels.
          </p>
        </div>
        <div className="col-sm-10 center-block">
          <form className="form-horizontal" encType="multipart/form-data">
            <div className="form-group">
              <label className="col-md-4 control-label">
                Enter Video url link :
              </label>
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  name="video_url"
                  value={this.state.video_url}
                  placeholder="Ex. https://youtu.be/3_Z8wKv6oPk"
                  onChange={this.handleVideoUrl}
                />
                {this.state.error ? (
                  <div className="text-danger">{this.state.error}</div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="col-md-4 control-label">Upload Image :</label>
              <div className="col-md-8">
                <div className="image-upload-box">
                  <div className="image-upload-preview">
                    <div
                      className="fileinput fileinput-new"
                      data-provides="fileinput"
                    >
                      <div
                        className="fileinput-preview thumbnail "
                        data-trigger="fileinput"
                      >
                        <input
                          className="imgUpload img_up"
                          name="image"
                          type="file"
                          onChange={this.setThumb}
                        />
                        <img
                          className="upload-default-image"
                          id="upload-default-image"
                          src={
                            featuredImg
                              ? `${frontUrl + featuredImg}`
                              : "/assets/img/upload-image.png"
                          }
                          alt="upload image"
                        />
                      </div>
                    </div>
                    <div className="image-upload-footer">
                      <div>
                        <span className="btn btn-danger remove_field btn-xs">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* <div className="element_row">
			<Dropzone
				onDrop={this.onDrop}
				multiple={true}
				accept="image/*"
				maxSize={5000000}
			>
				{({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
				return (
				<div
					{...getRootProps()}
					className={classNames('dropzone', { 'dropzone--isActive': isDragActive })}
					>
					<input {...getInputProps()} />
					<div className="image-upload-wrap">
						<div className="image-upload-block">
							<div className="image-tile">
								<img
								className="upload-default-image"
								id="upload-default-image"
								src={"/assets/img/upload.svg"}
								alt="..."
								/>
								<div className="img-effect"></div>
							</div>
							<div className="text-tile">
								<h1 className="heading">Click to add file or Drag here</h1>
								<p className="sub-heading">Please share up to <span className="heighlight">10</span>  relevant picture of the your Project</p>
							</div>
						</div>
					</div>
					{isDragReject && <div>Unsupported file type...</div>}
				</div>
				)
				}}
				</Dropzone>
				{this.state.isSubmitted && this.state.imagesData.length === 0 ? <div className="text-danger">Please uploaded atleast one image</div> : ''} 
				<div className="uploaded-img-section">
					<div className="uploaded-img-sub-section">
						{
						this.state.imagesData.length ?
						this.state.imagesData.map((img, index) => {
						return (
						<div className="product-tile" key={index}>
							<div className="uploaded-img-block">
								<div className="uploaded-img-tile">
									<div className="uploaded-img-sub-tile">
										<img
											src={img.src}
											alt=""
										/>
									</div>
									{this.state.featuredImg !== img.name ?
										<div 
											className="delete-tile" 
											onClick={() => this.removeImage(index)}
										>
											<i className="far fa-trash-alt"></i>
										</div>
									: null}
								</div>
								<div className="uploaded-text-tile">
									{this.state.featuredImg !== img.name ?
										<label>
											<input
												name="isGoing"
												type="checkbox"
												checked={img.isFeaturedImg}
												onChange={() => this.handleInputChange(index, img)}
											/>
											<div className="checkbox"></div>
											Want to make as featured image
										</label>
										: <div className="featured-img">This is featured image</div>
									}
								</div>
							</div>
						</div>
						)
					})
				: null
					}
				
				</div>*/}
        <div className="col-sm-10 center-block">
          <div className="col-md-4" />
          <div className="form-group text-center col-md-8">
            <div className="form-actions form-btn-block text-center">
              <button
                className="btn btn-back"
                type="submit"
                onClick={() => this.props.handleBack(2)}
              >
                Back
              </button>
              <button
                className="btn btn-donate-big"
                type="submit"
                onClick={this.handleSave}
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gallery;
