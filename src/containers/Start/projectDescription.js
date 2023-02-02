import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { config } from './editorConfig';
import { frontUrl, Base_url } from '../../constants';

class ProjectDescription extends Component {
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
    this.config = {
      ...config,
      uploader: {
        url: `${Base_url}/uploads/editors-file-upload`,
        format: 'json',
        process: response => {
          const { data } = response;
          return {
            data,
          };
        },
        defaultHandlerSuccess: resp => {
          this.uploadImageCallBack(resp.data);
        },
      },
    };
    // this.getData();
  }
  uploadImageCallBack = (response, index) => {
    let temp = this.state.content;
    let images = '';
    if (response && response.length) {
      response.forEach(element => {
        images += `<img src=${frontUrl}${element} style="width: ${config.imageDefaultWidth}px;">`;
      });
    }
    const lastIndex = temp.lastIndexOf('</p>');
    temp =
      temp.substr(0, lastIndex) + '' + temp.substr(lastIndex + '</p>'.length);
    this.descriptionChange(`${temp}${images}</p>`);
    // this.setState({
    //   imageUpdated: true,
    //   content: `${temp}${images}</p>`,
    // });
  };
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

      const html = content ? content : '<p></p>';
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState,
        });
      }
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
    if (name === 'amount') {
      value = value.trim() ? value : '';
    }
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
    let urlError = !url.match(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
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
      data.amount &&
      data.content
    ) {
      this.props.handleChange(3, 'basicInfo', data);
    } else {
      this.setState({ disabled: true });
      return;
    }
  };

  descriptionChange = content => {
    this.setState({
      content,
    });
  };
  render() {
    const { isSubmitted, content } = this.state;

    // const { editorState } = this.state;
    // const { projectError } = this.props;
    return (
      <div>
        <div className='rewads-heading text-center'>
          <h2>
            Tell Us About Your Sponsor Page
            <span className='mandatory'>*</span>
            <OverlayTrigger
              overlay={
                <Tooltip id={'id'}>
                  Tell us about what inspired you to come up with this sponsor page.
                  Be objective and charming, present your readers with something
                  that moves them while being very transparent over the
                  expectations on your sponsor page! Don't make it too long! Give
                  links so people can know more about your work.
                </Tooltip>
              }
              placement='top'
            >
              <i className='fas fa-info-circle' />
            </OverlayTrigger>{' '}
          </h2>
          <p>How Will You Spend The Money You Want To Raise?</p>
        </div>
        <div className='col-sm-12 center-block'>
          <form className='form-horizontal'>
            <div className='form-group'>
              <div className='col-md-offset-2 col-md-8'>
                <div className={'input-block border'}>
                  <JoditEditor
                    ref={this.editor}
                    value={content}
                    config={this.config}
                    tabIndex={1} // tabIndex of textarea
                    // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={this.descriptionChange}
                  />
                </div>
                {isSubmitted && content === '' ? (
                  <div className='text-danger'>
                    Sponsor Page description is required
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
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

export default ProjectDescription;
