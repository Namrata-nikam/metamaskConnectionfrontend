import { ethers } from 'ethers'
import { useState } from 'react'
import './App.css'
import connectionabi from './conAbi.json'

function App() {
  let contractAddress = '0x50fEfA5855C5dDBf0bDf58DeB4c87fbd65B18815'

  const [errorMessage, setErrorMessage] = useState(null)
  const [address, setAddress] = useState(null)

  const [currentContractVal, setCurrentContractVal] = useState(null)

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)

  async function connectionMetamask() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => {
          // Return the address of the wallet
          console.log(res[0],'res[0] shown')
          setAddress(res[0])
          console.log(address,'set address')
          accountChangedHandler(res[0]);
        })
        .catch((err) => {
          setErrorMessage(err)
        })
    } else {
      setErrorMessage('install metamask extension!!')
    }
  }

  // update account, will cause component re-render
  const accountChangedHandler = (newAccount) => {
    setAddress(newAccount)
    updateEthers()
  }

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload()
  }

  // listen for account changes
  window.ethereum.on('accountsChanged', accountChangedHandler)

  window.ethereum.on('chainChanged', chainChangedHandler)

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(tempProvider)
    console.log(provider,"provider is set")

    let tempSigner = provider.getSigner()
    setSigner(tempSigner)
    console.log(signer,"singer is set")

    let tempContract = new ethers.Contract(
      contractAddress,
      connectionabi.abi,
      signer,
    )
    tempContract.someMethodThatRequiresSigning();
    setContract(tempContract)
  }

  const setHandler = (event) => {
    event.preventDefault()
    console.log('sending ' + event.target.setAddress.value + ' to the contract')
    console.log('sending ' + event.target.setTokenId.value + ' to the contract')
    // contract.set(event.target.setText.value);
    console.log(contract)
    contract.safeMint(
      event.target.setAddress.value,
      event.target.setTokenId.value,
    )
  }

  const getCurrentVal = async (event) => {
    event.preventDefault()
    console.log('sending ' + event.target.setTokenId.value + ' to the contract')
    let val = await contract.tokenURI(event.target.setTokenId.value)
    setCurrentContractVal(val)
  }

  return (
    <div style={{ flex: 1 }}>
      <div style={{ flex: 1 }}>
        <button
          onClick={() => {
            connectionMetamask()
          }}
          style={{ backgroundColor: 'orange', color: 'black', flex: 1 }}
        >
          connect to metamask
        </button>
      </div>
      <div>
        <h1>{address}</h1>
      </div>
      <div>
        <form onSubmit={setHandler}>
          <input id="setAddress" type="text" />
          <input id="setTokenId" type="text" />
          <button type={'submit'}> Safemint </button>
        </form>
        <div>
          {/* <button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button> */}
          <form onSubmit={getCurrentVal}>
            <input id="setTokenId" type="text" />
            <button type={'submit'}> token URI </button>
          </form>
        </div>
        <h5>
        {currentContractVal}
        </h5>
      </div>
      <div>
        {errorMessage}
      </div>
    </div>
  )
}

export default App
