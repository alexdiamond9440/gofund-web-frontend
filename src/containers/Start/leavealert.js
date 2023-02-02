import React, { Component } from "react";
import { Prompt } from "react-router";
import Swal from "sweetalert2";
class LeaveAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  confirmbox = () => {
    Swal.fire({
      title: "You have unsaved changes!!",
      text: "Are you sure? You want to leave!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(result => {
      if (result.value) {
        this.props.history.goBack();
      }
    });
  };
  render() {
    const { data } = this.props;
    return (
      <React.Fragment>
        <Prompt
          when={data}
          message="You have unsaved changes, are you sure you want to leave?"
          // message={this.confirmbox}
        />
        {/* Component JSX */}
      </React.Fragment>
    );
  }
}

export default LeaveAlert;
