import React from "react";
import "./Bet.scss";

import closeIcon from "../../../SVG/close.svg";
import memeIcon from "../../../SVG/icon-mcr.svg";
import dogecoin from "../../../PNG/icon-dogecoin.png";

export default function Bet(props) {
  const CloseBet = () => {
    document.querySelector(".bet-modal").classList.remove("show-modal");
  };

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
            <img alt="" src={memeIcon} />
          </div>
          {/* <div className="coins-group">
            <label>choose where</label>
            <select>
              <option>Dogecoin</option>
              <option>Samoyedcoin</option>
              <option>Samusky</option>
              <option>WOOF</option>
            </select>
          </div> */}
          <label className="timer-header">price goes in next</label>
          <label className="timer">
            <span>5:00</span> min
          </label>
          <div className="actions-group">
            <button className="down-btn" onClick={async () => props.makeBet()}>
              Down
            </button>
            <button className="same-btn" onClick={async () => props.makeBet()}>
              Same
            </button>
            <button className="up-btn" onClick={async () => props.makeBet()}>
              Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
