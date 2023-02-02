import React, { Component } from "react";
import { Panel, Collapse } from "react-bootstrap";

class FaqGrid extends Component {
  render() {
    const { faq } = this.props;
    return (
      <div>
        {faq && faq.length
          ? faq.map((faq, index) => (
              <Panel key={index} className="panel">
                <Panel.Heading
                  className="panel-heading"
                  componentClass="h4"
                  onClick={() => this.props.onToggle(index)}
                >
                  Q.{faq.faq_ques}
                  {faq.faq_ques.trim().endsWith("?") ? "" : "?"}
                  {faq.open ? (
                    <i className="fa fa-caret-up" aria-hidden="true" />
                  ) : (
                    <i className="fa fa-caret-down" aria-hidden="true" />
                  )}
                </Panel.Heading>
                <Collapse in={faq.open}>
                  <Panel.Body className="panel-body">
                    <p>{faq.faq_ans}</p>
                  </Panel.Body>
                </Collapse>
              </Panel>
            ))
          : null}
      </div>
    );
  }
}

export default FaqGrid;
