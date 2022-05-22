import React, { useState, useEffect } from "react";
import "./Bet.scss";

import closeIcon from "../../../SVG/close.svg";
import memeIcon from "../../../SVG/icon-mcr.svg";
import dogecoin from "../../../PNG/icon-dogecoin.png";

import CountdownTimer from "../../CountdownTimer/CountdownTimer";

import { ReactComponent as QWERTY } from "../../../SVG/icon-mcr.svg";

export default function Bet(props) {
  const [betValue, setBetValue] = useState();
  const [coin, setCoin] = useState("");

  useEffect(() => {
    // set adress of coin by name
    switch (props.coin) {
      case "Bitcoin":
        setCoin("F4QZEMQjNRvwHd9tLgp74fVD99Bg3cXbHuEQ7EGymBq6");
        break;
      case "Ethereum":
        setCoin("5zxs8888az8dgB5KauGEFoPuMANtrKtkpFiFRmo3cSa9");
        break;
      case "Chainlink":
        setCoin("CFRkaCg9PcuMaCZZdcePkaa8d8ugtH221HL7tXQHNVia");
        break;
      default:
        break;
    }
  });

  const CloseBet = () => {
    document.querySelector(".bet-modal").classList.remove("show-modal");
  };

  const makeBet = (betType) => {
    if (betValue === "") {
      alert("Amount field cannot be empty");
      return;
    }

    if (betValue === 0) {
      alert("Amount field cannot be zero");
      return;
    }

    if (betValue < 100) {
      alert("You can only bet more than 100");
      return;
    }

    props.makeBet(betType, betValue, coin);
  };

  return (
    <div className="bet-modal">
      <div className="bet-content">
        <div className="bet-header">
          <label>Bet</label>
          <span className="close-button">
            <img alt="" src={closeIcon} onClick={CloseBet} />
          </span>
        </div>
        <div className="bet-body">
          <h2>enter amount</h2>
          <div className="count-group">
            <input
              type={"number"}
              value={betValue}
              onChange={(e) => setBetValue(e.target.value)}
            />
            <img alt="" src={memeIcon} />
          </div>
          <label className="timer-header">
            price goes in next <b>5 minutes</b>
          </label>
          <label className="timer">
            {/* <CountdownTimer seconds={props.seconds} /> */}
            <div className="actions-group">
              <button onClick={() => makeBet(2)}>DOWN</button>
              <button onClick={() => makeBet(1)}>SAME</button>
              <button onClick={() => makeBet(0)}>UP</button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="bet-modal">
  //     <div className="bet-content-win">
  //       <div className="bet-header">
  //         <label>Bet</label>
  //         <span className="close-button">
  //           <img alt="" src={closeIcon} onClick={CloseBet} />
  //         </span>
  //       </div>
  //       <div className="bet-body">
  //         <label className="bet-body-header">YOU WIN!</label>
  //         <div className="bet-body-desc">
  //           <label>CONGRATULATIONS</label>
  //           <label>YOUR MEME BET WON</label>
  //         </div>
  //         <div className="amount">
  //           <label>2000</label> <QWERTY />
  //         </div>
  //         <button onClick={CloseBet}>OK</button>
  //       </div>
  //     </div>
  //     <div className="bet-content-lose"></div>
  //   </div>
  // );

  // return (
  //   <div className="bet-modal">
  //     <div className="bet-content">
  //       <div className="bet-header">
  //         <label>Bet</label>
  //         <span className="close-button">
  //           <img alt="" src={closeIcon} onClick={CloseBet} />
  //         </span>
  //       </div>
  //       <div className="bet-body">
  //         <h2>enter amount</h2>
  //         <div className="count-group">
  //           <input type={"number"} />
  //           <img alt="" src={memeIcon} />
  //         </div>
  //         <label className="timer-header">price goes in next</label>
  //         <label className="timer">
  //           <Countdown
  //             date={Date.now() + 300000}
  //             renderer={renderer}
  //             autoStart={false}
  //           />
  //         </label>
  //       </div>
  //     </div>
  //     <div className="bet-content-win">
  //       <div className="bet-header">
  //         <label>Bet</label>
  //         <span className="close-button">
  //           <img alt="" src={closeIcon} onClick={CloseBet} />
  //         </span>
  //       </div>
  //       <div className="bet-body">
  //         <label className="bet-body-header">YOU WIN!</label>
  //         <div className="bet-body-desc">
  //           <label>CONGRATULATIONS</label>
  //           <label>YOUR MEME BET WON</label>
  //         </div>
  //         <div className="amount">
  //           <label>2000</label> <QWERTY />
  //         </div>
  //         <button>OK</button>
  //       </div>
  //     </div>
  //     <div className="bet-content-lose"></div>
  //   </div>
  // );
}
