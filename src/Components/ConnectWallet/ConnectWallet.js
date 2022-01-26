import "./ConnectWallet.scss";
import wallet from "../../SVG/wallet.svg";
import closeWhite from "../../SVG/closeWhite.svg";
import React from "react";

export default class ConnectWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backcolor: "#e70dff",
      inner: "CONNECT WALLET",
      closeBtn: "none",
    };

    this.openSelectBlockchain = this.openSelectBlockchain.bind(this);
    this.Exit = this.Exit.bind(this);
  }

  Exit() {
    localStorage.removeItem("phantomPublicKey");
    this.setState({
      backcolor: "#e70dff",
      inner: "CONNECT WALLET",
      closeBtn: "none",
    });
  }

  componentDidMount() {
    let key = localStorage.getItem("phantomPublicKey");

    if (key !== null) {
      this.setState({
        backcolor: "#4BC716",
        inner: key,
        closeBtn: "block",
      });
    }
  }

  openSelectBlockchain() {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  }

  render() {
    return (
      <div
        className="connect-wallet"
        style={{ background: this.state.backcolor }}
        onClick={this.openSelectBlockchain}
      >
        <img src={wallet} />
        <label className="cw-label">{this.state.inner}</label>
        <img
          src={closeWhite}
          style={{ display: this.state.closeBtn }}
          onClick={this.Exit}
        />
      </div>
    );
  }
}
