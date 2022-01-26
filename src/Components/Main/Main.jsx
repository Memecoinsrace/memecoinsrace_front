import React, { useEffect } from "react";
import "./Main.scss";
import phantom from "../../SVG/Phantom.svg";
import solflare from "../../SVG/solflare.svg";
import mathWallet from "../../SVG/MathWallet.svg";
import solana from "../../SVG/Solana.svg";
import binance from "../../SVG/Binance.svg";
import poligon from "../../SVG/Poligon.svg";
import close from "../../SVG/close.svg";
import dogecoin from "../../PNG/icon-dogecoin@2x.png";
import shibacoin from "../../PNG/icon-SHIBAINU@2x.png";
import samoyedcoin from "../../PNG/icon-samoyedcoin@2x.png";
import soldoge from "../../PNG/icon-soldoge@2x.png";
import boneFinish from "../../SVG/bone-finish.svg";
import { ReactComponent as Dollar } from "../../SVG/dollar.svg";
import dollar from "../../PNG/dollar@2x.png";
import finishLine from "../../SVG/finish_line_big.svg";
// import { ReactComponent as ConnectWallet } from "../../SVG/connectWallet.svg";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import bone from "../../SVG/bone.svg";
import fish from "../../SVG/fish.svg";
import banana from "../../SVG/banana.svg";
import arrowDown from "../../SVG/arrow_down.svg";
import arrowHeight from "../../SVG/arrow_height.svg";
import arrowHeight2 from "../../SVG/arrow_height-2.svg";
import * as solanaWeb3 from "@solana/web3.js";
import axios from "axios";
import HowItWorks from "../HowItWorks/HowItWorks";

export default function Main() {
  useEffect(() => {
    // axios({
    //   method: "get",
    //   url: "https://api.memecoinsrace.com/rates",
    // }).then(function (response) {
    //   let data = [];
    //   data = response.data.rates;
    //   // console.log(data);
    //   // for (let index = 0; index < data.length; index++) {
    //   //   console.log(data[index]);
    //   // }
    // });
  });

  async function ConnectPhantom() {
    try {
      if ("solana" in window) {
        let provider = window.solana;

        if (provider.isPhantom) {
          const resp = await window.solana.connect();

          document.querySelector(".connect-wallet").style.background =
            "#4BC716";
          document.querySelector(".cw-label").innerHTML =
            resp.publicKey.toString();
          document
            .querySelector(".select-application-modal")
            .classList.toggle("show-modal");
          document
            .querySelector(".connect-wallet-modal")
            .classList.toggle("show-modal");

          localStorage.setItem("phantomPublicKey", resp.publicKey.toString());
        }
      } else {
        alert("Solana provider is not found");
      }
    } catch (ex) {
      alert(ex);
    }
  }

  function closeSelectApplication() {
    let elem = document.querySelector(".select-application-modal");
    elem.classList.toggle("show-modal");
  }

  function closeSelectBlockchain() {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  }

  const style = {
    marginTop: "auto",
    marginBottom: "auto",
    color: "#EA3943",
    font: "normal normal bold 20px/24px Montserrat",
  };

  const style2 = {
    background: "rgb(255,220,184)",
    background:
      "-moz-linear-gradient(90deg, rgba(255,220,184,1) 0%, rgba(255,158,156,1) 35%)",
    background:
      "-webkit-linear-gradient(90deg, rgba(255,220,184,1) 0%, rgba(255,158,156,1) 35%)",
    background:
      "linear-gradient(90deg, rgba(255,220,184,1) 0%, rgba(255,158,156,1) 35%)",
    filter:
      'progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffdcb8",endColorstr="#ff9e9c",GradientType=1)',
  };

  const style3 = {
    background: "rgb(183,255,233)",
    background:
      "-moz-linear-gradient(90deg, rgba(183,255,233,1) 0%, rgba(232,199,255,1) 35%, rgba(250,238,255,1) 96%)",
    background:
      "-webkit-linear-gradient(90deg, rgba(183,255,233,1) 0%, rgba(232,199,255,1) 35%, rgba(250,238,255,1) 96%)",
    background:
      "linear-gradient(90deg, rgba(183,255,233,1) 0%, rgba(232,199,255,1) 35%, rgba(250,238,255,1) 96%)",
    filter:
      'progid:DXImageTransform.Microsoft.gradient(startColorstr="#b7ffe9",endColorstr="#faeeff",GradientType=1)',
  };

  return (
    <div className="main">
      <div className="overview">
        <div className="head">
          <div className="categories">
            <div className="active-category">
              <span>
                <img src={bone} />
              </span>
              <label>DOGS</label>
              <label>COINS</label>
            </div>
            <div>
              <span>
                <img src={fish} />
              </span>
              <label>CATS</label>
              <label>COINS</label>
            </div>
            <div>
              <span>
                <img src={banana} />
              </span>
              <label>APES</label>
              <label>COINS</label>
            </div>
          </div>
          <ConnectWallet />
          {/* <div className="connect-wallet" onClick={openSelectBlockchain}>
            <img src={wallet} />
            <label className="cw-label">CONNECT WALLET</label>
          </div> */}
        </div>
        <div className="coins-sort">
          <div>
            <label>1 day</label>
            <span>
              <img src={arrowDown} />
            </span>
          </div>
          <div>
            <label>1 week</label>
            <span>
              <img src={arrowHeight} />
            </span>
          </div>
          <div>
            <label>1 month</label>
            <span>
              <img src={arrowHeight} />
            </span>
          </div>
          <div>
            <label>6 months</label>
            <span>
              <img src={arrowHeight} />
            </span>
          </div>
          <div>
            <label>1 year</label>
            <span>
              <img src={arrowHeight} />
            </span>
          </div>
          <div>
            <label>Odds</label>
            <span>
              <img src={arrowHeight2} />
            </span>
          </div>
        </div>
        <div className="race-group">
          <div className="race-table">
            <div className="row-coin">
              <label className="coin-number">1</label>
              <img src={dogecoin} />
              <div className="coin-info-group">
                <div className="coin-name-group">
                  <label className="coin-fullname">Dogecoin</label>
                  <label className="coin-shortname">DOGE</label>
                </div>
                <label className="coin-price">$0.2214</label>
              </div>
              <div className="score">
                <div className="line" />
                <img className="score-img" src={dogecoin} />
                <div className="finish-section">
                  <img src={boneFinish} />
                  <div className="coefficient">
                    <label>x 0.15</label>
                  </div>
                  <div className="bet-btn">
                    <label>BET</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row-coin">
              <label className="coin-number">2</label>
              <img src={shibacoin} />
              <div className="coin-info-group">
                <div className="coin-name-group">
                  <label className="coin-fullname">SHIBA INU</label>
                  <label className="coin-shortname">SHIB</label>
                </div>
                <label className="coin-price">$0.00005164</label>
              </div>
              <div className="score" style={style2}>
                <div className="line2" />
                <img className="score-img" src={shibacoin} />
                <div className="finish-section">
                  <img src={boneFinish} />
                  <div className="coefficient">
                    <label>x 2.45</label>
                  </div>
                  <div className="bet-btn">
                    <label>BET</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row-coin">
              <label className="coin-number">3</label>
              <img src={samoyedcoin} />
              <div className="coin-info-group">
                <div className="coin-name-group">
                  <label className="coin-fullname">Samoyedcoin</label>
                  <label className="coin-shortname">Samo</label>
                </div>
                <label style={style}>$0.07505</label>
              </div>
              <div className="score" style={style2}>
                <div className="line3" />
                <img className="score-img" src={samoyedcoin} />
                <div className="finish-section">
                  <img src={boneFinish} />
                  <div className="coefficient">
                    <label>x 1.25</label>
                  </div>
                  <div className="bet-btn">
                    <label>BET</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row-coin">
              <label className="coin-number">4</label>
              <img src={soldoge} />
              <div className="coin-info-group">
                <div className="coin-name-group">
                  <label className="coin-fullname">Soldoge</label>
                  <label className="coin-shortname">Sdoge</label>
                </div>
                <label className="coin-price">$0.0003595</label>
              </div>
              <div className="score" style={style3}>
                <div className="line4" />
                <img className="score-img" src={soldoge} />
                <div className="finish-section">
                  <img src={boneFinish} />
                  <div className="coefficient">
                    <label>x 5.25</label>
                  </div>
                  <div className="bet-btn">
                    <label>BET</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="race-aside">
            <div className="announcement">
              <label>THIS RACE</label>
              <img src={finishLine} />
              <div className="change-race-btn">CHANGE RACE</div>
              <div className="value-circle">
                <img src={dollar} />
                {/* <Dollar /> */}
              </div>
              <div className="announcement-description">
                <label>
                  This race is about what meme-coin gets $1 value first! We
                  update coin prices every hour. You can bet on which coin
                  rushes forward next hour, day or week!
                </label>
              </div>
              <div className="current-bets-btn">CURRENT BETS</div>
            </div>
          </div>
        </div>
        <div className="connect-wallet-modal">
          <div className="connect-wallet-content">
            <div className="connect-wallet-header">
              <label>Preference</label>
              <span className="close-button">
                <img src={close} onClick={closeSelectBlockchain} />
              </span>
            </div>
            <div className="connect-wallet-body">
              <h2>SELECT BLOCKCHAIN</h2>
              <div>
                <div>
                  <img src={solana} onClick={closeSelectApplication} />
                  <label>Solana</label>
                </div>
                <div>
                  <img src={binance} />
                  <label>coming soon</label>
                </div>
                <div>
                  <img src={poligon} />
                  <label>coming soon</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="select-application-modal">
          <div className="select-application-content">
            <div className="select-application-header">
              <label>Preference</label>
              <span className="close-button">
                <img src={close} onClick={closeSelectApplication} />
              </span>
            </div>
            <div className="select-application-body">
              <h2>SELECT APPLICATION</h2>
              <div>
                <div onClick={ConnectPhantom}>
                  <img src={phantom} />
                  <label>Phantom</label>
                </div>
                <div>
                  <img src={solflare} />
                  <label>coming soon</label>
                </div>
                <div>
                  <img src={mathWallet} />
                  <label>coming soon</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HowItWorks />
    </div>
  );
}
