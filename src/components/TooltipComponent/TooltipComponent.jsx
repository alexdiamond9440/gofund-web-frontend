import React from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const TooltipComponent = props => {
  return (
    <OverlayTrigger
      overlay={<Tooltip id={props.id ?props.id:'id'}>{props.message}</Tooltip>}
      placement={props.position ? props.position : "top"}
    >
      {props.children}
    </OverlayTrigger>
  );
};

export default TooltipComponent;
