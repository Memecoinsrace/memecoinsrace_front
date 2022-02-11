import react from "react";
import ConnectWallet from "../ConnectWallet/ConnectWallet";
import "./HowItWorks.scss";

export default function HowItWorks(props) {
  return (
    <div className="how-it-works">
      <div className="how-it-works-header">
        <p>HOW IT WORKS</p>
        <ConnectWallet
          DisconnectPhantom={props.DisconnectPhantom}
          backColor={props.backColor}
          inner={props.inner}
          closeBtn={props.closeBtn}
        />
      </div>
      <div className="how-it-works-body">
        <p>
          MemeCoinsRace is the price-tracking website for cryptoassets referred
          to as «Meme Coins» in the rapidly growing cryptocurrency space. Its
          mission is to make Meme Coins discoverable and efficient by empowering
          retail users with unbiased, high quality and accurate information for
          drawing their own informed conclusions.
          <br /> MemeCoinsRace strictly follows and enforces its independent
          listing criteria guidelines, circulating supply calculation methods
          and liquidity score for how it ranks cryptoassets.
          <br /> MemeCoinsRace official ranking criteria is designed to
          eliminate any possibility of preferential treatment in general. To
          understand how crypto projects are listed on MemeCoinsRace, please
          refer to our listing policy and frequently-asked-questions.
          <br />
          MemeCoinsRace will continue to present the most accurate data on Meme
          Coins to the wider public independently. We are confident that our
          common vision to further the crypto revolution and promote
          transparency in the crypto space will be strengthened by our own
          Community.
        </p>
      </div>
    </div>
  );
}
