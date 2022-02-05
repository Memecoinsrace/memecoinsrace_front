import React from "react";
import "./Sidebar.scss";
import twitter from "../../SVG/Social/twitter.svg";
import telegram from "../../SVG/Social/telegram.svg";
import discord from "../../SVG/Social/discord.svg";
import medium from "../../SVG/Social/medium.svg";
import menuSVG from "../../SVG/menu-svg.svg";
import logo from "../../SVG/Logo_MCR.svg";
import overviewIcon from "../../SVG/overview.svg";
import questionIcon from "../../SVG/question.svg";
import stakeIcon from "../../SVG/stake.svg";
import bookIcon from "../../SVG/book.svg";
import rocketIcon from "../../SVG/rocket.svg";
import peegIcon from "../../SVG/peeg.svg";

export default class Sidebar extends React.Component {
  render() {
    function ul(index) {
      var underlines = document.querySelectorAll(".underline");

      if (index !== 3) {
        for (var i = 0; i < underlines.length; i++) {
          underlines[i].style.transform =
            "translate3d(0, " + index * 100 + "%,0)";
        }

        let q = document.querySelectorAll(".active-item");

        for (let i of q) {
          i.classList.remove("active-item");
        }
      }

      switch (index) {
        case 0:
          document
            .querySelector("#overview-item")
            .classList.toggle("active-item");
          document.querySelector(".overview").style.maxHeight = "100%";
          document.querySelector(".how-it-works").style.maxHeight = "0";
          document.querySelector(".bets").style.maxHeight = "0";
          break;
        case 1:
          document
            .querySelector("#howitworks-item")
            .classList.toggle("active-item");
          document.querySelector(".overview").style.maxHeight = "0";
          document.querySelector(".bets").style.maxHeight = "0";
          document.querySelector(".how-it-works").style.maxHeight = "100%";
          break;
        case 2:
          document.querySelector("#bets-item").classList.toggle("active-item");
          document.querySelector(".overview").style.maxHeight = "0";
          document.querySelector(".bets").style.maxHeight = "100%";
          document.querySelector(".how-it-works").style.maxHeight = "0";
          break;
        case 3:
          //document.querySelector("#docs-item").classList.toggle("active-item");
          break;
        case 4:
          document
            .querySelector("#donats-item")
            .classList.toggle("active-item");
          document.querySelector(".overview").style.maxHeight = "0";
          document.querySelector(".bets").style.maxHeight = "100%";
          document.querySelector(".how-it-works").style.maxHeight = "0";
          break;
        case 5:
          document.querySelector("#stake-item").classList.toggle("active-item");
          document.querySelector(".overview").style.maxHeight = "0";
          document.querySelector(".bets").style.maxHeight = "100%";
          document.querySelector(".how-it-works").style.maxHeight = "0";
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
              <img alt="" src={stakeIcon} />
              <a>Bets</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(3)}>
            <a
              className="item-container"
              href="https://2907.gitbook.io/memecoinsrace/"
              target="_blank"
            >
              <img alt="" src={bookIcon} />
              <a>Docs</a>
            </a>
          </div>
          <div className="nav-item" onClick={() => ul(4)}>
            <div id="donats-item" className="item-container">
              <img alt="" src={rocketIcon} />
              <a>Donats</a>
            </div>
          </div>
          <div className="nav-item" onClick={() => ul(5)}>
            <div id="stake-item" className="item-container">
              <img alt="" src={peegIcon} />
              <a>Stake</a>
            </div>
          </div>
        </nav>
        <div className="social-group">
          <div className="social-icons">
            <a href="https://twitter.com/memecoinsrace" target="_blank">
              <img src={twitter}></img>
            </a>
            <a href="https://t.me/memecoinsrace" target="_blank">
              <img src={telegram} />
            </a>
            <a href="https://discord.gg/7ZGjcK8P" target="_blank">
              <img src={discord} />
            </a>
            <a href="https://medium.com/@memecoinsrace" target="_blank">
              <img src={medium} />
            </a>
          </div>
          <div className="social-footer">
            <label>Copyright © 2022</label>
            <label>|</label>
            <label>All rights reserved</label>
          </div>
        </div>
      </div>
    );
  }
}
