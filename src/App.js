import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import logo from './logo.png';
import Peluca from './artifacts/contracts/Peluca.sol/Peluca.json';
import PelucaDropper from './artifacts/contracts/PelucaDropper.sol/PelucaDropper.json';

const pelucaAddress = '0x353395eB36E03Fe72Dce4EE77558688969283F91';
const pelucaDropperAddress = '0x8C449A97Cb028840158F9D6C0FEa10Ac8E6E9cb3';

// npx hardhat compile
// npx hardhat node // en otra consola
// npx hardhat run scripts/deploy.js --network localhost

// Host in Github https://dev.to/yuribenjamin/how-to-deploy-react-app-in-github-pages-2a1f

// npm install @openzeppelin/contracts

// verify in BscScan
// https://docs.binance.org/smart-chain/developer/deploy/verify.html

// deploy in BSC
// https://docs.binance.org/smart-chain/developer/deploy/hardhat.html

// flatten code
// npx hardhat flatten

// Deploy to Github Pages
// npm run deploy

// https://github.com/joigno/peluca/settings/pages




function App() {
  const [ data, setData] = useState({});
  var addressAmigo = '0x0';

  useEffect(() => {
    document.title = "$PELUCA"
    fetchData();
  }, [])

  async function requestAccount() {
    if (typeof window.ethereum === 'undefined') {
      alert("Install MetaMask wallet plugin: https://metamask.io/download");
    } else
    {
      return await window.ethereum.request({method: 'eth_requestAccounts'});
    }
  }

  async function switchToBinance() {
    let ethereum = window.ethereum;
    const data = [{
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency:
            {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18
            },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    }]
    /* eslint-disable */
    const tx = await ethereum.request({method: 'wallet_addEthereumChain', params:data}).catch()
    if (tx) {
        console.log(tx)
    }
    fetchData();
  }

  // https://docs.metamask.io/guide/rpc-api.html#usage-with-wallet-switchethereumchain
  // https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(pelucaAddress, Peluca.abi, provider);
      var dropDisabled = '';
      try {
        const balance = await contract.balanceOf(accounts[0]);
        var supply = await contract.totalSupply();
        var nextSupplyTarget = await contract.getNextSupplyTarget();
        const isDeflationary = await contract.isDeflationaryPeriod();
        if (isDeflationary) {
          dropDisabled = '(inactivo)';
        }
        var aux = nextSupplyTarget.div(ethers.utils.parseUnits("1000000000000000000"));
        if  (aux == 0) {
          nextSupplyTarget = nextSupplyTarget.div(ethers.utils.parseUnits("1"));
        } else {
          nextSupplyTarget = nextSupplyTarget.div(ethers.utils.parseUnits("1000000000000000000"));
        }
        aux = supply.div(ethers.utils.parseUnits("1000000000000000000"));
        if  (aux == 0) {
          supply = supply.div(ethers.utils.parseUnits("1"));
        } else {
          supply = supply.div(ethers.utils.parseUnits("1000000000000000000"));
        }
        const object = {
          'balance': String(balance/(10**18)) + ' PELUCA',
          'supply': String(supply),
          'nextSupplyTarget': String(nextSupplyTarget),
          'isDeflationary': isDeflationary ? 'SI (Permanente)' : "NO (Todavía)",
          'connectedText': 'Conectado (BSC)',
          'dropDisabled': dropDisabled,
        };
        setData(object);
      } catch(err) {
        console.log(err);
        const object = {
          'balance': 'Sin Conexion',
          'supply': 'Sin Conexion',
          'nextSupplyTarget': 'Sin Conexion',
          'isDeflationary': 'Sin Conexion',
          'connectedText': 'CONECTAR a BSC',
          'dropDisabled': dropDisabled,
        };
        setData(object);
      }
    } else {
      const object = {
        'balance': 'Sin Conexion',
        'supply': 'Sin Conexion',
        'nextSupplyTarget': 'Sin Conexion',
        'isDeflationary': 'Sin Conexion',
        'connectedText': 'INSTALAR BILLETERA METAMASK http://metamask.io',
        'dropDisabled': '',
      };
      setData(object);
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(pelucaAddress, Peluca.abi, signer);
      const transaction = await contract.mint();
      setData({});
      await transaction.wait();
      fetchData();
    }
  }

  async function mint120() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(pelucaDropperAddress, PelucaDropper.abi, signer);
      const transaction = await contract.mintMany(ethers.utils.parseUnits("120"));
      setData({});
      await transaction.wait();
      fetchData();
    }
  }

  async function mint1200() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(pelucaDropperAddress, PelucaDropper.abi, signer);
      const transaction = await contract.mintMany(ethers.utils.parseUnits("1200"));
      setData({});
      await transaction.wait();
      fetchData();
    }
  }

  async function mint12000() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(pelucaDropperAddress, PelucaDropper.abi, signer);
      const transaction = await contract.mintMany(ethers.utils.parseUnits("12000"));
      setData({});
      await transaction.wait();
      fetchData();
    }
  }

  async function transferAmigo() {
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(pelucaAddress, Peluca.abi, signer);
      const transaction = await contract.transfer(addressAmigo, ethers.utils.parseUnits("0.1"));
      setData({});
      await transaction.wait();
      fetchData();
    }
  }

  async function setAmigoAddress(_addressAmigo) {
    addressAmigo = _addressAmigo;
    //setData({'addressAmigo': addressAmigo})
  }


  // 2677F0 CELESTE AZUL
  // 74aedf CELESTE BANDERA
  // Lucida Grande, Helvetica, Arial, sans-serif
  return (
    <div className="App" style={{ backgroundColor: "#74aedf", fontFamily: 'Lucida Grande, Helvetica, Arial, sans-serif' }}>
    </div>
  );
}

export default App;
