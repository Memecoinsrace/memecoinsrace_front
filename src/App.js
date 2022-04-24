import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Main from "./Components/Main/Main";
import HowItWorks from "./Components/HowItWorks/HowItWorks";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl } from "@solana/web3.js";

import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

const wallets = [new PhantomWalletAdapter()];

const network = clusterApiUrl("devnet");

function App() {
  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <Sidebar />
            <Main />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
