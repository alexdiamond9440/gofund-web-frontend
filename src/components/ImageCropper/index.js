import React, { Component } from "react";
import Cropper from 'react-easy-crop';
import Croppie from 'croppie';
import '../../../node_modules/croppie/croppie.css'
import getCroppedImg from '../../helpers/getCroppedImage'
import { dataURItoBlob } from '../../helpers/getCroppedImage'

class ImageCropper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crop: { x: 0, y: 0 },
            zoom: 1,
            aspect: 1 / 1,
            croppedAreaPixels: null,
            cropActive: false,
            restrictPosition: false,
            fileUrl: '',
            zoomValue: 1,
        }
    }

    onCropChange = (crop) => {
        this.setState({ crop })
    }

    onCropComplete = (croppedArea, croppedAreaPixels) => {
        this.setState({
            croppedAreaPixels,
        });
    }

    onZoomChange = (zoom) => {
        this.setState({ zoom })
    }

    handlecroppedImage = async (e) => {
        const { thumbUrl,requiredSize } = this.props;
        const { croppedAreaPixels } = this.state;
        try {
            const croppedImage = await getCroppedImg(
                thumbUrl,
                croppedAreaPixels,
                requiredSize
            );
            console.log(croppedImage,"croppedImage")
            const getOutput = dataURItoBlob(croppedImage, 'profileUser.png')
            this.props.onCropped(getOutput)

        } catch (error) {
            console.log(error, '');
        }
    }

    handleZoomChange = (e) => {
        [e.target.name] = e.target.value;
        this.setState({
            zoom: e.target.value
        })
    }

    render() {
        const { thumbUrl, handlecancelcropping, cropSize, classNames } = this.props;
        const { crop, aspect, zoom } = this.state;
        console.log(thumbUrl,"thumbUrl")
        return (
            <>
            <div className={classNames}>
                {/* <Cropper
                    image={thumbUrl}
                    crop={crop}
                    cropSize={cropSize}
                    zoom={zoom}
                    aspect={3/2}
                    onCropChange={this.onCropChange}
                    onCropComplete={this.onCropComplete}
                    onZoomChange={this.onZoomChange}
                    restrictPosition={true}
                /> */}
            </div>
            {/* <div className={"d-flex justify-content-center align-items-center cropper-bottom"}>
                <div className={"col-md-6"}>
                    <input
                        type={"range"}
                        className={"zoomSlider"}
                        name={"zoom"}
                        value={this.state.zoom}
                        min={1}
                        max={3}
                        step={0.265000}
                        aria-labelledby="Zoom"
                        onChange={(e) => this.handleZoomChange(e)}
                        onInput={(e) => this.handleZoomChange(e)}
                    />
                </div>
                <div className={"col-md-6"}>
                    <div className={"pt-3 pb-3 filter-btn "}>
                        <button className={"btn btn-default btn-search"} onClick={() => this.handlecroppedImage()}>Save Image</button>
                        <button className={"btn btn-danger ml-2"} onClick={handlecancelcropping}>Cancel</button>
                    </div>
                </div>
            </div> */}
            </>
        )
    }
}
export default ImageCropper