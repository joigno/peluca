import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import logo from './logo.png';
import Peluca from './artifacts/contracts/Peluca.sol/Peluca.json';
import PelucaDropper from './artifacts/contracts/PelucaDropper.sol/PelucaDropper.json';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
// https://medium.com/geekculture/how-to-use-google-analytics-on-reactjs-in-5-minutes-7f6b43017ba9
import ReactGA from 'react-ga';
ReactGA.initialize('G-8T5RQCVPDD')
ReactGA.pageview(window.location.pathname + window.location.search);
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

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    ???
  </Box>
);


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
          'isDeflationary': isDeflationary ? 'SI (Permanente)' : "NO (Todav??a)",
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

    <Box sx={{ flexGrow: 1 }}>
     <AppBar position="static">
       <Toolbar>
       <IconButton
           size="large"
           edge="start"
           color="inherit"
           aria-label="menu"
           sx={{ mr: 2 }}
         >
           $PELUCA
         </IconButton>

         
         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Este sitio debe ser:<Button color="inherit">  <strong>peluca.finance</strong></Button> { data.balance } <button  onClick={switchToBinance} >{ data.connectedText }</button>&nbsp;
         
         </Typography>
         <Typography>
           <a href="https://peluca-finance.translate.goog/?_x_tr_sl=es&_x_tr_tl=en&_x_tr_hl=es">
     <img src="https://www.worldometers.info/img/flags/small/tn_us-flag.gif" width="30px%" height="20x" alt="Logo" /></a>
     &nbsp;
     <a href="https://peluca-finance.translate.goog/?_x_tr_sl=es&_x_tr_tl=fr&_x_tr_hl=es">
     <img src="https://www.worldometers.info/img/flags/small/tn_fr-flag.gif" width="30px%" height="20x" alt="Logo" /></a>
     &nbsp;
     <a href="https://peluca-finance.translate.goog/?_x_tr_sl=es&_x_tr_tl=pt&_x_tr_hl=es">
     <img src="https://www.worldometers.info/img/flags/small/tn_br-flag.gif" width="30px%" height="20x" alt="Logo" /></a>
   
   &nbsp;
         </Typography>
         
       </Toolbar>
     </AppBar>
     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
     La gran criptomoneda libertaria, militante y popular<Button color="inherit">  </Button>
         
         </Typography>
         <img src={logo} width="13%" height="10%" alt="Logo" />
         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Tu Balance: <Button color="inherit">  <strong>{ data.balance }</strong></Button>
         
         </Typography>
         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Deflaci&#243;n (max 4% anual): {  data.isDeflationary }
         
         </Typography>
         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Circulante: { data.supply } PELUCA
         
         </Typography>
         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         Circulante M??ximo: { data.nextSupplyTarget } PELUCA
         
         </Typography>
     
         <div style={{ borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20 }}></div>
     <Typography style={{fontSize:22}}>
     AVISO: Los Airdrops son proporcionales en Gas, m??s PELUCA cuesta m??s en Gas Fees.
     </Typography>
     <Button variant="outlined" style={{backgroundColor:'white',width:400}}  onClick={mint}  >RECLAMAR AIRDROP B??SICO</Button>&nbsp;6 PELUCA&nbsp;{  data.dropDisabled } <br></br><br></br>
     <Button variant="outlined" style={{backgroundColor:'white',width:400,marginLeft:20  }}   onClick={mint120} >RECLAMAR AIRDROP MILITANTE</Button>&nbsp;120 PELUCA&nbsp;{ data.dropDisabled }<br></br><br></br>
     <Button variant="outlined" style={{backgroundColor:'white',width:400 ,marginLeft:35 }}  onClick={mint12000}    >RECLAMAR AIRDROP KAIOSAMA</Button>&nbsp;12000 PELUCA&nbsp;{ data.dropDisabled }<br></br><br></br>
     <Button variant="outlined" style={{backgroundColor:'white',width:400,marginRight:80  }}    onClick={transferAmigo} >ENVIAR AIRDROP MABEL</Button>&nbsp;<br></br><br></br>
     <TextField id="outlined-basic" label="Direcci??n BSC" variant="outlined" style={{backgroundColor:'white',width:400,borderRadius:10,marginRight:80 }}     onChange={e => setAmigoAddress(e.target.value)} /><br></br><br></br>
     <Typography style={{fontSize:22,color:'white',marginRight:100}}> &nbsp;12 PELUCA&nbsp;{data.dropDisabled } </Typography>
     <div style={{ borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20 }}></div>
     <div style={{margin:25,fontSize:23, color:'white',textAlign:'center',justifyContent:'center',alignItems:'center'}}>
     <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91" style={{textAlign:'center',color:'white',textDecoration:'none'}}>??? Token Verificado en BscScan</a><br/>
   <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91"><img src="https://bscscan.com/images/logo-bscscan.svg?v=0.0.3" width="13%" height="10%" alt="Logo" /></a>
   
   <br/>
   <br/>
   <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91" style={{textAlign:'center',color:'white',textDecoration:'none'}}>???? Tradear en PancakeSwap</a><br/>
   <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">
     <img src="https://www.pngall.com/wp-content/uploads/10/PancakeSwap-Crypto-Logo-PNG-File.png" width="13%" height="10%" alt="Logo" style={{marginBottom:30}} /></a>
   <br/>
   <a href="https://charts.bogged.finance/0x353395eB36E03Fe72Dce4EE77558688969283F91" style={{textAlign:'center',color:'white',textDecoration:'none'}}>???? Tradear y Charts en Bogged Finance</a><br/>
   <a href="https://charts.bogged.finance/0x353395eB36E03Fe72Dce4EE77558688969283F91">
     <img src="https://i.postimg.cc/CxRrCpyn/imageedit-9-6884491972.png" width="13%" height="10%" alt="Logo" /></a>
   <br/>
   <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" style={{textAlign:'center',color:'white',textDecoration:'none'}}>???? Dar Liquidez en PancakeSwap</a><br/>
   <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">
     <img src="https://www.pngall.com/wp-content/uploads/10/PancakeSwap-Crypto-Logo-PNG-File.png" width="13%" height="10%" alt="Logo"style={{marginBottom:30}}  /></a>
   <br/>
   <br/>
   <iframe src="https://app.bogged.finance/swap?tokenIn=0xe9e7cea3dedca5984780bafc599bd69add087d56&tokenOut=0x353395eB36E03Fe72Dce4EE77558688969283F91&embed=1&slippage=4" height="850px" width="100%" ></iframe>
 

     </div>

     <Typography style={{fontSize:23,fontWeight:'bolder'}}>
     Preguntas:
     </Typography>
     <div style={{display:'flex',textAlign:'center',justifyContent:'center'}}>
     <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Cual es la emis??n m??xima de la criptomoneda $PELUCA? 
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       PELUCA la gran criptomoneda liberal y popular. Su emisi??n m??xima es de 10 millones de PELUCA, es decir 10,000,000 PELUCA.
       </Typography>
       
     </CardContent>
    
   </Card>

   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Que es la criptomoneda $PELUCA?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
        Es la gran criptomoneda liberal y popular.
    Es un token desplegado dentro del blockchain Binance Smart Chain, siguiendo los est??ndares Ethereum y ERC20 para criptotokens fungibles.
    Es un token sin amo ni due??o, es decir el equipo desarrollador no puede controlar la emisi??n o destruir el token una vez desplegado/instalado en la red
    red central (Mainnet) de Binance Smart Chain (BSC). Los desarrolladores tampoco se reservan una porci??n especial de los tokens (de la torta), participan
    como el resto de los usuarios del per??odo inicial de emisi??n. Es decir la emisi??n inicial es cero hasta alcanzar el objetivo m??ximo de emisi??n.
    Tiene las caracter??sticas de tener un l??mite fijo de emisi??n (dado por el patr??n ERC20Capped), inicialmente cualquier usuario de la red BSC
    (v??a el plugin MetaMask) puede reclamar tokens PELUCA
    mediante los drop/regalos en esta pagina (pagando solamente las comisiones de la red), y finalmente tiene caracter??sticas deflacionarias porque una peque??a
    fracci??n de los tokens se queman por a??o para que la masa monetaria decrece.
       </Typography>
       
     </CardContent>
    
   </Card>
   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Como es el Tokenomics/Emisi??n de la criptomoneda $PELUCA?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       Se caracteriza por una Periodo Inicial Inflacionario transitorio, donde se emiten drops (regalos)
  de 3 PELUCA usando el bot??n de "Reclamar Drop" (se puede participar sin l??mite de veces), o 6 PELUCA a amigos usando el bot??n de
   "Dar Drop a Amigo" (donde se env??an 0.1 PELUCA m??s el regalo de 6 PELUCA, solo si tu amigo tiene 0 PELUCA en su address). Para este Drop inicial solamente hay que gastar
  los gas fees de la red Binance Smart Chain, dando un aproximado un precio de 0.01 USD por PELUCA durante el Periodo Inflacionario. Cuando se alcanza el
  Limite (Cap) de Emisi??n de 10 millones de PELUCA (10,000,000 PELUCA) empieza el Periodo Deflacionario permanente, donde cada a??o se queman un m??ximo de
  4% de la masa monetaria. Es decir se destruyen a lo sumo cada anio 4 de cada 100 PELUCA por a??o cuando termina el Periodo Inflacionario
  y comienza el Periodo Deflacionario, que dura para siempre.
  Durante el Periodo Deflacionario permanente se queman en cada transferencia una baj??sima fracci??n de 0.1% de los PELUCA involucrados en transferencias "transfer()" del este Token
  ERC20
       </Typography>
       
     </CardContent>
    
   </Card>
   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Como puedo ver el precio de $PELUCA?               
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       Se crearon pooles de
  trading/swap en <a href="https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">PancakeSwap</a> y <a href="https://app.apeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x353395eB36E03Fe72Dce4EE77558688969283F91">ApeSwap</a> para comprar y vender PELUCA, esto dar?? un precio al token. En estas aplicaciones
  tambien se podra depositar liquidez en PELUCA para cobrar comisiones de trading (
    <a href="https://pancakeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">liquidez en PancakeSwap</a>, <a href="https://app.apeswap.finance/add/0x353395eB36E03Fe72Dce4EE77558688969283F91/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56">liquidez en ApeSwap</a> 
  ). Inicialmente el precio ser?? cercano
  a 0.01 USD por PELUCA dependiendo de los gas fees de la red BSC, pero es m??s conveniente participar de los Drops que comprar durante
  el periodo inflacionario. Luego de alcanzados 10,000,000 PELUCA comenzar?? el Periodo Deflacionario y el
  precio continuar?? flotando libremente, ahora con mayor libertad sin depender del precio de los drops/regalos.
       </Typography>
       
     </CardContent>
    
   </Card>
</div>
<div style={{display:'flex',textAlign:'center',justifyContent:'center'}}>
     <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Como puedo ver las transacciones de $PELUCA?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       Las transacciones se pueden ver en
  el <a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91">explorador BscScan</a> con la direcci??n del token (<a href="https://bscscan.com/token/0x353395eB36E03Fe72Dce4EE77558688969283F91">0x353395eB36E03Fe72Dce4EE77558688969283F91</a>). 
       </Typography>
       
     </CardContent>
    
   </Card>

   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Cual es el c??digo fuente de $PELUCA?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       El c??digo de fuente de Peluca es
  c??digo abierto (open source), encuentra en Github y fue desarrollado usando el entorno Hardhat/ReactJS donde contiene 20 tests para evaluar el funcionamiento
  correcto de la criptomoneda. El equipo desarrollador se dedica a la auditor??a y desarrollo de criptotokens y aplicaciones de finanzas descentralizadas.
       </Typography>
       
     </CardContent>
    
   </Card>
   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Cual es el futuro del token $PELUCA?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       Como el entorno de Binance Smart Chain
  es compatible con Ethereum, es un entorno abierto, es decir cualquiera puede ver los balance de PELUCA e integrar sus transacciones con cualquier otro token o
  aplicaci??n descentralizada. Por ejemplo, otra aplicaci??n puede entregar premios o beneficios a los que tengan un balance positivos de PELUCA, u otra aplicaci??n
  puede dar recompensas (rewards) en forma de otras criptomonedas a quienes depositen PELUCA en sus aplicaciones. Tambien se podrian usar en otras aplicaciones nuevas
  como garant??a para dar o tomar tokens para financiaci??n y pagar una comisi??n.
       </Typography>
       
     </CardContent>
    
   </Card>

   <Card style={{width:500,margin:20}}>
     <CardContent>
      
       <Typography variant="h5" component="div">
       ??Como instalo la billetera MetaMask y mi balance PELUCA en MetaMask?
       </Typography>
       <br></br>
       <Typography sx={{ mb: 1.5 }} color="text.secondary">
       <a href="https://metamask.io/download.html">MetaMask</a> es una billetera cripto que funciona como plugin del navegador Chrome (o compatibles como Brave) o en Tel??fonos M??viles. El MetaMask se puede <a href="https://metamask.io/download.html">Instalar Aqu??</a>. El
 token PELUCA se puede incluir, para ver tu balance, en tu billetera MetaMask eligiendo la opci??n "Import Token" y metiendo la direcci??n del token PELUCA, que es
 0x353395eB36E03Fe72Dce4EE77558688969283F91. Aunque no hayas importado el token en MetaMask igual puedes recibir PELUCA en tu direcci??n propia.    
       </Typography>
       
     </CardContent>
    
   </Card>
  </div>
  <div style={{ borderTop: "2px solid #fff ", marginLeft: '1rem', marginRight: '1rem' }}></div>
  <Typography style={{fontSize:30}}>
  <Button style={{fontSize:21}}>Descargo de responsabilidad legal.</Button>
  </Typography>
  <Typography style={{textAlign:'center',justifyContent:'center'}}>
  El Contenido es solo para fines informativos, no debe interpretar dicha informaci??n u otro material como asesoramiento legal, fiscal, de inversi??n, 
   financiero o de otro tipo. Nada de lo contenido en nuestro Sitio constituye una solicitud, recomendaci??n, respaldo u oferta por parte de los desarrolladores
    o cualquier 
   proveedor de servicios externo para comprar o vender valores u otros instrumentos financieros en esta o en cualquier otra jurisdicci??n en la 
   que dicha solicitud u oferta sea ilegal, bajo las leyes de valores de dicha jurisdicci??n.
   El material de este sitio web y sus derivados se distribuye sin fines de lucro a aquellos que han expresado 
     un inter??s en recibir la informaci??n incluida para fines educativos y de investigaci??n. Creemos que esto constituye un 'uso justo' de cualquier 
     material protegido por derechos de autor seg??n lo dispuesto en la secci??n 107 de la Ley de derechos de autor de EE. UU. De acuerdo con el T??tulo 
     17 USC Secci??n 107, el material de este sitio se distribuye sin fines de lucro a aquellos que han expresado un inter??s previo en recibir la informaci??n 
     incluida para fines educativos y de investigaci??n. El contenido originado en este sitio web pueden reimprimirse, difundirse y traducirse libremente 
     siempre que se proporcione un reconocimiento y un enlace a la fuente. 
  </Typography>
  <Typography>
  <Button style={{fontSize:17}}> Contacto: admin@peluca.finance</Button>
 

  </Typography>

     
   </Box>



 
  


   
   
   
 </div>
  );
}

export default App;
