import Web3 from 'web3';
import DocumentRegistry from '../abis/DocumentRegistry.json';

// Initialize web3 with error handling
let web3;
let contract;

const initializeContract = async () => {
  try {
    console.log('Starting contract initialization...');

    // Initialize Web3 with direct RPC connection first
    const rpcUrl = 'http://127.0.0.1:7545';
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    
    // Test RPC connection
    const isListening = await web3.eth.net.isListening();
    if (!isListening) {
      throw new Error('Cannot connect to Ganache');
    }
    console.log('Connected to Ganache at:', rpcUrl);

    // Get network details
    const networkId = await web3.eth.net.getId();
    console.log('Network ID:', networkId);

    // Now check MetaMask
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('Please connect your MetaMask wallet');
    }
    console.log('Using account:', accounts[0]);

    // Initialize contract
    const contractAddress = "0x0B48F2b27d3aF12198c16A7D993B5af046b9ad49";
    const code = await web3.eth.getCode(contractAddress);
    
    if (code === '0x' || code === '0x0') {
      throw new Error('Contract not found at the specified address');
    }

    contract = new web3.eth.Contract(DocumentRegistry.abi, contractAddress);
    console.log('Contract initialized successfully');

    return true;
  } catch (error) {
    console.error('Initialization error:', error);
    throw error;
  }
};

// Export the fetchDocumentsByCNIC function
export const fetchDocumentsByCNIC = async (cnic) => {
  try {
    // Ensure contract is initialized
    if (!web3 || !contract) {
      console.log('Contract not initialized, attempting initialization...');
      const initialized = await initializeContract();
      if (!initialized) {
        throw new Error('Failed to initialize contract connection');
      }
    }

    if (!cnic) {
      throw new Error('Invalid CNIC input');
    }

    // Format CNIC and get account
    const formattedCNIC = cnic.toString().replace(/[^0-9]/g, '');
    console.log('Formatted CNIC:', formattedCNIC);
    
    const accounts = await web3.eth.getAccounts();
    console.log('Connected accounts:', accounts);
    
    if (accounts.length === 0) {
      throw new Error('No accounts connected. Please connect MetaMask.');
    }

    // Debug contract state
    console.log('Contract state:', {
      address: contract._address,
      methods: Object.keys(contract.methods),
      network: await web3.eth.net.getId(),
      account: accounts[0]
    });

    // Make the contract call
    console.log('Calling getDocumentCount...');
    const count = await contract.methods.getDocumentCount(formattedCNIC).call({
      from: accounts[0]
    });
    
    console.log('Document count result:', count);
    
    if (parseInt(count) === 0) {
      return [];
    }

    const documents = [];
    // Use Promise.all for parallel requests
    const docPromises = [];
    for (let i = 0; i < count; i++) {
      docPromises.push(
        contract.methods.getDocumentByIndex(formattedCNIC, i).call({
          from: accounts[0]
        })
      );
    }
    
    const docs = await Promise.all(docPromises);
    documents.push(...docs.map(doc => ({
      documentType: doc[0],
      description: doc[1],
      ipfsHash: doc[2],
      uploadedBy: doc[3],
    })));

    console.log("Retrieved documents:", documents);
    return documents;

  } catch (error) {
    console.error("Contract interaction error:", {
      message: error.message,
      code: error.code,
      data: error.data,
      stack: error.stack
    });

    // Enhanced error handling for contract reverts
    if (error.data && typeof error.data === 'object' && error.data.message) {
      if (error.data.message.includes('revert')) {
        console.log('Contract call reverted. Details:', error.data);
        throw new Error('The contract rejected this request. This usually means the CNIC does not exist in the contract.');
      }
    }

    // Check for specific error types
    if (error.message.includes('execution reverted')) {
      throw new Error('The contract rejected this request. This usually means the CNIC does not exist in the contract.');
    } else if (error.message.includes('Internal JSON-RPC error')) {
      // Try to extract more specific error if available
      const innerError = error.data && error.data.message ? error.data.message : error.message;
      console.log('Inner error details:', innerError);
      
      if (innerError.includes('revert')) {
        throw new Error('The contract rejected this request. This usually means the CNIC does not exist in the contract.');
      }
      throw new Error('Contract call failed. Please ensure you have documents registered for this CNIC.');
    }
    
    throw error;
  }
};