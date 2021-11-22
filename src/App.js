import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, {useEffect, useState} from "react";

// Constants
const TWITTER_HANDLE = 'lebon_yg';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState()
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  //Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window
    if(!ethereum){
      console.log('Please make sure you have an active Metamask extension in your browser')
      return
    }
    console.log('Wallet connected', ethereum)

    const accounts = await ethereum.request({method: 'eth_accounts'})

    if(accounts.length !== 0){
      const account = accounts[0]
      console.log('Found an authorized account: ', account)
      setCurrentAccount(account)
    }
    else {
      console.log('No authorized account found!')
    }
  }


  const connectWallet = async () => {
    try{
      const {ethereum} = window

      if(!ethereum){
        alert('Please install Metamask')
        return
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})

      console.log('Connected account: ', accounts[0])
    }catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    checkIfWalletIsConnected()
  })

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`brought to you by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
