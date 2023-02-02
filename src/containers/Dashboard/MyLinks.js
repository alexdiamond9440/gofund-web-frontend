import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';
import { toastr } from 'react-redux-toastr';
import './MyLinks.scss';
import { isMobileOrTablet } from 'helpers/isMobileOrTablet';

export const MyLinks = () => {
  const [{ links, loading, error }, setLinksState] = useState({
    links: { projects: [], profile: {} },
    loading: false,
    error: null
  });

  useEffect(() => {
    const getMyLinks = async () => {
      try {
        setLinksState({ links: [], loading: true });
        const response = await axios.get('/profile/all-pages-links');
        setLinksState({ links: response.data, loading: false });
      } catch (err) {
        setLinksState({ links: [], loading: false });
        toastr.error('An error happend while fetching your links');
        console.log('Error happend while fetching links');
      }
    };
    getMyLinks();
  }, []);

  // handle copy to clipboard
  const handleCopyToClipboard = (text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    toastr.success('Link copied to clipboard');
  };

  const handleSaveProfileLink = async ({ url }) => {
    try {
      const response = await axios.put('/profile/update-profile-link', { profileUrl: url });
      toastr.success(response.data.message);
    } catch (axiosError) {
      toastr.error(axiosError.response.data.message);
    }
  };

  const handleSaveProjectLink = async ({ url, id }) => {
    try {
      const response = await axios.put('/projects/update-project-url', { url, projectId: id });
      toastr.success(response.data.message);
    } catch (axiosError) {
      toastr.error(axiosError.response.data.message);
    }
  };

  return (
    <div className="col-md-12 col-sm-12 dashboard-right-warp">
      <div className="dashboard-right">
        <div className="user-profile-overview clearfix">
          <div className="col-md-12">
            <div className="big_label1">My Links</div>
            {loading && <Loader />}
            <div className="row">
              <div className="col-md-10 center-block">
                <h4>My Profile link :</h4>
                {!loading && (
                  <PageLinkItem
                    link={links.profile}
                    onCopyClick={handleCopyToClipboard}
                    onSaveClick={handleSaveProfileLink}
                    domainUrl={process.env.REACT_APP_FRONTEND_URL}
                  />
                )}
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-md-10 center-block">
                <h4>My sponsor pages link :</h4>
              </div>
            </div>
            {!loading && (
              <div className="row">
                {links.projects.map((link) => (
                  <div className="col-md-10 center-block" key={link.url}>
                    <PageLinkItem
                      link={link}
                      onCopyClick={handleCopyToClipboard}
                      onSaveClick={handleSaveProjectLink}
                      domainUrl={process.env.REACT_APP_FRONTEND_URL}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageLinkItem = ({ link, onCopyClick, onSaveClick, domainUrl }) => {
  const [editEnabled, setEditEnabled] = useState(false);
  const [isLinkChanged, setIsLinkChanged] = useState(false);
  const [linkUrl, setLinkUrl] = useState(String(link.url));

  const inputReference = useRef(null);

  useEffect(() => {
    if (editEnabled) {
      inputReference.current.focus();
    }
  }, [editEnabled]);

  const handleChange = (event) => {
    setIsLinkChanged(true);
    setLinkUrl(event.target.value);
  };

  const handleEdit = () => {
    setEditEnabled(true);
  };
  // remove last directory of linkUrl
  return (
    <div className="row">
      <div className="col-lg-12">
        <h5>{link?.title}</h5>
        <div className="input-group" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="form-control Dashboard-MyLinks__domain-placeholder">{domainUrl}/</div>
            <input
              ref={inputReference}
              type="text"
              className="form-control"
              defaultValue={linkUrl}
              readOnly={!editEnabled}
              onChange={handleChange}
              disabled={!editEnabled}
            />
          </div>
          <span className="input-group-btn Dashboard-MyLinks__input-group">
            <button
              onClick={editEnabled ? onSaveClick.bind(null, { ...link, url: linkUrl }) : handleEdit}
              disabled={editEnabled && !isLinkChanged}
              className={`btn btn-${
                editEnabled && isLinkChanged ? 'primary' : 'default'
              } Dashboard-MyLinks__input-btn`}>
              <img
                alt="clipboard"
                src={`/assets/img/icons/${editEnabled ? 'check2_black' : 'pencil_square'}.svg`}
                className="Dashboard-MyLinks__input-btn-icon"
              />
              {editEnabled ? 'Save changes' : 'Change link'}
            </button>
            <button
              onClick={() => onCopyClick(`${domainUrl}/${linkUrl}`)}
              className="Dashboard-MyLinks__input-btn btn btn-submit"
              type="button">
              <img
                alt="clipboard"
                src="/assets/img/icons/clipboard_black.svg"
                className="Dashboard-MyLinks__input-btn-icon"
              />
              Copy
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyLinks;
