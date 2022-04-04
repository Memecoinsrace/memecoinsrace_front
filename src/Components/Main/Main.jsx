import React, { useEffect, useState } from "react";
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

export default function Main() {
  const [dogsCoins, setDogsCoins] = useState({
    items: [],
    maxPrice: null,
  });
  const [catsCoins, setCatsCoins] = useState({
    items: [],
    maxPrice: null,
  });
  const [apesCoins, setApesCoins] = useState({
    items: [],
    maxPrice: null,
  });

  // const [dogsMaxPrice, setDogsMaxPrice] = useState();
  // const [catsMaxPrice, setCatsMaxPrice] = useState();
  // const [apesMaxPrice, setApesMaxPrice] = useState();

  const [connectWallet, setConnectWallet] = useState({
    backColor: "rgb(231, 13, 255)",
    inner: "CONNECT WALLET",
    closeBtn: "none",
  });

  const [slideWrapper, setSlideWrapper] = useState(0);

  const [categoriesValue, setCategoriesValue] = useState("0");

  // this.state = {
  //   dogsCoins: {
  //     items: [],
  //     maxPrice: null,
  //   },
  //   apesCoins: {
  //     items: [],
  //     maxPrice: null,
  //   },
  //   catsCoins: {
  //     items: [],
  //     maxPrice: null,
  //   },
  //   connectWallet: {
  //     backColor: "rgb(231, 13, 255)",
  //     inner: "CONNECT WALLET",
  //     closeBtn: "none",
  //   },
  //   slideWrapper: 0,
  //   categoriesValue: "0",
  // };
  // this.ConnectPhantom = this.ConnectPhantom.bind(this);
  // this.DisconnectPhantom = this.DisconnectPhantom.bind(this);
  // this.closeSelectApplication = this.closeSelectApplication.bind(this);
  // this.closeSelectBlockchain = this.closeSelectBlockchain.bind(this);
  // this.getData = this.getData.bind(this);
  // this.coinImage = this.coinImage.bind(this);
  // this.scoreImage = this.scoreImage.bind(this);
  // this.scoreWidth = this.scoreWidth.bind(this);
  // this.selectCategory = this.selectCategory.bind(this);
  // this.handleInputChange = this.handleInputChange.bind(this);

  function handleInputChange(event) {
    // this.setState({ value: event.target.value });
  }

  const selectCategory = async (num) => {
    document.getElementById("dogsCategory").classList.remove("active-category");

    document.getElementById("apesCategory").classList.remove("active-category");

    document.getElementById("catsCategory").classList.remove("active-category");

    switch (num) {
      case 0:
        document
          .getElementById("dogsCategory")
          .classList.add("active-category");
        await setSlideWrapper(0);
        break;
      case 1:
        document
          .getElementById("catsCategory")
          .classList.add("active-category");
        await setSlideWrapper(-100);
        break;
      case 2:
        document
          .getElementById("apesCategory")
          .classList.add("active-category");
        await setSlideWrapper(-200);
        break;
      default:
        break;
    }
  };

  function DisconnectPhantom() {
    localStorage.removeItem("phantomPublicKey");
    setConnectWallet((prev) => {
      return {
        ...prev,
        backColor: "#e70dff",
        inner: "CONNECT WALLET",
        closeBtn: "none",
      };
    });
  }

  const ScoreBack = (symbol) => {
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
  };

  const scoreWidth = (currentPrice, symbol) => {
    let dogsLineWidth = (currentPrice / dogsCoins.maxPrice) * 100 + 10;

    let catsLineWidth = (currentPrice / catsCoins.maxPrice) * 100 + 10;

    let apesLineWidth = (currentPrice / catsCoins.maxPrice) * 100 + 10;

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
  };

  const scoreImage = (coinName) => {
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
  };

  const coinImage = (coinName) => {
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
  };

  const getData = async () => {
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

        let gc = [];
        let cc = [];
        let ac = [];

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

            gc.push(fullData[i]);
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
            // setCatsCoins((prev) => {
            //   return {
            //     ...prev,
            //     items: catsCoins.concat(fullData[i]),
            //   };
            // });

            cc.push(fullData[i]);
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

            // setApesCoins((prev) => {
            //   return {
            //     ...prev,
            //     items: apesCoins.concat(fullData[i]),
            //   };
            // });

            ac.push(fullData[i]);
            const price = fullData[i].rate;
            apesPrices.push(price);
          }
        }

        let dogsMaxPrice = Math.max(...dogsPrices);
        let catsMaxPrice = Math.max(...catsPrices);
        let apesMaxPrice = Math.max(...apesPrices);

        setDogsCoins((prev) => {
          return {
            ...prev,
            items: gc,
            maxPrice: dogsMaxPrice,
          };
        });
        setCatsCoins((prev) => {
          return {
            ...prev,
            items: cc,
            maxPrice: catsMaxPrice,
          };
        });
        setApesCoins((prev) => {
          return {
            ...prev,
            items: ac,
            maxPrice: apesMaxPrice,
          };
        });
      });
    } catch (error) {
      console.log("ERROR => " + error);
    }
  };

  useEffect(() => {
    getData();
    if (localStorage.getItem("phantomPublicKey") === null) {
      setConnectWallet((prev) => {
        return {
          ...prev,
          backColor: "#e70dff",
          inner: "CONNECT WALLET",
          closeBtn: "none",
        };
      });
    } else {
      setConnectWallet((prev) => {
        return {
          ...prev,
          backColor: "#4BC716",
          inner: localStorage.getItem("phantomPublicKey"),
          closeBtn: "block",
        };
      });
    }
  }, []);

  const ConnectPhantom = async () => {
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

          setConnectWallet((prev) => {
            return {
              ...prev,
              backColor: "#4BC716",
              inner: resp.publicKey.toString(),
              closeBtn: "block",
            };
          });

          localStorage.setItem("phantomPublicKey", resp.publicKey.toString());
        }
      } else {
        alert("Solana provider is not found");
      }
    } catch (ex) {
      alert(ex);
    }
  };

  const closeSelectApplication = () => {
    let elem = document.querySelector(".select-application-modal");
    elem.classList.toggle("show-modal");
  };

  const closeSelectBlockchain = () => {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  };

  return (
    <div className="main">
      <div className="overview">
        <div className="head">
          <div className="categories">
            <div
              id="dogsCategory"
              className="active-category"
              onClick={() => selectCategory(0)}
            >
              <span>
                <img alt="" src={bone} />
              </span>
              <label>DOGS</label>
              <label>COINS</label>
            </div>
            <div id="catsCategory" onClick={() => selectCategory(1)}>
              <span>
                <img alt="" src={fish} />
              </span>
              <label>CATS</label>
              <label>COINS</label>
            </div>
            <div id="apesCategory" onClick={() => selectCategory(2)}>
              <span>
                <img alt="" src={banan} />
              </span>
              <label>APES</label>
              <label>COINS</label>
            </div>
          </div>
          <div className="categories-mini">
            <select
              name="categories-mini"
              value={categoriesValue}
              onChange={handleInputChange}
            >
              <option value="0">DOGS COINS</option>
              <option value="1">CATS COINS</option>
              <option value="2">APES COINS</option>
            </select>
          </div>
          <div className="current-bets-btn" onClick={() => getData()}>
            CURRENT BETS
          </div>
          <ConnectWallet
            DisconnectPhantom={DisconnectPhantom}
            backColor={connectWallet.backColor}
            inner={connectWallet.inner}
            closeBtn={connectWallet.closeBtn}
          />
        </div>
        {/* <div className="coins-sort">
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
          </div> */}
        <div class="slide-wrapper" style={{ marginLeft: slideWrapper + "%" }}>
          <div class="slide">
            {dogsCoins.items
              .sort((a, b) => (a.rate > b.rate ? -1 : 1))
              .map((coin, index) => {
                return (
                  <div className="row-coin" key={coin.id}>
                    <div className="row-coin-head">
                      <label className="coin-number">{index + 1}</label>
                      {coinImage(coin.symbol)}
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
                    </div>
                    <div className="row-coin-body">
                      <div
                        className="score"
                        style={{ background: ScoreBack(coin.symbol) }}
                      >
                        <div className="score-group">
                          {scoreWidth(coin.rate, coin.symbol)}
                          {scoreImage(coin.symbol)}
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
                  </div>
                );
              })}
          </div>
          <div class="slide">
            {catsCoins.items
              .sort((a, b) => (a.rate > b.rate ? -1 : 1))
              .map((coin, index) => {
                return (
                  <div className="row-coin" key={coin.id}>
                    <div className="row-coin-head">
                      <label className="coin-number">{index + 1}</label>
                      {coinImage(coin.symbol)}
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
                    </div>
                    <div className="row-coin-body">
                      <div
                        className="score"
                        style={{ background: ScoreBack(coin.symbol) }}
                      >
                        <div className="score-group">
                          {scoreWidth(coin.rate, coin.symbol)}
                          {scoreImage(coin.symbol)}
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
                  </div>
                );
              })}
          </div>
          <div class="slide">
            {apesCoins.items
              .sort((a, b) => (a.rate > b.rate ? -1 : 1))
              .map((coin, index) => {
                return (
                  <div className="row-coin" key={coin.id}>
                    <div className="row-coin-head">
                      <label className="coin-number">{index + 1}</label>
                      {coinImage(coin.symbol)}
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
                    </div>
                    <div className="row-coin-body">
                      <div
                        className="score"
                        style={{ background: ScoreBack(coin.symbol) }}
                      >
                        <div className="score-group">
                          {scoreWidth(coin.rate, coin.symbol)}
                          {scoreImage(coin.symbol)}
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
                  </div>
                );
              })}
          </div>
        </div>
        <div className="connect-wallet-modal">
          <div className="connect-wallet-content">
            <div className="connect-wallet-header">
              <label>Preference</label>
              <span className="close-button">
                <img alt="" src={close} onClick={closeSelectBlockchain} />
              </span>
            </div>
            <div className="connect-wallet-body">
              <h2>SELECT BLOCKCHAIN</h2>
              <div>
                <div>
                  <img alt="" src={solana} onClick={closeSelectApplication} />
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
                <img alt="" src={close} onClick={closeSelectApplication} />
              </span>
            </div>
            <div className="select-application-body">
              <h2>SELECT APPLICATION</h2>
              <div>
                <div onClick={ConnectPhantom}>
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
        DisconnectPhantom={DisconnectPhantom}
        backColor={connectWallet.backColor}
        inner={connectWallet.inner}
        closeBtn={connectWallet.closeBtn}
      />
      <Bets />
    </div>
  );
}
