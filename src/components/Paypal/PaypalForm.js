import Loader from 'components/Loader';
import { Backend_url } from 'constants';
import countriesData from 'common/countries.json';
import ExifOrientationImg from 'react-exif-orientation-img';

const country = countriesData.map((item, index) => {
  return (
    <option key={index} value={item.id}>
      {item.name}
    </option>
  );
});

export const PaypalForm = (props) => {
  const {
    paypalImage,
    paypalImageErr,
    errMsg,
    paypalState,
    paypalCity,
    paypalStateOptions,
    isPhotoIdUploading,
    email,
    mobileNumber,
    paypalCountryId,
    onThumbChange,
    onSubmit,
    onChange,
    loading
  } = props;

  const paypalStateElements = paypalStateOptions.map((state, index) => {
    return (
      <option key={index} value={state.name}>
        {state.name}
      </option>
    );
  });

  return (
    <form onSubmit={onSubmit} className="row">
      <div className="col-md-12 center-block">
        <p className="alert-paypal-text">
          In order to receive money, please enter your location & email address or domestic mobile
          number.
        </p>
        <div className="row">
          <div className="form-group col-md-6">
            <label>Email</label>
            <div>
              <input
                className="form-control"
                placeholder="Email address"
                name="email"
                type={'text'}
                onChange={onChange}
                value={email}
              />
            </div>
            {errMsg && errMsg['email'] ? <div className="text-danger">{errMsg['email']}</div> : ''}
          </div>
          <div className="form-group col-md-6">
            <label>Mobile number</label>
            <div>
              <input
                className="form-control"
                placeholder="Mobile Number"
                name="mobileNumber"
                type={'text'}
                onChange={onChange}
                value={mobileNumber}
                maxLength="20"
              />
            </div>
            {errMsg && errMsg['mobileNumber'] ? (
              <div className="text-danger">{errMsg['mobileNumber']}</div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <label>
              Country
              <span className="mandatory">*</span>
            </label>
            <div>
              <select
                className="form-control"
                onChange={onChange}
                value={paypalCountryId}
                name="paypalCountryId">
                <option>Select Country</option>
                {country}
              </select>
            </div>
            {errMsg && errMsg['paypalCountryId'] ? (
              <div className="text-danger">{errMsg['paypalCountryId']}</div>
            ) : (
              ''
            )}
          </div>
          <div className="form-group col-md-6">
            <label>
              State
              <span className="mandatory">*</span>
            </label>
            <div>
              <select
                className="form-control"
                onChange={onChange}
                value={paypalState}
                name="paypalState">
                <option>Select State</option>
                {paypalStateElements}
              </select>
            </div>
            {errMsg && errMsg['paypalState'] ? (
              <div className="text-danger">{errMsg['paypalState']}</div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="row">
          <div className="form-group col-md-6">
            <label>
              City
              <span className="mandatory">*</span>
            </label>
            <div>
              <input
                className="form-control"
                placeholder="City"
                name="paypalCity"
                onChange={onChange}
                value={paypalCity}
                maxLength="30"
              />
            </div>
            {errMsg && errMsg['paypalCity'] ? (
              <div className="text-danger">{errMsg['paypalCity']}</div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="col-md-12">
          <label>Photo ID</label>
          <div className="document-file-wrap">
            <div className="image-upload-box">
              <div className="image-upload-preview">
                <div className="fileinput fileinput-new" data-provides="fileinput">
                  <div className="fileinput-preview thumbnail " data-trigger="fileinput">
                    {isPhotoIdUploading ? (
                      <Loader />
                    ) : (
                      <input
                        className="imgUpload img_up"
                        name="paypalImage"
                        type="file"
                        accept="image/*"
                        onChange={onThumbChange}
                      />
                    )}
                    {isPhotoIdUploading ? (
                      <ExifOrientationImg
                        className="upload-default-image"
                        id="upload-default-image"
                        src={paypalImage && `${Backend_url + paypalImage}`}
                        alt=""
                      />
                    ) : (
                      <ExifOrientationImg
                        className="upload-default-image"
                        id="upload-default-image"
                        src={
                          paypalImage
                            ? `${Backend_url + paypalImage}`
                            : '/assets/img/upload-image.png'
                        }
                        alt=""
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {paypalImageErr || (errMsg && errMsg['file']) ? (
            <div className="text-danger">{paypalImageErr || errMsg['file']}</div>
          ) : (
            ''
          )}
        </div>

        <div className="col-md-12">
          <div className="form-actions form-btn-block text-center">
            {!loading ? (
              <button
                // onClick={onSubmit}
                disabled={!email && !mobileNumber}
                className="btn btn-donate-big"
                type="submit">
                Save
              </button>
            ) : (
              <button className="btn btn-donate-big" disabled>
                Saving...
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
