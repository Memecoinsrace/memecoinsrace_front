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

import * as anchor from "@project-serum/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  //SystemProgram,
} from "@solana/web3.js";
//import { Connection, PublicKey, clusterApiUrl, Transaction } from "@solana/web3.js";
//import { Program, Provider, web3 } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import idl from "../../idl.json";
//import kp from "../../BetUser.json";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { SnackbarProvider, useSnackbar } from "notistack";

require("@solana/wallet-adapter-react-ui/styles.css");

///Added for ATA generating
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
const splATAProgramId = new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID);

///Mint account
const MINT_ACCOUNT = "EwJr2ibR39HTBPJqKEP9etqcMmJ9hb7djLxe28vwM6oF";
const mintAccount = new PublicKey(MINT_ACCOUNT);
const tokenProgramId = new PublicKey(TOKEN_PROGRAM_ID);

//console.log("idl", idl);
//console.log("kp", kp);

//const arr = Object.values(kp);
//const secret = new Uint8Array(arr);
//const tempUserAccount = anchor.web3.Keypair.fromSecretKey(secret);
//const tempUserAccount = anchor.web3.Keypair.generate();

//console.log("pk", tempUserAccount.publicKey.toString());
const wallets = [new PhantomWalletAdapter()];

const { SystemProgram, Keypair } = anchor.web3;

//initialize a value in UI
let bet_amount = null;

//initialize in UI 0,1,2,
let bet_on_result = null;

let existingATA = null;

////Some hardcoded values
//Hardcoded
const TREASURY_ACCOUNT_PDA = "2Q5FCcUhvBVgJv6dCwNRdgAvEtxZVPUwxmxTKY9GHfZc";
const treasuryPubkey = new PublicKey(TREASURY_ACCOUNT_PDA);

const TREASURY_AUTHORITY_PDA = "8NdpuYnWHxYYCifxxe9cXidrTb6VPfJmm9txLYirqQBY";

//Token account with the minted tokens for bet (firstly hardcoded)
//const USER_DEPOSIT_TOKEN_ACCOUNT =
//  "FaVQBqKVUaSBsNWuGAz2goL3x59mrVtoSaFhjDwAeTFK";
//const depositPubkey = new PublicKey(USER_DEPOSIT_TOKEN_ACCOUNT);
//Coin name. Take it from UI list
var CHAINLINK_FEED = "EdWr4ww1Dq82vPe8GFjjcVPo2Qno3Nhn6baCgM3dCy28";
//Hardcoded PublicKey for chainlink programm
const CHAINLINK_PROGRAM_ID = "CaH12fwNTKJAG8PxEvo9R96Zc2j8qNHZaFj8ZW49yZNT";
const DIVISOR = 100000000;

const opts = {
  preflightCommitment: "processed",
};
const programID = new PublicKey("ApkhVUsEgqYgHuCo3paK4dF9hnvPrYEjxHnk9dkcezAb");

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
  //const transaction = new Transaction();
  //const { signature } = await window.solana.signAndSendTransaction(transaction);
  //await connection.confirmTransaction(signature);

  const wallet = useAnchorWallet();
  //console.log("FIRST we make wallet var:", wallet);
  const { enqueueSnackbar } = useSnackbar();

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
    /* network set to local network for now */
    const network = clusterApiUrl("devnet");
    const connection = new Connection(network, opts.preflightCommitment);
    console.log("find1");
    console.log("Wallet for getting the provider: => ", wallet);
    const provider = new anchor.Provider(
      connection,
      wallet,
      opts.preflightCommitment
    );
    console.log("find2", provider);
    return provider;
  }

  async function FindOrCreateATA(solanaPubkey) {
    console.log("Solana Pubkey for finding ATA is", solanaPubkey.toString());

    const associatedAddress = await Token.getAssociatedTokenAddress(
      splATAProgramId,
      tokenProgramId,
      mintAccount,
      solanaPubkey
    );
    console.log("ATA publicKey: ", associatedAddress.toString());

    const doesAccountExist = await connection.getAccountInfo(associatedAddress);
    console.log("doesAccountExist publicKey: ", doesAccountExist);

    ///checking ATA

    if (!doesAccountExist) {
      console.log("we did not found  ATA, creating...");
      //TODO: Show  0 balance somewhere
      const transaction = new Transaction().add(
        Token.createAssociatedTokenAccountInstruction(
          splATAProgramId,
          tokenProgramId,
          mintAccount,
          associatedAddress,
          solanaPubkey, //owner
          solanaPubkey //payer
        )
      );

      transaction.feePayer = solanaPubkey;

      console.log("Getting recent blockhash");
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;

      //console.log("Second we look for a wallet :", wallet)

      let signed = await window.solana.signTransaction(transaction);

      let signature = await connection.sendRawTransaction(signed.serialize());

      let confirmed = await connection.confirmTransaction(signature);
    } else {
      console.log("ATA already exists..");
    }
    const aTAAccount = await connection.getAccountInfo(associatedAddress);
    console.log("ATA : ", aTAAccount);
    const userATAAccount = new PublicKey(associatedAddress);

    const aTAbalance = await connection.getTokenAccountBalance(userATAAccount);
    console.log("USER ATA balance : ", aTAbalance.value.uiAmountString);
    //TODO: Show balance somewhere

    return associatedAddress.toString();
  }

  async function makeTheBet(betType, betValue, coin, userAtAccount) {
    //create an account to store the price and bett data
    const escrowAccount = anchor.web3.Keypair.generate();

    const provider = await getProviderForAnchor();
    /* create the program interface combining the idl, program ID, and provider */
    const program = new anchor.Program(idl, programID, provider);
    //try {
    /* interact with the program via rpc */ /*

    const associatedAddress = await Token.getAssociatedTokenAddress(
      splATAProgramId,
      tokenProgramId,
      mintAccount,
      provider.wallet.publicKey
    );
    console.log("ATA publicKey: ", associatedAddress.toString());
    const doesAccountExist = await provider.connection.getAccountInfo(
      associatedAddress
    );
    console.log("doesAccountExist publicKey: ", doesAccountExist);

    if (!doesAccountExist) {
      console.log("we did not found  ATA, creating...");
      const transaction = new anchor.web3.Transaction().add(
        Token.createAssociatedTokenAccountInstruction(
          splATAProgramId,
          tokenProgramId,
          mintAccount,
          associatedAddress,
          provider.wallet.publicKey, //owner
          provider.wallet.publicKey //payer
        )
      );
      transaction.feePayer = provider.wallet.publicKey;
      console.log("Getting recent blockhash");
      transaction.recentBlockhash = (
        await provider.connection.getRecentBlockhash()
      ).blockhash;
      let signed = await wallet.signTransaction(transaction);
      let signature = await provider.connection.sendRawTransaction(
        signed.serialize()
      );
      let confirmed = await provider.connection.confirmTransaction(signature);
    }
    const aTAAccount = await provider.connection.getAccountInfo(
      associatedAddress
    );
    console.log("ATA : ", aTAAccount);
    const userATAAccount = new PublicKey(associatedAddress);
    */

    if (coin !== "") CHAINLINK_FEED = coin;
    console.log("BET TYPE => " + betType);
    console.log("BET VALUE => " + betValue);
    console.log("BET USER_TOKEN_ACCOUNT => " + userAtAccount);

    //const tx = program.transaction.execute(
    let tx1 = await program.rpc.execute(
      new anchor.BN(betValue), //bet amount
      new anchor.BN(betType), //bet_on_name 0/1/2 rise/equal/decrease
      {
        accounts: {
          //coinInfo: "FJpv98TrcWURFaGXVRnzwQ7gfdF2ZWzKYeRo6Y3Jim9Z",
          escrowAccount: escrowAccount.publicKey, //generated escrow
          user: provider.wallet.publicKey, //better main account
          treasuryAccount: TREASURY_ACCOUNT_PDA, //escrow treasury
          userDepositTokenAccount: userAtAccount, //user account with tokens
          chainlinkFeed: CHAINLINK_FEED, //CoinName
          chainlinkProgram: CHAINLINK_PROGRAM_ID, //Chainlink program
          systemProgram: anchor.web3.SystemProgram.programId, //System program
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        instructions: [
          await program.account.escrowAccount.createInstruction(escrowAccount),
        ],
        options: { commitment: "confirmed" },
        signers: [escrowAccount],
      }
    );
    //Signing created transaction with cmd wallet
    /*tx.feePayer = await tempUserAccount.publicKey;
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    tx.sign(escrowAccount);
    const signedTx = await tempUserAccount.signTransaction(tx);
    const txId = await provider.connection.sendRawTransaction(signedTx.serialize());
    await provider.connection.confirmTransaction(txId)*/

    console.log("Fetching transaction logs...");
    let t = await provider.connection.getConfirmedTransaction(tx1, "confirmed");
    console.log(t.meta.logMessages);

    // Fetch the account details of the account containing the price and bet data
    const _escrowAccount = await program.account.escrowAccount.fetch(
      escrowAccount.publicKey
    );
    console.log("Price for choosen coin is: " + _escrowAccount.value / DIVISOR);
    console.log("Bet amount Is: " + _escrowAccount.betAmount);
    console.log("Bet on result Is: " + _escrowAccount.betOnResult);
    console.log("Pair name: " + _escrowAccount.pairName);
    console.log("Better account : " + _escrowAccount.betterAccount);

    let userDepositTokenBalance =
      await provider.connection.getTokenAccountBalance(
        new PublicKey(userAtAccount)
      );
    console.log(
      "User ATA balance : ",
      userDepositTokenBalance.value.uiAmountString
    );

    let treasuryBalance = await provider.connection.getTokenAccountBalance(
      treasuryPubkey
    );
    console.log(
      "TREASURY_ACCOUNT_PDA balance : ",
      treasuryBalance.value.uiAmountString
    );

    // hide bet modal
    document.querySelector(".bet-modal").classList.remove("show-modal");

    // Take a time for a bet check
    let pause = 15;
    console.log("waiting for " + pause + " sec...");

    // Pause (now is 15 seconds)
    await new Promise((resolve) => setTimeout(resolve, pause * 1000));

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

    /* interact with the program via rpc */
    let tx2 = await program.rpc.checkBet({
      accounts: {
        escrowAccount: escrowAccount.publicKey, //generated escrow with props
        chainlinkFeed: CHAINLINK_FEED, //CoinName
        chainlinkProgram: CHAINLINK_PROGRAM_ID, //Chainlink program
        treasuryAccount: TREASURY_ACCOUNT_PDA, //escrow treasury
        treasuryAuthority: TREASURY_AUTHORITY_PDA, //escrow treasury authority
        userDepositTokenAccount: userAtAccount, //betToken user account
        tokenProgram: TOKEN_PROGRAM_ID,
      },
      options: { commitment: "confirmed" },
      signers: [escrowAccount],
    });

    //console.log("Fetching transaction logs...");
    //let t2 = await provider.connection.getConfirmedTransaction(tx2, "confirmed");
    //console.log(t2.meta.logMessages);

    // Fetch the account details of the account containing the price and bet data
    const _escrowAccountCheck = await program.account.escrowAccount.fetch(
      escrowAccount.publicKey
    );
    console.log("Price Is: " + _escrowAccountCheck.value / DIVISOR);
    console.log(
      "Bet amount after closing escrow: " + _escrowAccountCheck.betAmount
    );
    console.log("Bet on result is: " + _escrowAccountCheck.betOnResult);
    console.log("Coin pair name: " + _escrowAccountCheck.pairName);
    console.log("Better account : " + _escrowAccountCheck.betterAccount);

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

    userDepositTokenBalance = await provider.connection.getTokenAccountBalance(
      new PublicKey(userAtAccount)
    );
    console.log(
      "USER_DEPOSIT_TOKEN_ACCOUNT balance : ",
      userDepositTokenBalance.value.uiAmountString
    );

    treasuryBalance = await provider.connection.getTokenAccountBalance(
      treasuryPubkey
    );
    console.log(
      "TREASURY_ACCOUNT_PDA balance : ",
      treasuryBalance.value.uiAmountString
    );

    console.log("Bet is closed");

    //  } catch (err) {
    //    console.log("Transaction error: ", err);
    //  }
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

  /*
   const ConnectPhantom = async () => {
       
       console.log("Solana provider");
    try {
      if ("solana" in window) {
          
        providerW3 = window.solana;
        console.log("Solana provider", providerW3);
        
        if (providerW3.isPhantom) {
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
*/

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

    window.solana.on("connect", () => getInitialPrice());

    //TODO: disconnect provider
  }, []);

  const getInitialPrice = async () => {
    console.log("window.solana.publicKey", window.solana.publicKey.toString());

    existingATA = await FindOrCreateATA(window.solana.publicKey);

    console.log("existingATA:", existingATA);

    axios
      .post("https://api.memecoinsrace.com/user/wallet", {
        wallet_id: existingATA,
      })
      .then(function (result) {
        console.log("SUCCESS => ", result);
      })
      .catch(function (error) {
        console.log("ERROR => ", error);
      });
  };

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
          makeTheBet(betType, betValue, coin, existingATA)
        }
        betValue={betValue}
      />
    </div>
  );
}
