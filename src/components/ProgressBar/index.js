import React, { Component } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import RadialSeparators from './RadialSeparators';


class ProgressBarComponent extends Component {
    render() {
        const { percentage } = this.props;
        return (
            <CircularProgressbarWithChildren
                value={(percentage)}
                text={`${(percentage)}%`}
                strokeWidth={10}
                styles={buildStyles({
                    strokeLinecap: 'butt',
                })}
            >
                <RadialSeparators
                    count={12}
                    style={{
                        background: '#fff',
                        width: '2px',
                        // This needs to be equal to props.strokeWidth
                        height: `${10}%`,
                    }}
                />
            </CircularProgressbarWithChildren>
        )
    }
}

export default ProgressBarComponent;