import { Alert } from "react-bootstrap";
import React, { Component } from "react";

const AlertHandler = props => {
  let show = true;
  const onDismiss = () => {
    show = !show;
  };
  return (
    <>
      {show ? (
        <Alert bsStyle={props.class} onDismiss={onDismiss}>
          <p>{props.signUpdata.error}</p>
        </Alert>
      ) : null}
    </>
  );
};

export default AlertHandler;
