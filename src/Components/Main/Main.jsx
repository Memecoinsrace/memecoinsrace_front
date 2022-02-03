import React from "react";
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
import elon from "../../PNG/icon-DogelonMars@2x.png";
import woof from "../../PNG/icon-woof@2x.png";
import hoge from "../../PNG/icon-hoge@2x.png";
import kishu from "../../PNG/icon-kishu@2x.png";
import shibx from "../../PNG/icon-shibavax@2x.png";
import samu from "../../PNG/icon-SAMU@2x.png";
import boneFinish from "../../SVG/bone-finish.svg";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import bone from "../../SVG/bone.svg";
import fish from "../../SVG/fish.svg";
import banana from "../../SVG/banana.svg";
import arrowDown from "../../SVG/arrow_down.svg";
import arrowHeight from "../../SVG/arrow_height.svg";
import arrowHeight2 from "../../SVG/arrow_height-2.svg";
import axios from "axios";
import HowItWorks from "../HowItWorks/HowItWorks";
import Bets from "../Bets/Bets";
import { sendAndConfirmTransaction } from "@solana/web3.js";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        dogsCoins: {
          items: [],
          maxPrice: null,
        },
        apesCoins: {
          items: [],
          maxPrice: null,
        },
        catsCoins: {
          items: [],
          maxPrice: null,
        },
      },
      connectWallet: {
        backColor: "rgb(231, 13, 255)",
        inner: "CONNECT WALLET",
        closeBtn: "none",
      },
    };
    this.ConnectPhantom = this.ConnectPhantom.bind(this);
    this.DisconnectPhantom = this.DisconnectPhantom.bind(this);
    this.closeSelectApplication = this.closeSelectApplication.bind(this);
    this.closeSelectBlockchain = this.closeSelectBlockchain.bind(this);
    this.getData = this.getData.bind(this);
    this.CoinImage = this.CoinImage.bind(this);
    this.ScoreImage = this.ScoreImage.bind(this);
    this.ScoreWidth = this.ScoreWidth.bind(this);
  }

  DisconnectPhantom() {
    localStorage.removeItem("phantomPublicKey");
    this.setState({
      connectWallet: {
        backColor: "#e70dff",
        inner: "CONNECT WALLET",
        closeBtn: "none",
      },
    });
  }

  // ScoreBack() {
  //   switch (key) {
  //     case value:

  //       break;

  //     default:
  //       break;
  //   }
  // }

  ScoreWidth(currentPrice) {
    let lineWidth =
      (currentPrice / this.state.data.dogsCoins.maxPrice) * 100 + 10;
    return <div className="line" style={{ width: lineWidth + "%" }} />;
  }

  ScoreImage(coinName) {
    switch (coinName) {
      case "SDOGE":
        return <img className="score-img" alt="" src={soldoge} />;
      case "SHIB":
        return <img className="score-img" alt="" src={shibacoin} />;
      case "DOGE":
        return <img className="score-img" alt="" src={dogecoin} />;
      case "SAMO":
        return <img className="score-img" alt="" src={samoyedcoin} />;
      case "ELON":
        return <img className="score-img" alt="" src={elon} />;
      case "WOOF":
        return <img className="score-img" alt="" src={woof} />;
      case "HOGE":
        return <img className="score-img" alt="" src={hoge} />;
      case "KISHU":
        return <img className="score-img" alt="" src={kishu} />;
      case "SHIBX":
        return <img className="score-img" alt="" src={shibx} />;
      case "SAMU":
        return <img className="score-img" alt="" src={samu} />;
      default:
        return <img className="score-img" alt="" src={dogecoin} />;
    }
  }

  CoinImage(coinName) {
    switch (coinName) {
      case "SDOGE":
        return <img alt="" src={soldoge} />;
      case "SHIB":
        return <img alt="" src={shibacoin} />;
      case "DOGE":
        return <img alt="" src={dogecoin} />;
      case "SAMO":
        return <img alt="" src={samoyedcoin} />;
      case "ELON":
        return <img className="score-img" alt="" src={elon} />;
      case "WOOF":
        return <img className="score-img" alt="" src={woof} />;
      case "HOGE":
        return <img className="score-img" alt="" src={hoge} />;
      case "KISHU":
        return <img className="score-img" alt="" src={kishu} />;
      case "SHIBX":
        return <img className="score-img" alt="" src={shibx} />;
      case "SAMU":
        return <img className="score-img" alt="" src={samu} />;
      default:
        return <img alt="" src={soldoge} />;
    }
  }

  getData = async () => {
    var self = this;

    try {
      axios({
        method: "get",
        url: "https://api.memecoinsrace.com/rates",
      }).then(function (response) {
        self.setState({
          data: {
            dogsCoins: {
              items: [],
              maxPrice: null,
            },
          },
        });

        const fullData = response.data.rates;

        console.log("full data => ", fullData);

        let prices = [];

        for (let i = 0; i < fullData.length; i++) {
          const element = fullData[i];

          if (
            element.symbol === "DOGE" ||
            element.symbol === "SAMO" ||
            element.symbol === "SDOGE" ||
            element.symbol === "SHIB" ||
            element.symbol === "ELON" ||
            element.symbol === "WOOF" ||
            element.symbol === "HOGE" ||
            element.symbol === "KISHU" ||
            element.symbol === "SHIBX" ||
            element.symbol === "SAMU"
          ) {
            if (element.symbol === "ELON" || element.symbol === "KISHU") {
              element.rate = element.rate.toFixed(10);
            }

            // self.state.data.dogsCoins.items.push(fullData[i]);
            // self.setState(self.state.data);

            self.setState({
              data: {
                dogsCoins: {
                  items: self.state.data.dogsCoins.items.concat(fullData[i]),
                },
              },
            });
            const price = fullData[i].rate;
            prices.push(price);
          }
        }

        let dogs = self.state.data.dogsCoins.items;

        let QmaxPrice = Math.max(...prices);
        self.state.data.dogsCoins.maxPrice = QmaxPrice;
        self.setState({
          data: {
            dogsCoins: {
              items: dogs,
              maxPrice: QmaxPrice,
            },
          },
        });
      });
    } catch (error) {
      console.log("ERROR => " + error);
    }
  };

  componentDidMount = async () => {
    await this.getData();
    if (localStorage.getItem("phantomPublicKey") === null) {
      this.setState({
        connectWallet: {
          backColor: "#e70dff",
          inner: "CONNECT WALLET",
          closeBtn: "none",
        },
      });
    } else {
      this.setState({
        connectWallet: {
          inner: localStorage.getItem("phantomPublicKey"),
          closeBtn: "block",
          backColor: "#4BC716",
        },
      });
    }
  };

  async ConnectPhantom() {
    try {
      if ("solana" in window) {
        let provider = window.solana;

        if (provider.isPhantom) {
          const resp = await window.solana.connect();

          document
            .querySelector(".select-application-modal")
            .classList.toggle("show-modal");
          document
            .querySelector(".connect-wallet-modal")
            .classList.toggle("show-modal");

          this.setState({
            connectWallet: {
              inner: resp.publicKey.toString(),
              closeBtn: "block",
              backColor: "#4BC716",
            },
          });

          localStorage.setItem("phantomPublicKey", resp.publicKey.toString());
        }
      } else {
        alert("Solana provider is not found");
      }
    } catch (ex) {
      alert(ex);
    }
  }

  closeSelectApplication() {
    let elem = document.querySelector(".select-application-modal");
    elem.classList.toggle("show-modal");
  }

  closeSelectBlockchain() {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  }

  render() {
    return (
      <div className="main">
        <div className="overview">
          <div className="head">
            <div className="categories">
              <div className="active-category">
                <span>
                  <img alt="" src={bone} />
                </span>
                <label>DOGS</label>
                <label>COINS</label>
              </div>
              <div>
                <span>
                  <img alt="" src={fish} />
                </span>
                <label>CATS</label>
                <label>COINS</label>
              </div>
              <div>
                <span>
                  <img alt="" src={banana} />
                </span>
                <label>APES</label>
                <label>COINS</label>
              </div>
            </div>
            <ConnectWallet
              DisconnectPhantom={this.DisconnectPhantom}
              backColor={this.state.connectWallet.backColor}
              inner={this.state.connectWallet.inner}
              closeBtn={this.state.connectWallet.closeBtn}
            />
          </div>
          <div className="coins-sort">
            <div>
              <label>1 day</label>
              <span>
                <img alt="" src={arrowDown} />
              </span>
            </div>
            <div>
              <label>1 week</label>
              <span>
                <img alt="" src={arrowHeight} />
              </span>
            </div>
            <div>
              <label>1 month</label>
              <span>
                <img alt="" src={arrowHeight} />
              </span>
            </div>
            <div>
              <label>6 months</label>
              <span>
                <img alt="" src={arrowHeight} />
              </span>
            </div>
            <div>
              <label>1 year</label>
              <span>
                <img alt="" src={arrowHeight} />
              </span>
            </div>
            <div>
              <label>Odds</label>
              <span>
                <img alt="" src={arrowHeight2} />
              </span>
            </div>
            <div
              className="current-bets-btn"
              onClick={async () => await this.getData()}
            >
              CURRENT BETS
            </div>
          </div>
          <div className="race-group">
            <div className="race-table">
              {this.state.data.dogsCoins.items
                .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                .map((coin, index) => {
                  return (
                    <div className="row-coin" key={coin.id}>
                      <label className="coin-number">{index + 1}</label>
                      {this.CoinImage(coin.symbol)}
                      <div className="coin-info-group">
                        <div className="coin-name-group">
                          <label className="coin-fullname">{coin.name}</label>
                          <label className="coin-shortname">
                            {coin.symbol}
                          </label>
                        </div>
                        <label className="coin-price">
                          ${coin.rate.toString().substr(0, 12)}
                        </label>
                      </div>
                      <div className="score">
                        <div className="score-group">
                          {this.ScoreWidth(coin.rate)}
                          {this.ScoreImage(coin.symbol)}
                        </div>
                        {/* <div className="line" /> */}
                        {/* <img className="score-img" src={dogecoin} /> */}
                        <div className="finish-section">
                          <img alt="" src={boneFinish} />
                          <div className="coefficient">
                            <label>x 0.15</label>
                          </div>
                          <div className="bet-btn">
                            <label>BET</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* <div className="race-aside">
              <div className="announcement">
                <label>THIS RACE</label>
                <img src={finishLine} />
                <div className="change-race-btn">CHANGE RACE</div>
                <div className="value-circle">
                  <img src={dollar} />
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
            </div> */}
          </div>
          <div className="connect-wallet-modal">
            <div className="connect-wallet-content">
              <div className="connect-wallet-header">
                <label>Preference</label>
                <span className="close-button">
                  <img
                    alt=""
                    src={close}
                    onClick={this.closeSelectBlockchain}
                  />
                </span>
              </div>
              <div className="connect-wallet-body">
                <h2>SELECT BLOCKCHAIN</h2>
                <div>
                  <div>
                    <img
                      alt=""
                      src={solana}
                      onClick={this.closeSelectApplication}
                    />
                    <label>Solana</label>
                  </div>
                  <div>
                    <img alt="" src={binance} />
                    <label>coming soon</label>
                  </div>
                  <div>
                    <img alt="" src={poligon} />
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
                  <img
                    alt=""
                    src={close}
                    onClick={this.closeSelectApplication}
                  />
                </span>
              </div>
              <div className="select-application-body">
                <h2>SELECT APPLICATION</h2>
                <div>
                  <div onClick={this.ConnectPhantom}>
                    <img alt="" src={phantom} />
                    <label>Phantom</label>
                  </div>
                  <div>
                    <img alt="" src={solflare} />
                    <label>coming soon</label>
                  </div>
                  <div>
                    <img alt="" src={mathWallet} />
                    <label>coming soon</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <HowItWorks
          DisconnectPhantom={this.DisconnectPhantom}
          backColor={this.state.connectWallet.backColor}
          inner={this.state.connectWallet.inner}
          closeBtn={this.state.connectWallet.closeBtn}
        />
        <Bets />
      </div>
    );
  }
}
