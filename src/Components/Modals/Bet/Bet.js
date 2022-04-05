import React from "react";
import "./Bet.scss";

import closeIcon from "../../../SVG/close.svg";

export default function Bet(props) {
  const CloseBet = () => {};

  return (
    <div className="bet-modal">
      <div className="bet-content">
        <div className="bet-header">
          <label>Preference</label>
          <span className="close-button">
            <img alt="" src={closeIcon} onClick={CloseBet} />
          </span>
        </div>
        <div className="bet-body">
          <h2>enter amount</h2>
          <div className="count-group">
            <input type={"number"} />
          </div>
        </div>
      </div>
    </div>
  );
}
