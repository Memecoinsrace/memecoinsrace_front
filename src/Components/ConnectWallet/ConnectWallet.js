import "./ConnectWallet.scss";
import wallet from "../../SVG/wallet.svg";
import closeWhite from "../../SVG/closeWhite.svg";
import React from "react";

export default function ConnectWallet(props) {
  const Exit = () => {
    props.DisconnectPhantom();
  };

  function openSelectBlockchain() {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  }

  return (
    <div className="connect-wallet" style={{ background: props.backColor }}>
      <img alt="" src={wallet} onClick={openSelectBlockchain} />
      <label className="cw-label" onClick={openSelectBlockchain}>
        {props.inner}
      </label>
      <img
        src={closeWhite}
        alt=""
        style={{ display: props.closeBtn }}
        onClick={Exit}
      />
    </div>
  );
}
