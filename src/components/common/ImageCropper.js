import { useEffect, useRef } from 'react';
import Croppie from 'croppie';

const winWidth = document.body.offsetWidth;
let boundaryWidth = 600,
  boundaryHeight = 400;
if (winWidth < 500) {
  boundaryWidth = 400;
  boundaryHeight = 280;
} else if (winWidth < 768) {
  boundaryWidth = 500;
  boundaryHeight = 300;
}

const croppieOptions = {
  showZoomer: true,
  enableOrientation: true,
  mouseWheelZoom: 'ctrl',
  viewport: {
    width: 300,
    height: 300,
    type: 'square'
  },
  boundary: {
    width: boundaryWidth,
    height: boundaryHeight
  }
};

export const ImageCropper = (props) => {
  const { onCropped, imageUrl, onError, onCancel, loading } = props;
  const croppieReference = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onerror = () => {
      onError?.();
    };

    img.onload = () => {
      croppieReference.current.bind({ url: imageUrl });
    };
  }, [imageUrl, onError]);

  const handleDoneCropping = () => {
    croppieReference.current.result('blob').then(async (base64) => {
      const fileObject = new File([base64], 'image.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', fileObject);
      try {
        onCropped(formData);
      } finally {
        onError?.();
      }
    });
  };

  const handleRotateImage = () => {
    croppieReference.current.rotate(90);
  };

  const handleCancelCropping = (e) => {
    onCancel?.();
  };

  useEffect(() => {
    if (!croppieReference.current) {
      croppieReference.current = new Croppie(document.getElementById('croppie'), croppieOptions);
    }
  }, []);

  return (
    <div
      className={'col-md-12 col-sm-12 profile-image-cropper'}
      style={{
        height: '100%'
      }}>
      <div id="croppie" />
      <div className={'d-flex justify-content-center align-items-center pt-3 pb-3 filter-btn'}>
        <button
          type="button"
          disabled={loading}
          onClick={handleDoneCropping}
          className={'btn btn-default btn-search ml-2'}>
          {loading && (
            <>
              <i className="fas fa-spinner" />
              Cropping
            </>
          )}
          {!loading && 'Crop Image'}
        </button>
        <button
          className={'btn btn-default btn-search ml-2'}
          type="button"
          onClick={handleRotateImage}>
          Rotate
        </button>
        <button className={'btn btn-danger'} onClick={handleCancelCropping}>
          Cancel
        </button>
      </div>
    </div>
  );
};
