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
    }

    return (
      <div className="sidebar">
        <nav>
          <div className="underline">
            <img src={menuSVG} />
          </div>
          <div className="nav-item" onClick={() => ul(0)}>
            <div className="item-container">
              <img src={overviewIcon} />
              <a>Home</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(1)}>
            <div className="item-container">
              <img src={questionIcon} />
              <a>Videos</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(2)}>
            <div className="item-container">
              <img src={stakeIcon} />
              <a>Playlists</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(3)}>
            <div className="item-container">
              <img src={bookIcon} />
              <a>Community</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(4)}>
            <div className="item-container">
              <img src={rocketIcon} />
              <a>Channels</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(5)}>
            <div className="item-container">
              <img src={peegIcon} />
              <a>About</a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
