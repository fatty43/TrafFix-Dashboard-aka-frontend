import Web3 from "web3";
import DocumentRegistry from "../contracts/DocumentRegistry.json";

const CONTRACT_ADDRESS = "0x802a7D07E4bD1ffd8BDF196b411F75EdB1a74da8";

// Initialize Web3
export const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  } else {
    throw new Error("MetaMask is not installed!");
  }
};

// Get Smart Contract Instance
export const getContract = async (web3) => {
  return new web3.eth.Contract(DocumentRegistry.abi, CONTRACT_ADDRESS);
};

// Fetch Documents by CNIC from Blockchain
export const fetchDocumentsByCNIC = async (cnic) => {
  if (!cnic) {
    throw new Error("CNIC is required.");
  }

  const web3 = await getWeb3();
  const contract = await getContract(web3);

  try {
    // Fetch documents associated with the CNIC
    const documents = await contract.methods.getDocumentsByCNIC(cnic).call();

    if (documents.length === 0) {
      throw new Error("No documents found for this CNIC.");
    }

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents from the blockchain.");
  }
};
