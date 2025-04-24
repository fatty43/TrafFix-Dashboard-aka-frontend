import Web3 from "web3";
import DocumentRegistry from "../contracts/DocumentRegistry.json"; // Make sure this path is correct

// Smart Contract Address (Update to your deployed contract address)
const CONTRACT_ADDRESS = "0xEAde404E942eCd2A33F8470F6A4b357d8A83A1c8";

// Connect to Web3
export const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  } else {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this feature.");
  }
};

// Get Contract Instance
export const getContract = async (web3) => {
  return new web3.eth.Contract(DocumentRegistry.abi, CONTRACT_ADDRESS);
};

// Fetch Documents by CNIC and Structure Them
export const fetchDocumentsByCNIC = async (cnic) => {
  if (!cnic) {
    throw new Error("CNIC is required.");
  }

  try {
    const web3 = await getWeb3();
    const contract = await getContract(web3);
    const allDocuments = await contract.methods.getDocumentsByCNIC(cnic).call();

    // Structure the returned arrays into objects
    const structuredDocuments = allDocuments[0].map((_, i) => ({
      cnic: allDocuments[0][i],
      documentType: allDocuments[1][i],
      description: allDocuments[2][i],
      ipfsHash: allDocuments[3][i],
      uploadedBy: allDocuments[4][i],
      timestamp: allDocuments[5][i],
    }));

    return structuredDocuments;
  } catch (error) {
    console.error("Error in fetchDocumentsByCNIC:", error);
    throw new Error("Failed to fetch documents from the blockchain.");
  }
};
