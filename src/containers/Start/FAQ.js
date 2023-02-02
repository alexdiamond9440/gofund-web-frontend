import React, { Component } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { toastr } from 'react-redux-toastr';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faqs: [
        {
          id: 1,
          faq_ans: '',
          faq_ques: '',
        },
      ],

      errors: [],
      nextID: 2,
    };
    // this.getData();
  }
  componentDidUpdate = prevProps => {
    if (this.props.faqs !== prevProps.faqs) {
      this.getData();
    }
  };
  getData = () => {
    const { faqs } = this.props;
    if (faqs) {
      this.setState({
        faqs: faqs,
        nextID: faqs ? faqs.length + 1 : 2,
      });
    } else {
      this.setState({
        faqs: [
          {
            id: 1,
            faq_ans: '',
            faq_ques: '',
          },
        ],
      });
    }
  };
  componentDidMount = () => {
    this.getData();
  };
  handleFaqChange = (index, event) => {
    const { name, value } = event.target;
    const { faqs } = this.state;
    const list = [].concat(faqs);
    list[index][name] = value;
    this.setState({
      faqs: list,
    });
  };
  addFaq = () => {
    this.setState(prevState => {
      return {
        faqs: [
          ...prevState.faqs,
          {
            id: prevState.nextID,
            faq_ans: '',
            faq_ques: '',
          },
        ],
        nextID: prevState.nextID + 1,
      };
    });
  };
  removeFaq = index => {
    const { faqs } = this.state;
    if (index === 0 && this.state.faqs.length === 1) {
      this.setState({
        faqs: [
          {
            id: 1,
            faq_ans: '',
            faq_ques: '',
          },
        ],
      });
    } else {
      const list = [].concat(faqs);
      list.splice(index, 1);
      this.setState({ faqs: list });
    }
  };
  confirmBox = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit the project!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then(result => {
      if (result.value) {
        this.props.handleSubmit();
        toastr.success('Your project has been submitted successfully');
      }
    });
    // confirmAlert({
    //   // title: 'Confirm to submit',
    //   message: "Are you sure you want to submit this project ?",
    //   buttons: [
    //     {
    //       label: "Yes",
    //       onClick: () => this.props.handleSubmit()
    //     },
    //     {
    //       label: "cancel"
    //     }
    //   ]
    // });
  };
  handleSave = event => {
    event.preventDefault();
    const { faqs } = this.state;
    const errors = [...this.state.errors];
    faqs.map((faq, index) => {
      return (errors[index] =
        (faq.faq_ques !== '' && faq.faq_ans.trim() === '') ||
        (faq.faq_ans !== '' && faq.faq_ques === '')
          ? true
          : false);
    });
    this.setState({ errors });
    if (errors.includes(true)) {
      return;
    } else {
      this.props.handleChange(5, 'faqs', faqs);
      /* this.confirmBox(); */
    }
  };
  handleSkip = () => {
    const { faqs } = this.props;

    this.props.handleChange(5, 'faqs', faqs ? faqs : '');
    /* this.confirmBox(); */
  };
  render() {
    const { faqs, errors } = this.state;
    return (
      <div>
        <div className='rewads-heading text-center'>
          <h2>FAQ</h2>
          <p>
            FAQ stands for <b>Frequently Asked Questions.</b> If you have simple
            answers to common questions then list them here.
          </p>
        </div>
        <div className='faq-points-wrapper'>
          {faqs.map((faq, index) => {
            return (
              <div className='faq-tile' key={index}>
                <div className='col-sm-8 center-block'>
                  <form
                    autoComplete='off'
                    className='form-horizontal'
                    // key={faq.id}
                  >
                    <div className='form-group'>
                      <label className='col-md-4 control-label'>
                        Question
                        <span className='mandatory'>*</span>:
                      </label>
                      <div className='col-md-8'>
                        <input
                          type='text'
                          className='form-control form-input'
                          name='faq_ques'
                          value={faq.faq_ques}
                          onChange={e => this.handleFaqChange(index, e)}
                          maxLength={200}
                        />
                        {errors[index] && !faq.faq_ques.trim() ? (
                          <div className='text-danger'>
                            Question is required
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div className='form-group'>
                      <label className='col-md-4 control-label'>
                        Answer
                        <span className='mandatory'>*</span>:
                      </label>
                      <div className='col-md-8'>
                        <textarea
                          type='text'
                          className='form-control form-input custom-textarea'
                          name='faq_ans'
                          value={faq.faq_ans}
                          rows={3}
                          onChange={e => this.handleFaqChange(index, e)}
                          maxLength={1000}
                        />
                        {errors[index] && !faq.faq_ans.trim() ? (
                          <div className='text-danger'>Answer is required</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className='fix-right-item'>
                  <div className='add-more-reward-wrap '>
                    <OverlayTrigger
                      overlay={
                        <Tooltip id={`tooltip`}>Add Another Question</Tooltip>
                      }
                      placement='left'
                    >
                      <span
                        className='btn_add_reward element_row'
                        onClick={this.addFaq}
                      >
                        <i className='fas fa-plus' />
                      </span>
                    </OverlayTrigger>
                    {/* {faq.id !== 1 && faqs.length > 1 ? ( */}

                    <OverlayTrigger
                      overlay={
                        <Tooltip id={`tooltip`}>Delete a Question</Tooltip>
                      }
                      placement='left'
                    >
                      <span
                        className='remove-reward-fields'
                        onClick={() => this.removeFaq(index)}
                      >
                        <i className='far fa-trash-alt' />
                      </span>
                    </OverlayTrigger>
                    {/* )
                     : (
                      ""
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* <div className="col-sm-8 center-block">
          <div className="form-group clearfix">
            <div className="col-md-4" />
            <div className="col-md-12"> */}
        <div className='form-actions form-btn-block text-center reward-btn-block'>
          <button
            className='btn btn-back'
            type='submit'
            onClick={() => this.props.handleBack(4)}
          >
            Back
          </button>
          <button
            className='btn btn-skip'
            type='submit'
            onClick={this.handleSkip}
          >
            Skip
          </button>
          <button
            className='btn btn-donate-big'
            type='submit'
            onClick={this.handleSave}
          >
            Save & Continue
          </button>
        </div>
        {/* </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default FAQ;

/* {this.props.isEditable ? "Skip & Update" : "Skip & Submit"}
{this.props.isEditable ? "Save & Update" : "Save & Submit"} */
