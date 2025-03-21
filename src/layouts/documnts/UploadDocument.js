// import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import React, { useState, useCallback, useEffect } from "react";

import axios from "axios";
import { getWeb3, getContract } from "services/docuploadser";

import Card from "@mui/material/Card";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";

// import bgImage from "assets/images/traffic-light-1360645_1280.jpg";
import bgImage from "assets/images/signnnnup.jpg";


// ✅ Import Dashboard Layout and Navbar
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZGQwYTU5My1jZjdmLTQyZmUtOWU4NS0zYmI0Y2Q0ZWI1MDQiLCJlbWFpbCI6ImZhdGltYWtpcm1hbmk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZDZkOWVhN2NjMTY4NjdhM2I4YSIsInNjb3BlZEtleVNlY3JldCI6ImQ3OTFmN2Y5MTRlMzA3MDI3NGRjMjQ2YTgwYzNkYTAzMGQ3N2E5ZjViNTk3ZTMxMjYzNWYxZTQ4Y2JhODc4YzIiLCJleHAiOjE3NzM5ODI0NTR9._e8lPdT3ALQiUu35W8f41bNKXIZkh8b3io0_A5fKBbY"; // Replace with your Pinata JWT Token
// const IPFS_API_KEY = "be5474947e6780202251";
// const IPFS_SECRET_API_KEY = "683e091092f9169e403146ab8ecc704d59dfa8f8d47a5a440528a44f5f2bbdd7";

function UploadDocument() {
  const [cnic, setCnic] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        console.log("Connected wallet:", accounts[0]);
      } else {
        setError("MetaMask is not installed. Please install MetaMask.");
      }
    } catch (err) {
      setError("Failed to connect MetaMask. Please try again.");
    }
  }, []);

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!file || !allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and PDF files are allowed.");
      return false;
    }
    return true;
  };

  const uploadToIPFS = async () => {
    if (!validateFile(file)) return null;

    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);

// ✅ Add metadata to mark as private
const metadata = JSON.stringify({
  name: file.name,
  keyvalues: { private: "true" }
});
formData.append("pinataMetadata", metadata)

// ✅ Add pinataOptions to disable public gateway access
const options = JSON.stringify({
  cidVersion: 1,
  wrapWithDirectory: false,  
  visibility: "unlisted"  // 🔹 This makes the file unlisted in Pinata
});
formData.append("pinataOptions", options);


    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
         
          "Authorization": `Bearer ${JWT}`, // 🔹 Use JWT instead of API key
          "Content-Type": "multipart/form-data",
        },
      });

      const ipfsHash = res.data.IpfsHash;
      console.log("IPFS Upload Successful! Hash:", ipfsHash);
      setIsUploading(false);
      return ipfsHash;
    } catch (err) {
      setError("IPFS upload failed. Please try again.");
      setIsUploading(false);
      return null;
    }
  };

  const uploadToBlockchain = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!walletAddress) {
      setError("Please connect your MetaMask wallet first.");
      return;
    }
    if (!cnic.trim() || !documentType || !file) {
      setError("All fields are required.");
      return;
    }

    const ipfsHash = await uploadToIPFS();
    if (!ipfsHash) return;

    try {
      const web3 = await getWeb3();
      const contract = await getContract(web3);
      const accounts = await web3.eth.getAccounts();

      const tx = await contract.methods.uploadDocument(cnic, documentType, description, ipfsHash).send({
        from: accounts[0],
      });

      console.log("Transaction successful:", tx);
      setSuccessMessage(`Document uploaded successfully! IPFS Hash: ${ipfsHash}`);
    } catch (err) {
      console.error("Blockchain upload failed:", err);
      setError("Failed to store document on blockchain. Please try again.");
    }
  };

  return (

<DashboardLayout>
<DashboardNavbar />



    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      <CoverLayout>
        <Card style={{ width: "400px", padding: "20px" }}>
          <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="success" p={3} textAlign="center">
            <MDTypography variant="h4" fontWeight="medium" color="white">
              Upload Your Document
            </MDTypography>
          </MDBox>

          <MDBox pt={2} pb={2} px={2}>
            <MDBox component="form" onSubmit={uploadToBlockchain}>
              <MDBox mb={2} textAlign="center">
                <MDButton variant="outlined" color="info" onClick={connectWallet}>
                  {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
                </MDButton>
              </MDBox>

              <MDBox mb={2}>
                <MDInput type="text" label="CNIC Number" fullWidth value={cnic} onChange={(e) => setCnic(e.target.value)} required />
              </MDBox>

              <MDBox mb={2}>
                <Select fullWidth value={documentType} onChange={(e) => setDocumentType(e.target.value)} displayEmpty>
                  <MenuItem value="" disabled>Select Document Type</MenuItem>
                  <MenuItem value="CNIC Copy">CNIC Copy</MenuItem>
                  <MenuItem value="Vehicle Original Copy">Vehicle Original Copy</MenuItem>
                  <MenuItem value="Passport">Passport</MenuItem>
                  <MenuItem value="Driving License">Driving License</MenuItem>
                </Select>
              </MDBox>

              <MDBox mb={2}>
                <TextField multiline rows={3} fullWidth placeholder="Enter document description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
              </MDBox>

              <MDBox mb={2}>
                <MDInput type="file" fullWidth onChange={(e) => setFile(e.target.files[0])} required />
              </MDBox>

              <MDBox display="flex" alignItems="center">
                <Checkbox />
                <MDTypography variant="button" fontWeight="regular" color="text">
                  &nbsp;&nbsp;I agree to the&nbsp;
                </MDTypography>
                <MDTypography component="a" href="#" variant="button" fontWeight="bold" color="info">
                  Terms and Conditions
                </MDTypography>
              </MDBox>

              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Document"}
                </MDButton>
              </MDBox>

              {successMessage && <MDTypography color="success">{successMessage}</MDTypography>}
              {error && <MDTypography color="error">{error}</MDTypography>}
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </div>
    </DashboardLayout>
  );
}

export default UploadDocument;
