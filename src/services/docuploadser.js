import Web3 from "web3";
import DocumentRegistry from "../abis/DocumentRegistry.json";
import axios from "axios";

const CONTRACT_ADDRESS = "0x0B48F2b27d3aF12198c16A7D993B5af046b9ad49";

// JWT Token for Pinata
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZGQwYTU5My1jZjdmLTQyZmUtOWU4NS0zYmI0Y2Q0ZWI1MDQiLCJlbWFpbCI6ImZhdGltYWtpcm1hbmk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2NDIzMmVjYTQ4ZDNiYjg0YWVlZCIsInNjb3BlZEtleVNlY3JldCI6IjgzNTA2ODE0YzI3MTc3M2RjNmI5NTIxMmFhMWZhYjIxY2I1MTE5NzYzZDg3MjAzMjM5NTZiNzI5ZWVhMTA0YTciLCJleHAiOjE3ODEyODQ4NDZ9.0OhwRzdoO1K0SA1YbCeUL17n79ouNb9lz1Kye2cw1IU";

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

  // Add metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: { private: "true" }
  });
  formData.append("pinataMetadata", metadata);

  // Add options
  const options = JSON.stringify({
    cidVersion: 1,
    wrapWithDirectory: false
  });
  formData.append("pinataOptions", options);

  try {
    const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: Infinity,
      headers: {
        'Authorization': `Bearer ${JWT}`,
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
      },
    });

    if (!response.data || !response.data.IpfsHash) {
      throw new Error("Failed to get IPFS hash from response");
    }

    return response.data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error.response ? error.response.data : error);
    throw new Error(error.response?.data?.error?.details || "Failed to upload file to IPFS.");
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

  try {
    // Upload to IPFS first
    const ipfsHash = await uploadToIPFS(file);

    // Upload to blockchain
    const tx = await contract.methods
      .uploadDocument(cnic, documentType, description, ipfsHash)
      .send({ from: accounts[0] });

    return { transaction: tx, ipfsHash };
  } catch (error) {
    console.error("Upload Error:", error);
    if (error.message.includes("IPFS")) {
      throw error; // Re-throw IPFS errors
    }
    throw new Error("Failed to upload document to blockchain.");
  }
};
