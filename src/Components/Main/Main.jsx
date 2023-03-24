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
import bone from "../../SVG/bone.svg";
import fish from "../../SVG/fish.svg";
import banan from "../../SVG/banana.svg";
import axios from "axios";
import HowItWorks from "../HowItWorks/HowItWorks";
import Bets from "../Bets/Bets";
import Bet from "../Modals/Bet/Bet";

import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

import { TOKEN_PROGRAM_ID /*Token*/ } from "@solana/spl-token";
import idl from "../../mcr_switchboard.json";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SnackbarProvider, useSnackbar } from "notistack";

require("@solana/wallet-adapter-react-ui/styles.css");

const PLATFORM_PDA = "FXQvrsi1FaeVWmPJq5n7wq2aq2cEDZwFP1n9o9woDqam";
const platformPDA = new PublicKey(PLATFORM_PDA);

const VAULT_SOL_ACCOUNT_PDA = "EeUMeU1wDPHDwdYiHgp5NrRxj32HV5BuBrnX5GAogrAj";
const vaultSolAccount = new PublicKey(VAULT_SOL_ACCOUNT_PDA);

const wallets = [new PhantomWalletAdapter()];

const { SystemProgram, Keypair } = anchor.web3;

//initialize a value in UI
let bet_amount = null;

//initialize in UI 0,1,2,
let bet_on_result = null;

const feed_btc = "8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee";

let feed = feed_btc;

const opts = {
  preflightCommitment: "processed",
};

// Smart contract address
const programID = new PublicKey("13gCmWk6FxkUxvvS8ybABQd5HvYraqJfavfjd4qs59Vp");

export default function Main() {
  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

  const network = clusterApiUrl("devnet");
  const connection = new Connection(network);

  const wallet = useAnchorWallet();

  const { enqueueSnackbar } = useSnackbar();

  const [selectedCategory, setCategory] = useState(0);

  const [userIsWin, setUserIsWin] = useState(false);

  const [betValue, setBetValue] = useState(0);

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
  const [testCoins, setTestCoins] = useState({
    items: [],
    maxPrice: null,
  });

  const [pubKey, setPubKey] = useState(null);

  const [connectWallet, setConnectWallet] = useState({
    backColor: "rgb(231, 13, 255)",
    inner: "CONNECT WALLET",
    closeBtn: "none",
  });

  const [slideWrapper, setSlideWrapper] = useState(0);

  const [categoriesValue, setCategoriesValue] = useState("0");

  async function getProviderForAnchor() {
    /* create the provider and return it to the caller */
    const network = clusterApiUrl("devnet");
    const connection = new Connection(network, opts.preflightCommitment);

    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment
    );
    console.log("find2", provider);
    return provider;
  }

  async function makeTheBet(betType, betValue, coin) {
    //create an account to store the price and bett data
    const escrowAccountSol = anchor.web3.Keypair.generate();

    const provider = await getProviderForAnchor();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new anchor.Program(idl, programID, provider);
    try {
      if (coin !== "") feed = coin;
      console.log("BET TYPE => " + betType);
      console.log("BET VALUE => " + betValue);

      const walletSigner = provider.wallet;
      console.log("Wallet: ", walletSigner.publicKey.toString());
      console.log("platformPDA: ", platformPDA.toString());
      console.log("escrowAccountSol: ", escrowAccountSol.publicKey.toString());
      console.log("vaultSolAccount: ", vaultSolAccount.toString());
      console.log("feed: ", feed);

      let tx_bet = await program.methods
        .makeBetSol(new anchor.BN(betValue), new anchor.BN(betType))
        .accounts({
          platform: platformPDA,
          escrowAccountSol: escrowAccountSol.publicKey,
          user: walletSigner.publicKey,
          vaultSolAccount: vaultSolAccount,
          aggregatorFeed: feed,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([escrowAccountSol])
        .rpc();

      // Take a time for a tx
      let pause = 5;
      console.log("waiting for " + pause + " sec...");
      await new Promise((resolve) => setTimeout(resolve, pause * 1000));

      console.log("Fetching transaction logs...");
      let t = await provider.connection.getConfirmedTransaction(
        tx_bet,
        "confirmed"
      );
      console.log(t.meta.logMessages);

      // Fetch the account details of the account containing the price and bet data
      const _escrowAccountSol = await program.account.escrowAccountSol.fetch(
        escrowAccountSol.publicKey
      );
      console.log("Price for choosen coin is: " + _escrowAccountSol.value);
      console.log("Bet amount Is: " + _escrowAccountSol.solBetAmount);
      console.log("Bet on result Is: " + _escrowAccountSol.betOnResult);
      console.log("Pair name: " + _escrowAccountSol.pairName);
      console.log("Better account : " + _escrowAccountSol.betterAccount);
      console.log("Bet time : " + _escrowAccountSol.betTime);
      console.log("Bet time to lock : " + _escrowAccountSol.timeLock);

      // hide bet modal
      document.querySelector(".bet-modal").classList.remove("show-modal");

      // Take a time for a bet check according to the platform settings
      pause = 15;
      console.log("waiting for " + pause + " sec...");
      // Pause (now is 15 seconds)
      await new Promise((resolve) => setTimeout(resolve, pause * 1000));

      //
      const calculateTimeLeft = () => {
        let year = new Date().getFullYear();

        let difference = +new Date(`10/01/${year}`) - +new Date();

        let timeLeft = {};

        if (difference > 0) {
          timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          };
        }

        return timeLeft;
      };

      //Check the bet
      let tx_check = await program.methods
        .checkBetSol()
        .accounts({
          //platform: platformPDA,
          escrowAccountSol: escrowAccountSol.publicKey,
          aggregatorFeed: feed,
          better_account: walletSigner.publicKey,
          vaultSolAccount: vaultSolAccount,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();

      // Wait to fetch transaction logs
      pause = 5;
      console.log("waiting for " + pause + " sec...");
      await new Promise((resolve) => setTimeout(resolve, pause * 1000));

      console.log("Fetching transaction logs...");
      t = await provider.connection.getConfirmedTransaction(
        tx_check,
        "confirmed"
      );
      console.log(t.meta.logMessages);

      // Fetch the account details of the account containing the price and bet data
      const _escrowAccountCheck = await program.account.escrowAccountSol.fetch(
        escrowAccountSol.publicKey
      );
      console.log("Price Is: " + _escrowAccountCheck.value);
      console.log(
        "Bet amount after closing escrow: " + _escrowAccountCheck.solBetAmount
      );
      console.log("Bet on result is: " + _escrowAccountCheck.betOnResult);
      console.log("Coin pair name: " + _escrowAccountCheck.pairName);
      console.log("Better account : " + _escrowAccountCheck.betterAccount);
      console.log("active : " + _escrowAccountCheck.active);

      //Use it in UI
      if (_escrowAccountCheck.userWins) {
        console.log("User WINS a bet");
        //setUserIsWin(true);
        enqueueSnackbar("Congrats! Your meme bet won!", { variant: "success" });
      } else {
        console.log("User LOOSE a bet");
        enqueueSnackbar(
          "You lost! Unfontunately, your prediction didn`t come true.",
          { variant: "info" }
        );
        //setUserIsWin(false);
      }

      console.log("Bet is closed");
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  const selectCategory = async (num) => {
    document.getElementById("dogsCategory").classList.remove("active-category");

    document.getElementById("apesCategory").classList.remove("active-category");

    document.getElementById("catsCategory").classList.remove("active-category");

    document.getElementById("testCategory").classList.remove("active-category");

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
      case 3:
        document
          .getElementById("testCategory")
          .classList.add("active-category");
        await setSlideWrapper(-300);
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

    let testLineWidth = (currentPrice / testCoins.maxPrice) * 100 + 10;

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
      case "BTC":
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
      case "ETH":
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
      case "LINK":
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
    axios({
      method: "get",
      url: "https://api.memecoinsrace.com/rates",
    })
      .then(function (response) {
        const fullData = response.data.rates;

        console.log("full data => ", fullData);

        let dogsPrices = [];
        let catsPrices = [];
        let apesPrices = [];
        let testPrices = [];

        let dc = [];
        let cc = [];
        let ac = [];
        let tc = [];

        for (let i = 0; i < fullData.length; i++) {
          const element = fullData[i];

          element.seconds = 300;

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

            dc.push(fullData[i]);
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

            ac.push(fullData[i]);
            const price = fullData[i].rate;
            apesPrices.push(price);
          }

          if (
            element.symbol === "BTC" ||
            element.symbol === "LINK" ||
            element.symbol === "ETH" ||
            element.symbol === "ETH"
          ) {
            tc.push(fullData[i]);
            const price = fullData[i].rate;
            testPrices.push(price);
          }
        }

        let dogsMaxPrice = Math.max(...dogsPrices);
        let catsMaxPrice = Math.max(...catsPrices);
        let apesMaxPrice = Math.max(...apesPrices);
        let testMaxPrice = Math.max(...testPrices);

        setDogsCoins((prev) => {
          return {
            ...prev,
            items: dc,
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
        setTestCoins((prev) => {
          return {
            ...prev,
            items: tc,
            maxPrice: testMaxPrice,
          };
        });
      })
      .catch(function (error) {
        console.log("Error => " + error);
      });
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

    if ("solana" in window) {
      window.solana.connect(); // opens wallet to connect to
      //window.solana.on("connect", () => getInitialPrice());
    }

    //TODO: disconnect provider
  }, []);
  /*
  const getInitialPrice = async () => {
    console.log("window.solana.publicKey", window.solana.publicKey.toString());

    existingATA = await FindOrCreateATA(window.solana.publicKey);

    console.log("existingATA:", existingATA);

    axios
      .post("https://api.memecoinsrace.com/user/wallet", {
        wallet_id: existingATA,
      })
      .then(function (result) {
        // console.log("SUCCESS => ", result);
        if (result.status === 201) {
          enqueueSnackbar(
            "Congrats! We just sent you your first 300 $MCR. Go ahead and place your bet!",
            { variant: "success" }
          );
        }
      })
      .catch(function (error) {
        console.log("ERROR => ", error);
      });
  };*/

  const closeSelectApplication = () => {
    let elem = document.querySelector(".select-application-modal");
    elem.classList.toggle("show-modal");
  };

  const closeSelectBlockchain = () => {
    let elem = document.querySelector(".connect-wallet-modal");
    elem.classList.toggle("show-modal");
  };

  const showBetModal = () => {
    if ("solana" in window) {
      let provider = window.solana;
      if (provider.isPhantom) {
        if (window.solana.isConnected) {
          document.querySelector(".bet-modal").classList.add("show-modal");
        } else {
          alert("To place a bet, you need to connect the Phantom wallet");
        }
      }
    } else {
      alert("Solana provider is not found");
    }
  };

  const handleCategoryChange = (event) => {
    console.log(event.target.value);
    setCategory(event.target.value);

    switch (event.target.value) {
      case "0":
        setSlideWrapper(0);
        break;
      case "1":
        setSlideWrapper(-100);
        break;
      case "2":
        setSlideWrapper(-200);
        break;
      case "3":
        setSlideWrapper(-300);
        break;
      default:
        break;
    }
  };

  return (
    <div className="main">
      <div className="overview">
        <div className="head">
          <div className="categories">
            <select
              className="select-category"
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event)}
            >
              <option selected value={0}>
                🦴 DOGS COINS
              </option>
              <option value={1}>🐟 CATS COINS</option>
              <option value={2}>🍌 APES COINS</option>
              <option value={3}>🧪 TEST COINS</option>
            </select>
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
            <div id="testCategory" onClick={() => selectCategory(3)}>
              <label>TEST</label>
              <label>COINS</label>
            </div>
          </div>
          <div className="header-group">
            <div className="current-bets-btn" onClick={() => getData()}>
              CURRENT BETS
            </div>
            <WalletMultiButton />
          </div>
        </div>
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
          <div class="slide">
            {testCoins.items
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
                          <div
                            className="bet-btn"
                            onClick={() => showBetModal()}
                          >
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
        {/* <div className="connect-wallet-modal">
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
        </div> */}

        {/* <div className="select-application-modal">
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
        </div> */}
      </div>

      <HowItWorks
        DisconnectPhantom={DisconnectPhantom}
        backColor={connectWallet.backColor}
        inner={connectWallet.inner}
        closeBtn={connectWallet.closeBtn}
      />
      <Bets />

      <Bet
        isWin={userIsWin}
        makeBet={(betType, betValue, coin) =>
          makeTheBet(betType, betValue, coin)
        }
        betValue={betValue}
      />
    </div>
  );
}
