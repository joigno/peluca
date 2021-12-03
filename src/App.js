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
      <br/>
      <p style={{ fontSize: "100%", textAlign:'right', flex:1 }}>Este sitio debe ser: <strong>peluca.finance</strong>&nbsp;&nbsp;</p>
      <p style={{ fontSize: "100%", textAlign:'right', flex:1 }}>{data.balance} <button onClick={switchToBinance}>{data.connectedText}</button>&nbsp;&nbsp;</p>
      <p style={{ fontSize: "250%", fontWeight: 'bold' }}>$PELUCA</p>
      <p style={{ fontSize: "200%" }}>La gran criptomoneda libertaria, militante y popular</p>
      <p style={{ fontSize: "100%" }}>(Crypto-Token No Oficial de Javier Milei)</p>
      <img src={logo} width="13%" height="10%" alt="Logo" />
      <p style={{ fontSize: "150%" }}>Tu Balance: {data.balance}</p>  
      <p style={{ fontSize: "150%" }}>Deflaci&#243;n (max 4% anual): {data.isDeflationary}</p>  
      <p style={{ fontSize: "150%" }}>Circulante: {data.supply} PELUCA</p>  
      <p style={{ fontSize: "150%" }}>Circulante Máximo: {data.nextSupplyTarget} PELUCA</p>  

      <div style={{ borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20 }}></div>

      <p className="Drop">
          Los Airdrops son proporcionales en Gas, más PELUCA cuesta más en Gas Fees.
          <br/>
          <br/>
          <button onClick={mint} >RECLAMAR AIRDROP BÁSICO</button>&nbsp;6 PELUCA&nbsp;{data.dropDisabled}
          <br/>
          <br/>
          <button onClick={mint120} >RECLAMAR AIRDROP MILITANTE</button>&nbsp;120 PELUCA&nbsp;{data.dropDisabled}
          <br/>
          <br/>
          <button onClick={mint1200} >RECLAMAR AIRDROP BASADO</button>&nbsp;1200 PELUCA&nbsp;{data.dropDisabled}
          <br/>
          <br/>
          <button onClick={mint12000} >RECLAMAR AIRDROP KAIOSAMA</button>&nbsp;12000 PELUCA&nbsp;{data.dropDisabled}
          <br/>
          <br/>
          <button onClick={transferAmigo}>ENVIAR AIRDROP MABEL</button>&nbsp;
          <input onChange={e => setAmigoAddress(e.target.value)} type="text" id="amigo" name="amigo" placeholder="Dirección BSC"></input>&nbsp;12 PELUCA&nbsp;{data.dropDisabled}
      </p>

      <div style={{ borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20 }}></div>

      <br/>
      <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91">✅ Token Verificado en BscScan</a><br/>
      <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91"><img src="https://bscscan.com/images/logo-bscscan.svg?v=0.0.3" width="13%" height="10%" alt="Logo" /></a>
      <br/>
      <br/>
      <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">📈 Tradear en PancakeSwap</a><br/>
      <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">
        <img src="https://www.pngall.com/wp-content/uploads/10/PancakeSwap-Crypto-Logo-PNG-File.png" width="13%" height="10%" alt="Logo" /></a>
      <br/>
      <a href="https://charts.bogged.finance/0x353395eB36E03Fe72Dce4EE77558688969283F91">📈 Tradear y Charts en Bogged Finance</a><br/>
      <a href="https://charts.bogged.finance/0x353395eB36E03Fe72Dce4EE77558688969283F91">
        <img src="https://i.postimg.cc/CxRrCpyn/imageedit-9-6884491972.png" width="13%" height="10%" alt="Logo" /></a>
      <br/>
      <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">💰 Dar Liquidez en PancakeSwap</a><br/>
      <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">
        <img src="https://www.pngall.com/wp-content/uploads/10/PancakeSwap-Crypto-Logo-PNG-File.png" width="13%" height="10%" alt="Logo" /></a>
      <br/>
      <br/>
      <div style={{ borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20 }}></div>
      <br/>
      <p style={{ fontSize: "150%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>Preguntas:</p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Cual es la emisón máxima de la criptomoneda $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>
       PELUCA la gran criptomoneda liberal y popular. Su emisión máxima es de 10 millones de PELUCA, es decir 10,000,000 PELUCA.
     </p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Que es la criptomoneda $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>
       Es la gran criptomoneda liberal y popular.
       Es un token desplegado dentro del blockchain Binance Smart Chain, siguiendo los estándares Ethereum y ERC20 para criptotokens fungibles.
       Es un token sin amo ni dueño, es decir el equipo desarrollador no puede controlar la emisión o destruir el token una vez desplegado/instalado en la red
       red central (Mainnet) de Binance Smart Chain (BSC). Los desarrolladores tampoco se reservan una porción especial de los tokens (de la torta), participan
       como el resto de los usuarios del período inicial de emisión. Es decir la emisión inicial es cero hasta alcanzar el objetivo máximo de emisión.
       Tiene las características de tener un límite fijo de emisión (dado por el patrón ERC20Capped), inicialmente cualquier usuario de la red BSC
       (vía el plugin MetaMask) puede reclamar tokens PELUCA
       mediante los drop/regalos en esta pagina (pagando solamente las comisiones de la red), y finalmente tiene características deflacionarias porque una pequeña
       fracción de los tokens se queman por año para que la masa monetaria decrece.
     </p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Como es el Tokenomics/Emisión de la criptomoneda $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>Se caracteriza por una Periodo Inicial Inflacionario transitorio, donde se emiten drops (regalos)
     de 3 PELUCA usando el botón de "Reclamar Drop" (se puede participar sin límite de veces), o 6 PELUCA a amigos usando el botón de
      "Dar Drop a Amigo" (donde se envían 0.1 PELUCA más el regalo de 6 PELUCA, solo si tu amigo tiene 0 PELUCA en su address). Para este Drop inicial solamente hay que gastar
     los gas fees de la red Binance Smart Chain, dando un aproximado un precio de 0.01 USD por PELUCA durante el Periodo Inflacionario. Cuando se alcanza el
     Limite (Cap) de Emisión de 10 millones de PELUCA (10,000,000 PELUCA) empieza el Periodo Deflacionario permanente, donde cada año se queman un máximo de
     4% de la masa monetaria. Es decir se destruyen a lo sumo cada anio 4 de cada 100 PELUCA por año cuando termina el Periodo Inflacionario
     y comienza el Periodo Deflacionario, que dura para siempre.
     Durante el Periodo Deflacionario permanente se queman en cada transferencia una bajísima emisión de 0.1% de los PELUCA involucrados en transferencias "transfer()" del este Token
     ERC20.</p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Como puedo ver el precio de $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>Se crearon pooles de
     trading/swap en <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">PancakeSwap</a> y <a href="https://app.apeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">ApeSwap</a> para comprar y vender PELUCA, esto dará un precio al token. En estas aplicaciones
     tambien se podra depositar liquidez en PELUCA para cobrar comisiones de trading (
       <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">liquidez en PancakeSwap</a>, <a href="https://app.apeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">liquidez en ApeSwap</a> 
     ). Inicialmente el precio será cercano
     a 0.01 USD por PELUCA dependiendo de los gas fees de la red BSC, pero es más conveniente participar de los Drops que comprar durante
     el periodo inflacionario. Luego de alcanzados 10,000,000 PELUCA comenzará el Periodo Deflacionario y el
     precio continuará flotando libremente, ahora con mayor libertad sin depender del precio de los drops/regalos.</p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Como puedo ver las transacciones de $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>Las transacciones se pueden ver en
     el <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91">explorador BscScan</a> con la dirección del token (<a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91">0x353395eB36E03Fe72Dce4EE77558688969283F91</a>). </p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Cual es el código fuente de $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>El código de fuente de Peluca es
     código abierto (open source), encuentra en Github y fue desarrollado usando el entorno Hardhat/ReactJS donde contiene 20 tests para evaluar el funcionamiento
     correcto de la criptomoneda. El equipo desarrollador se dedica a la auditoría y desarrollo de criptotokens y aplicaciones de finanzas descentralizadas.</p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Cual es el futuro del token $PELUCA?</p>
     <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>Como el entorno de Binance Smart Chain
     es compatible con Ethereum, es un entorno abierto, es decir cualquiera puede ver los balance de PELUCA e integrar sus transacciones con cualquier otro token o
     aplicación descentralizada. Por ejemplo, otra aplicación puede entregar premios o beneficios a los que tengan un balance positivos de PELUCA, u otra aplicación
     puede dar recompensas (rewards) en forma de otras criptomonedas a quienes depositen PELUCA en sus aplicaciones. Tambien se podrian usar en otras aplicaciones nuevas
     como garantía para dar o tomar tokens para financiación y pagar una comisión.
     </p>
     <p style={{ fontSize: "100%", fontWeight: 'bold', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem'   }}>¿Como instalo la billetera MetaMask y mi balance PELUCA en MetaMask?</p>
    <p style={{ fontSize: "100%", fontWeight: 'normal', textAlign:'left', flex:1, marginLeft: '2rem', marginRigh: '2rem' }}>
    <a href="https://metamask.io/download.html">MetaMask</a> es una billetera cripto que funciona como plugin del navegador Chrome (o compatibles como Brave) o en Teléfonos Móviles. El MetaMask se puede <a href="https://metamask.io/download.html">Instalar Aquí</a>. El
    token PELUCA se puede incluir, para ver tu balance, en tu billetera MetaMask eligiendo la opción "Import Token" y metiendo la dirección del token PELUCA, que es
    0x353395eB36E03Fe72Dce4EE77558688969283F91. Aunque no hayas importado el token en MetaMask igual puedes recibir PELUCA en tu dirección propia.    
    </p>
      <br/>

      <div style={{ borderTop: "2px solid #fff ", marginLeft: '1rem', marginRight: '1rem' }}></div>
      <p><strong>Descargo de responsabilidad legal.</strong>
      El Contenido es solo para fines informativos, no debe interpretar dicha información u otro material como asesoramiento legal, fiscal, de inversión, 
      financiero o de otro tipo. Nada de lo contenido en nuestro Sitio constituye una solicitud, recomendación, respaldo u oferta por parte de los desarrolladores
       o cualquier 
      proveedor de servicios externo para comprar o vender valores u otros instrumentos financieros en esta o en cualquier otra jurisdicción en la 
      que dicha solicitud u oferta sea ilegal, bajo las leyes de valores de dicha jurisdicción.
      El material de este sitio web y sus derivados se distribuye sin fines de lucro a aquellos que han expresado 
        un interés en recibir la información incluida para fines educativos y de investigación. Creemos que esto constituye un 'uso justo' de cualquier 
        material protegido por derechos de autor según lo dispuesto en la sección 107 de la Ley de derechos de autor de EE. UU. De acuerdo con el Título 
        17 USC Sección 107, el material de este sitio se distribuye sin fines de lucro a aquellos que han expresado un interés previo en recibir la información 
        incluida para fines educativos y de investigación. El contenido originado en este sitio web pueden reimprimirse, difundirse y traducirse libremente 
        siempre que se proporcione un reconocimiento y un enlace a la fuente. Contacto: admin@peluca.finance</p>
      
    </div>
  );
}

export default App;
