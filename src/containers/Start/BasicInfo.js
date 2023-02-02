/** @format */

import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import GeoLocation from './../../components/GeoLocation';

class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlError: '',
      disabled: false,
      isSubmitted: false,
      name: '',
      url: '',
      caption: '',
      category: '',
      amount: '',
      project_location: '',
      content: '',
      editorState: '',
    };
    // this.getData();
  }
  componentDidUpdate = prevProps => {
    if (this.props.basicInfo !== prevProps.basicInfo) {
      this.getData();
    }
  };
  getData = () => {
    if (this.props.basicInfo !== '') {
      const {
        name,
        url,
        caption,
        content,
        category,
        amount,
        project_location,
      } = this.props.basicInfo;
      this.setState({
        name,
        url,
        caption,
        content,
        category,
        amount,
        project_location,
      });
    } else {
      this.setState({
        name: '',
        url: '',
        caption: '',
        content: '',
        editorState: '',
        category: '',
        description: '',
        amount: '',
        project_location: '',
      });
    }
  };
  componentDidMount = () => {
    this.getData();
  };
  componentWillUnmount = () => {
    this.setState({
      name: '',
      url: '',
      caption: '',
      content: '',
      category: '',
      amount: '',
      project_location: '',
    });
  };
  handleChange = address => {
    this.setState({ project_location: address });
  };

  handleInputChange = event => {
    let { name, value } = event.target;
    if (name === 'amount' && isNaN(value)) {
      return;
    }
    // if (name === "amount" && value.length > 8) {
    //   // console.log('value.length',value.length)
    //   return
    // }
    if (name === 'amount') {
      value = value.trim() ? value : '';
    }

    // if (name === "amount") {
    //   this.state.amount = parseFloat(this.stateamount);
    // }
    this.setState({
      [name]: value,
    });
  };
  handleSave = event => {
    event.preventDefault();
    const {
      name,
      url,
      caption,
      category,
      amount,
      project_location,
      content,
    } = this.state;
    this.setState({
      isSubmitted: true,
    });
    let urlError = !url.trim().match(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
      ? 'Invalid Url slug'
      : '';
    this.setState({
      urlError,
    });
    if (urlError) {
      return;
    }
    const data = {
      name: name.trim(),
      url: url.trim(),
      caption: caption.trim(),
      category: category.trim(),
      content: content,
      amount: parseFloat(amount),
      project_location: project_location.trim(),
    };

    if (
      data.name &&
      data.url &&
      data.caption &&
      data.category &&
      data.amount
      // && data.content
    ) {
      this.props.handleChange(2, 'basicInfo', data);
    } else {
      this.setState({ disabled: true });
      return;
    }
  };

  render() {
    // window.onbeforeunload = () => {
    //   return "Your work will be lost.";
    // };
    const {
      isSubmitted,
      name,
      url,
      caption,
      // content,
      category,
      amount,
      project_location,
      urlError,
    } = this.state;
    // const { editorState } = this.state;
    const { projectError } = this.props;
    return (
      <div>
        <div className='rewads-heading text-center'>
          <h2>Start with the basics</h2>
          <p>
            Set a realistic goal.
          </p>
        </div>
        <div className='col-sm-10 center-block'>
          <form className='form-horizontal'>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Sponsor Page Name
                <span className='mandatory'>*</span>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={'id'}>
                      Do not exceed 50 Characters.
                    </Tooltip>
                  }
                  placement='top'
                >
                  <i className='fas fa-info-circle' />
                </OverlayTrigger>{' '}
                :
              </label>
              {/* <LeaveAlert 
              data= {  name ||
                  category ||
                   project_location ||
                   url ||
                   caption ||
                   content ||
                   amount}
               /> */}
              <div className='col-md-8'>
                <input
                  type='text'
                  className='form-control form-input'
                  value={name}
                  onChange={this.handleInputChange}
                  name='name'
                  maxLength={50}
                />
                {isSubmitted &&
                // name.trim().length === 0 &&
                name.trim() === '' ? (
                  <div className='text-danger'>
                    Sponsor Page name is required
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Sponsor page URL
                <span className='mandatory'>*</span>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={'id'}>
                      Do not to use underline, hyphens
                      etc.
                    </Tooltip>
                  }
                  placement='top'
                >
                  <i className='fas fa-info-circle' />
                </OverlayTrigger>{' '}
                :
              </label>
              <div className='col-md-8'>
                <div className={`input-group`}>
                  <div
                    className={`input-group-addon url-addon  ${
                      projectError ? 'has-error' : ''
                    }`}
                  >
                    www.gofundher.com/
                  </div>
                  <input
                    type='text'
                    className={`form-control input_project_url ${
                      projectError ? 'has-error' : ''
                    }`}
                    name='url'
                    // disabled={isEditable === true ? true : false}
                    onChange={this.handleInputChange}
                    value={url}
                    maxLength={20}
                  />
                </div>
                {isSubmitted && (url.trim() === '' || urlError) ? (
                  <div className='text-danger'>
                    {urlError ? urlError : 'Sponsor Page url is required'}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Sponsor Page Caption<span className='mandatory'>*</span>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={'id'}>
                      Describe your sponsor page in 140 characters.
                    </Tooltip>
                  }
                  placement='top'
                >
                  <i className='fas fa-info-circle' />
                </OverlayTrigger>{' '}
                :
              </label>
              <div className='col-md-8'>
                <textarea
                  type='text'
                  className='form-control form-input custom-textarea'
                  rows={3}
                  maxLength={60}
                  value={caption}
                  onChange={this.handleInputChange}
                  name='caption'
                />
                {isSubmitted && caption.trim() === '' ? (
                  <div className='text-danger'>
                    Sponsor Page caption is required
                  </div>
                ) : null}
              </div>
            </div>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Sponsor Page Category<span className='mandatory'>*</span> :
              </label>
              <div className='col-md-8'>
                <select
                  className='form-control form-input'
                  onChange={this.handleInputChange}
                  name='category'
                  value={category}
                >
                  <option>Select Category</option>
                  <option value='Community'>Community</option>
                  <option value='Business'>Business</option>
                  <option value='Personal'>Personal</option>
                </select>
                {isSubmitted && category === '' ? (
                  <div className='text-danger'>
                    Sponsor Page category is required
                  </div>
                ) : null}
              </div>
            </div>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Sponsor Page Location :
              </label>
              <div className='col-md-8'>
                <GeoLocation
                  handleChange={this.handleChange}
                  handleSelect={this.handleSelect}
                  project_location={project_location}
                />
              </div>
            </div>
            <div className='form-group'>
              <label className='col-md-4 control-label'>
                Amount
                <span className='mandatory'>*</span> :
                <div className='extra-heading'>
                  How much money do you need?
                </div>
              </label>
              <div className='col-md-8'>
                <div className='input-group'>
                  <div className='input-group-addon'>
                    <i className='fas fa-dollar-sign' />
                  </div>
                  <input
                    className='form-control form-input'
                    type='text'
                    onChange={this.handleInputChange}
                    maxLength={8}
                    name='amount'
                    value={amount}
                  />
                </div>
                {isSubmitted && !parseFloat(amount) ? (
                  <div className='text-danger'>Amount is required</div>
                ) : (
                  ''
                )}
              </div>
            </div>
            {/* <div className="form-group">
              <div className="col-md-4" />
              <div className="col-md-8">
                <div className="form-actions form-btn-block text-center">
                  <button
                    className="btn btn-donate-big"
                    type="submit"
                    onClick={this.handleSave}
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </div> */}
          </form>
        </div>
        <div className='form-actions form-btn-block text-center'>
          <button
            className='btn btn-donate-big'
            type='submit'
            onClick={this.handleSave}
          >
            Save & Continue
          </button>
        </div>
      </div>
    );
  }
}

export default BasicInfo;
