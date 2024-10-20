let web3;
let contract;

const contractAddress = "YOUR_CONTRACT_ADDRESS_ON_POLYGON";
const contractABI = [
  // Your contract ABI goes here
];

async function initWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    // Request account access
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if the network is Polygon
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x89') { // 0x89 is the chain ID for Polygon mainnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18
                  },
                  rpcUrls: ['https://polygon-rpc.com/'],
                  blockExplorerUrls: ['https://polygonscan.com/']
                }],
              });
            } catch (addError) {
              console.error('Failed to add Polygon network', addError);
            }
          } else {
            console.error('Failed to switch to Polygon network', switchError);
          }
        }
      }
      
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Web3 initialized on Polygon");
    } catch (error) {
      console.error("User denied account access or failed to connect to Polygon");
    }
  } else {
    console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
  }
}

// ... (rest of the functions remain the same)