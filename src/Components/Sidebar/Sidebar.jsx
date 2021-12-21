import React from "react";
import "./Sidebar.scss";
import menuSVG from "../../SVG/menu-svg.svg";
import logo from "../../SVG/Logo_MCR.svg";
import overviewIcon from "../../SVG/overview.svg";
import questionIcon from "../../SVG/question.svg";
import stakeIcon from "../../SVG/stake.svg";
import bookIcon from "../../SVG/book.svg";
import rocketIcon from "../../SVG/rocket.svg";
import peegIcon from "../../SVG/peeg.svg";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.changeSection = this.changeSection.bind(this);
  }

  changeSection = (e) => {
    // alert(e.target.className);
    // let exElem = document.querySelector('.active');
    // exElem.classList.toggle('.active');
    // let elem = document.querySelector(e.taget.className);
    // elem.classList.toggle('.active');
    // let elem = document.getElementsByClassName(e.target.className);
    // modal.classList.toggle('active');
  };

  render() {
    function ul(index) {
      console.log("click!" + index);

      var underlines = document.querySelectorAll(".underline");

      for (var i = 0; i < underlines.length; i++) {
        underlines[i].style.transform =
          "translate3d(0, " + index * 100 + "%,0)";
      }

      let q = document.querySelectorAll(".active-item");

      for (let i of q) {
        i.classList.remove("active-item");
      }

      switch (index) {
        case 0:
          document
            .querySelector("#overview-item")
            .classList.toggle("active-item");
          break;
        case 1:
          document
            .querySelector("#howitworks-item")
            .classList.toggle("active-item");
          break;
        case 2:
          document.querySelector("#bets-item").classList.toggle("active-item");
          break;
        case 3:
          document.querySelector("#docs-item").classList.toggle("active-item");
          break;
        case 4:
          document
            .querySelector("#donats-item")
            .classList.toggle("active-item");
          break;
        case 5:
          document.querySelector("#stake-item").classList.toggle("active-item");
          break;
        default:
          break;
      }
    }

    return (
      <div className="sidebar">
        <img className="logo-nav" src={logo} />
        <nav>
          <div className="underline">
            <img src={menuSVG} />
          </div>
          <div className="nav-item" onClick={() => ul(0)}>
            <div id="overview-item" className="item-container active-item">
              <img src={overviewIcon} />
              <a>Overview</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(1)}>
            <div id="howitworks-item" className="item-container">
              <img src={questionIcon} />
              <a>How it works</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(2)}>
            <div id="bets-item" className="item-container">
              <img src={stakeIcon} />
              <a>Bets</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(3)}>
            <div id="docs-item" className="item-container">
              <img src={bookIcon} />
              <a>Docs</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(4)}>
            <div id="donats-item" className="item-container">
              <img src={rocketIcon} />
              <a>Donats</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(5)}>
            <div id="stake-item" className="item-container">
              <img src={peegIcon} />
              <a>Stake</a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
