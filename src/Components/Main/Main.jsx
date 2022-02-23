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
import cato from "../../PNG/icon-cato@2x.png";
import hima from "../../PNG/icon-HIMA@2x.png";
import banana from "../../PNG/icon-apeswap@2x.png";
import ape from "../../PNG/icon-APE-X@2x.png";
import apex from "../../PNG/icon-APE@2x.png";
import solape from "../../PNG/icon-SOLAPE@2x.png";
import gdt from "../../PNG/icon-GDT@2x.png";
import boneFinish from "../../SVG/bone-finish.svg";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import bone from "../../SVG/bone.svg";
import fish from "../../SVG/fish.svg";
import banan from "../../SVG/banana.svg";
import arrowDown from "../../SVG/arrow_down.svg";
import arrowHeight from "../../SVG/arrow_height.svg";
import arrowHeight2 from "../../SVG/arrow_height-2.svg";
import axios from "axios";
import HowItWorks from "../HowItWorks/HowItWorks";
import Bets from "../Bets/Bets";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      connectWallet: {
        backColor: "rgb(231, 13, 255)",
        inner: "CONNECT WALLET",
        closeBtn: "none",
      },
      slideWrapper: 0,
    };
    this.ConnectPhantom = this.ConnectPhantom.bind(this);
    this.DisconnectPhantom = this.DisconnectPhantom.bind(this);
    this.closeSelectApplication = this.closeSelectApplication.bind(this);
    this.closeSelectBlockchain = this.closeSelectBlockchain.bind(this);
    this.getData = this.getData.bind(this);
    this.coinImage = this.coinImage.bind(this);
    this.scoreImage = this.scoreImage.bind(this);
    this.scoreWidth = this.scoreWidth.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
  }

  async selectCategory(num) {
    document.getElementById("dogsCategory").classList.remove("active-category");

    document.getElementById("apesCategory").classList.remove("active-category");

    document.getElementById("catsCategory").classList.remove("active-category");

    switch (num) {
      case 0:
        document
          .getElementById("dogsCategory")
          .classList.add("active-category");
        await this.setState({
          slideWrapper: 0,
        });
        break;
      case 1:
        document
          .getElementById("catsCategory")
          .classList.add("active-category");
        await this.setState({
          slideWrapper: -100,
        });
        break;
      case 2:
        document
          .getElementById("apesCategory")
          .classList.add("active-category");
        await this.setState({
          slideWrapper: -200,
        });
        break;
      default:
        break;
    }
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

  ScoreBack(symbol) {
    switch (symbol) {
      case "DOGE":
        return "transparent linear-gradient(270deg, #FFE640 0%, #F0F8FF 100%) 0% 0% no-repeat padding-box";
      case "SAMO":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "WOOF":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "SHIBX":
        return "transparent linear-gradient(270deg, #FF6D6E 0%, #F1EFF8 100%) 0% 0% no-repeat padding-box";
      case "SAMU":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "HOGE":
        return "transparent linear-gradient(270deg, #A0A9C7 0%, #EEF0FF 100%) 0% 0% no-repeat padding-box";
      case "SDOGE":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "SHIB":
        return "transparent linear-gradient(270deg, #A0A9C7 0%, #EEF0FF 100%) 0% 0% no-repeat padding-box";
      case "ELON":
        return "transparent linear-gradient(270deg, #A0A9C7 0%, #EEF0FF 100%) 0% 0% no-repeat padding-box";
      case "KISHU":
        return "transparent linear-gradient(270deg, #A0A9C7 0%, #EEF0FF 100%) 0% 0% no-repeat padding-box";
      case "CATE":
        return "transparent linear-gradient(270deg, #A0A9C7 0%, #EEF0FF 100%) 0% 0% no-repeat padding-box";
      case "CATO":
        return "transparent linear-gradient(270deg, #FFE640 0%, #F0F8FF 100%) 0% 0% no-repeat padding-box";
      case "HIMA":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "MEOW":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "KITTY":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "BANANA":
        return "transparent linear-gradient(270deg, #FFE640 0%, #F0F8FF 100%) 0% 0% no-repeat padding-box";
      case "APE-X":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "APEX":
        return "transparent linear-gradient(270deg, #FF6D6E 0%, #F1EFF8 100%) 0% 0% no-repeat padding-box";
      case "SOLAPE":
        return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "GDT":
        return "transparent linear-gradient(270deg, #FFE640 0%, #F0F8FF 100%) 0% 0% no-repeat padding-box";
      default:
        break;
    }
  }

  scoreWidth(currentPrice, symbol) {
    // switch (symbol) {
    //   case "DOGE":
    //     let dogsLineWidth =
    //       (currentPrice / this.state.dogsCoins.maxPrice) * 100 + 10;
    //     return (
    //       <div
    //         className="line"
    //         style={{
    //           width: dogsLineWidth + "%",
    //           background:
    //             "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
    //         }}
    //       />
    //     );
    //   case
    //   case "cats":
    //     let catsLineWidth =
    //       (currentPrice / this.state.catsCoins.maxPrice) * 100 + 10;
    //     return <div className="line" style={{ width: catsLineWidth + "%" }} />;
    //   case "apes":
    //     let apesLineWidth =
    //       (currentPrice / this.state.catsCoins.maxPrice) * 100 + 10;
    //     return <div className="line" style={{ width: apesLineWidth + "%" }} />;
    //   default:
    //     break;
    // }

    let dogsLineWidth =
      (currentPrice / this.state.dogsCoins.maxPrice) * 100 + 10;

    let catsLineWidth =
      (currentPrice / this.state.catsCoins.maxPrice) * 100 + 10;

    let apesLineWidth =
      (currentPrice / this.state.catsCoins.maxPrice) * 100 + 10;

    switch (symbol) {
      case "DOGE":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SAMO":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "WOOF":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SHIBX":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFFFFF 0%, #FF5052 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SAMU":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "HOGE":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #D7E5FC 0%, #CFCFCF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SDOGE":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SHIB":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #D7E5FC 0%, #CFCFCF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "ELON":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #D7E5FC 0%, #CFCFCF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "KISHU":
        return (
          <div
            className="line"
            style={{
              width: dogsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #D7E5FC 0%, #CFCFCF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      // case "CATE":
      //   return (
      //     <div
      //       className="line"
      //       style={{
      //         width: catsLineWidth + "%",
      //         background:
      //           "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
      //       }}
      //     />
      //   );
      case "CATO":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "HIMA":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      // case "MEOW":
      //   return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      // case "KITTY":
      //   return "transparent linear-gradient(270deg, #A6FFEA 0%, #DDBEFF 100%) 0% 0% no-repeat padding-box";
      case "BANANA":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "APE-X":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "APEX":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFFFFF 0%, #FF5052 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "SOLAPE":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(265deg, #CD2EF9 0%, #1FDDAF 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      case "GDT":
        return (
          <div
            className="line"
            style={{
              width: catsLineWidth + "%",
              background:
                "transparent linear-gradient(270deg, #FFF5CA 0%, #F6BE06 100%) 0% 0% no-repeat padding-box",
            }}
          />
        );
      default:
        break;
    }
  }

  scoreImage(coinName) {
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
      case "CATO":
        return <img className="score-img" alt="" src={cato} />;
      case "HIMA":
        return <img className="score-img" alt="" src={hima} />;
      case "BANANA":
        return <img className="score-img" alt="" src={banana} />;
      case "APE-X":
        return <img className="score-img" alt="" src={ape} />;
      case "APEX":
        return <img className="score-img" alt="" src={apex} />;
      case "SOLAPE":
        return <img className="score-img" alt="" src={solape} />;
      case "GDT":
        return <img className="score-img" alt="" src={gdt} />;
      default:
        return;
    }
  }

  coinImage(coinName) {
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
        return <img alt="" src={elon} />;
      case "WOOF":
        return <img alt="" src={woof} />;
      case "HOGE":
        return <img alt="" src={hoge} />;
      case "KISHU":
        return <img alt="" src={kishu} />;
      case "SHIBX":
        return <img alt="" src={shibx} />;
      case "SAMU":
        return <img alt="" src={samu} />;
      case "CATO":
        return <img alt="" src={cato} />;
      case "HIMA":
        return <img alt="" src={hima} />;
      case "BANANA":
        return <img alt="" src={banana} />;
      case "APE-X":
        return <img alt="" src={ape} />;
      case "APEX":
        return <img alt="" src={apex} />;
      case "SOLAPE":
        return <img alt="" src={solape} />;
      case "GDT":
        return <img alt="" src={gdt} />;
      default:
        return;
    }
  }

  getData = async () => {
    var self = this;

    try {
      axios({
        method: "get",
        url: "https://api.memecoinsrace.com/rates",
      }).then(function (response) {
        const fullData = response.data.rates;

        console.log("full data => ", fullData);

        let dogsPrices = [];
        let catsPrices = [];
        let apesPrices = [];

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

            self.setState({
              dogsCoins: {
                items: self.state.dogsCoins.items.concat(fullData[i]),
              },
            });
            const price = fullData[i].rate;
            dogsPrices.push(price);
          }

          if (
            element.symbol === "CATE" ||
            element.symbol === "CATO" ||
            element.symbol === "HIMA" ||
            element.symbol === "MEOW" ||
            element.symbol === "KITTY"
          ) {
            self.setState({
              catsCoins: {
                items: self.state.catsCoins.items.concat(fullData[i]),
              },
            });
            //console.log("CATS COINS => ", element);
            const price = fullData[i].rate;
            catsPrices.push(price);
          }

          if (
            element.symbol === "BANANA" ||
            element.symbol === "APE-X" ||
            element.symbol === "APEX" ||
            element.symbol === "SOLAPE" ||
            element.symbol === "GDT"
          ) {
            if (element.symbol === "APE-X") {
              element.rate = element.rate.toFixed(10);
            }

            self.setState({
              apesCoins: {
                items: self.state.apesCoins.items.concat(fullData[i]),
              },
            });

            const price = fullData[i].rate;
            apesPrices.push(price);
          }
        }

        let dogs = self.state.dogsCoins.items;
        let cats = self.state.catsCoins.items;
        let apes = self.state.apesCoins.items;

        let dogsMaxPrice = Math.max(...dogsPrices);
        let catsMaxPrice = Math.max(...catsPrices);
        let apesMaxPrice = Math.max(...apesPrices);

        self.state.dogsCoins.maxPrice = dogsMaxPrice;
        self.state.catsCoins.maxPrice = catsMaxPrice;
        self.state.apesCoins.maxPrice = apesMaxPrice;

        self.setState({
          dogsCoins: {
            items: dogs,
            maxPrice: dogsMaxPrice,
          },
          catsCoins: {
            items: cats,
            maxPrice: catsMaxPrice,
          },
          apesCoins: {
            items: apes,
            maxPrice: apesMaxPrice,
          },
        });

        console.log(self.state.dogsCoins.items);
        console.log(self.state.catsCoins.items);
        console.log(self.state.apesCoins.items);
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
              <div
                id="dogsCategory"
                className="active-category"
                onClick={async () => await this.selectCategory(0)}
              >
                <span>
                  <img alt="" src={bone} />
                </span>
                <label>DOGS</label>
                <label>COINS</label>
              </div>
              <div
                id="catsCategory"
                onClick={async () => await this.selectCategory(1)}
              >
                <span>
                  <img alt="" src={fish} />
                </span>
                <label>CATS</label>
                <label>COINS</label>
              </div>
              <div
                id="apesCategory"
                onClick={async () => await this.selectCategory(2)}
              >
                <span>
                  <img alt="" src={banan} />
                </span>
                <label>APES</label>
                <label>COINS</label>
              </div>
            </div>
            <div className="current-bets-btn">CURRENT BETS</div>
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
          </div>
          <div id="slideshow">
            <div
              class="slide-wrapper"
              style={{ marginLeft: this.state.slideWrapper + "%" }}
            >
              <div class="slide">
                {this.state.dogsCoins.items
                  .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                  .map((coin, index) => {
                    return (
                      <div className="row-coin" key={coin.id}>
                        <label className="coin-number">{index + 1}</label>
                        {this.coinImage(coin.symbol)}
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
                        <div
                          className="score"
                          style={{ background: this.ScoreBack(coin.symbol) }}
                        >
                          <div className="score-group">
                            {this.scoreWidth(coin.rate, coin.symbol)}
                            {this.scoreImage(coin.symbol)}
                          </div>
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
              <div class="slide">
                {this.state.catsCoins.items
                  .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                  .map((coin, index) => {
                    return (
                      <div className="row-coin" key={coin.id}>
                        <label className="coin-number">{index + 1}</label>
                        {this.coinImage(coin.symbol)}
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
                        <div
                          className="score"
                          style={{ background: this.ScoreBack(coin.symbol) }}
                        >
                          <div className="score-group">
                            {this.scoreWidth(coin.rate, coin.symbol)}
                            {this.scoreImage(coin.symbol)}
                          </div>
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
              <div class="slide">
                {this.state.apesCoins.items
                  .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                  .map((coin, index) => {
                    return (
                      <div className="row-coin" key={coin.id}>
                        <label className="coin-number">{index + 1}</label>
                        {this.coinImage(coin.symbol)}
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
                        <div
                          className="score"
                          style={{ background: this.ScoreBack(coin.symbol) }}
                        >
                          <div className="score-group">
                            {this.scoreWidth(coin.rate, coin.symbol)}
                            {this.scoreImage(coin.symbol)}
                          </div>
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
            </div>
          </div>
          {/* <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={3}
            dragEnabled={false}
            currentSlide={this.state.currentSlide}
            orientation="horizontal"
          >
            <Slider>
              <Slide index={0}>
                <div className="race-table">
                  {this.state.dogsCoins.items
                    .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                    .map((coin, index) => {
                      return (
                        <div className="row-coin" key={coin.id}>
                          <label className="coin-number">{index + 1}</label>
                          {this.coinImage(coin.symbol)}
                          <div className="coin-info-group">
                            <div className="coin-name-group">
                              <label className="coin-fullname">
                                {coin.name}
                              </label>
                              <label className="coin-shortname">
                                {coin.symbol}
                              </label>
                            </div>
                            <label className="coin-price">
                              ${coin.rate.toString().substr(0, 12)}
                            </label>
                          </div>
                          <div
                            className="score"
                            style={{ background: this.ScoreBack(coin.symbol) }}
                          >
                            <div className="score-group">
                              {this.scoreWidth(coin.rate, "dogs")}
                              {this.scoreImage(coin.symbol)}
                            </div>
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
              </Slide>
              <Slide index={1}>
                <div className="race-table">
                  {this.state.catsCoins.items
                    .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                    .map((coin, index) => {
                      return (
                        <div className="row-coin" key={coin.id}>
                          <label className="coin-number">{index + 1}</label>
                          {this.coinImage(coin.symbol)}
                          <div className="coin-info-group">
                            <div className="coin-name-group">
                              <label className="coin-fullname">
                                {coin.name}
                              </label>
                              <label className="coin-shortname">
                                {coin.symbol}
                              </label>
                            </div>
                            <label className="coin-price">
                              ${coin.rate.toString().substr(0, 12)}
                            </label>
                          </div>
                          <div
                            className="score"
                            style={{ background: this.ScoreBack(coin.symbol) }}
                          >
                            <div className="score-group">
                              {this.scoreWidth(coin.rate, "cats")}
                              {this.scoreImage(coin.symbol)}
                            </div>
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
              </Slide>
              <Slide index={2}>
                <div className="race-table">
                  {this.state.apesCoins.items
                    .sort((a, b) => (a.rate > b.rate ? -1 : 1))
                    .map((coin, index) => {
                      return (
                        <div className="row-coin" key={coin.id}>
                          <label className="coin-number">{index + 1}</label>
                          {this.coinImage(coin.symbol)}
                          <div className="coin-info-group">
                            <div className="coin-name-group">
                              <label className="coin-fullname">
                                {coin.name}
                              </label>
                              <label className="coin-shortname">
                                {coin.symbol}
                              </label>
                            </div>
                            <label className="coin-price">
                              ${coin.rate.toString().substr(0, 12)}
                            </label>
                          </div>
                          <div
                            className="score"
                            style={{ background: this.ScoreBack(coin.symbol) }}
                          >
                            <div className="score-group">
                              {this.scoreWidth(coin.rate, "cats")}
                              {this.scoreImage(coin.symbol)}
                            </div>
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
              </Slide>
            </Slider>
          </CarouselProvider> */}
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
