import Web3 from "web3";
import DocumentRegistry from "../contracts/DocumentRegistry.json";

import axios from "axios";

const CONTRACT_ADDRESS = "0x59ABEa80c54fE45e581a93DC582c20CcBCefaE81";

// IPFS Credentials (Replace with actual credentials)
const IPFS_API_KEY = "2a5fdc47aaf3fa0db3c4"; 
const IPFS_SECRET_API_KEY = "a912ce045d894c1455b7bf84d9a208f7a71962d224b3eee959620f5affcc83f1";

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

// Upload File to IPFS (Pinata)
export const uploadToIPFS = async (file) => {
  if (!file) {
    throw new Error("No file provided!");
  }

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, and PDF files are allowed.");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: IPFS_API_KEY,
        pinata_secret_api_key: IPFS_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash; // Returns IPFS hash
  } catch (error) {
    console.error("IPFS Upload Error:", error);
    throw new Error("Failed to upload file to IPFS.");
  }
};

// Upload Document to Blockchain
export const uploadDocumentToBlockchain = async (cnic, documentType, description, file) => {
  if (!cnic || !documentType || !file) {
    throw new Error("CNIC, document type, and file are required.");
  }

  const web3 = await getWeb3();
  const contract = await getContract(web3);
  const accounts = await web3.eth.getAccounts();

  // Upload to IPFS first
  const ipfsHash = await uploadToIPFS(file);

  try {
    const tx = await contract.methods
      .uploadDocument(cnic, documentType, description, ipfsHash)
      .send({ from: accounts[0] });

    return { transaction: tx, ipfsHash };
  } catch (error) {
    console.error("Blockchain Transaction Error:", error);
    throw new Error("Failed to upload document to blockchain.");
  }
};
