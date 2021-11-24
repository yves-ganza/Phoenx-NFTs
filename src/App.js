import './styles/App.css'
import twitterLogo from './assets/twitter-logo.svg'
import React, {useEffect, useState} from "react"
import {ethers} from "ethers"
import myEpicNft from './utils/myEpicNft.json'
import Status from "./components/status";
import OpenSeaLink from "./components/openSeaLink";

// Constants
const TWITTER_HANDLE = 'lebon_yg'
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const CONTRACT_ADDRESS = '0x78C3f9f89CE831c54D25D3d68991706Bc549dC62'
const OPENSEA_LINK = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/`

const App = () => {
  const [currentAccount, setCurrentAccount] = useState()
  const [status, setStatus] = useState({
    error: null,
    text: ''
  })
  const [mintCount, setMintCount] = useState(null)
  const [link, setLink] = useState('')
  //Check if wallet is connected
  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window
    if(!ethereum){
      console.log('Please make sure you have an active Metamask extension in your browser')
      setStatus({error: true, text: 'Please make sure you have an active Metamask extension in your browser'})
      return
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain ' + chainId)

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = '0x4'
    if (chainId !== rinkebyChainId) {
      alert('You are not connected to the Rinkeby Test Network!')
    }

    const accounts = await ethereum.request({method: 'eth_accounts'})

    if(accounts.length !== 0){
      const account = accounts[0]
      console.log('Found an authorized account: ', account)
      setCurrentAccount(account)
    }
    else {
      console.log('No authorized account found!')
      setStatus({error: true, text: 'No authorized account found!'})
    }
  }


  const connectWallet = async () => {
    try{
      const {ethereum} = window
      if(!ethereum){
        setStatus({error: true, text: 'Please install a compatible wallet!'})
        return
      }

      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      setCurrentAccount(accounts[0])
      setStatus({error: false, text: 'Connected'})
      console.log('Connected account: ', accounts[0])
    }catch (e) {
      console.log(e)
      setStatus({error: true, text: 'Access to wallet failed!'})
    }

  }

  //Listen to contract event
  const setupEventListener = async (connectedContract) => {

    try {
        connectedContract.on('NewEpicNFTMinted',(from, tokenId, mintCount) => {
          console.log('From: ', from, ' - Id: ', tokenId.toNumber())
          setMintCount(mintCount.toNumber())
          setLink(`${OPENSEA_LINK + tokenId.toNumber()}`)
        })
    } catch (error) {
      console.log(error)
      setStatus({error: true, text: 'Oops! We are sorry for the error!'})
    }
  }

  //Mint NFT
  const askContractToMintNft = async () => {

    console.log(CONTRACT_ADDRESS)

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        setupEventListener(connectedContract)

        console.log("Going to pop wallet now to pay gas...")
        setStatus({error: false, text: 'Authorizing wallet for gas payment'})
        let nftTxn = await connectedContract.makeAnEpicNFT()

        setStatus(prevState => ({...prevState, text: 'Minting please wait...'}))
        console.log("Minting...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
        setStatus(prevState => ({error: false, text: 'Minted successfully :)'}))

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
      setStatus({error: true, text: 'Mint operation failed!'})
    }
  }

  useEffect(() => {
    let isMounted = true
    // checkIfWalletIsConnected()
    isMounted && connectWallet()
    return () => {isMounted = false}
  }, [])

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintButton  = () => (
      <button onClick={() => askContractToMintNft()} className="cta-button mint-button">Mint NFT</button>
  )

  const renderMintCount = () => (
      <p className='mint-count'>{mintCount} Minted so far!</p>
  )

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {
            mintCount ? renderMintCount(): ''
          }
          {
            currentAccount === "" ?
            renderNotConnectedContainer() :
            renderMintButton()
          }
          {
            (status.error || status.text) ?
            <div className='status-modal'>
              <Status error={status.error} text={status.text}/>
            </div> : ''
          }
          {
            link ?
                <OpenSeaLink
                  show={link ? true : false}
                  link={link}
                  onHide={() => setLink('')}
                /> : ''
          }
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
