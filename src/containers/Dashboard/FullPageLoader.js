import classNames from "classnames";
import React from "react";

const Loader = () => {
  return (
    <div className={classNames("loader-block")}>
      <div className={classNames("loader")}>
        <svg className={classNames("circular-loader")} viewBox="25 25 50 50">
          <circle
            className={classNames("loader-path")}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#20a8d8"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
};
export default Loader;
