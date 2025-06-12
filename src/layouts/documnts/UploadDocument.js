// import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import React, { useState, useCallback, useEffect } from "react";

import axios from "axios";
import { getWeb3, getContract } from "services/docuploadser";

import Card from "@mui/material/Card";
import { Checkbox, MenuItem, Select, TextField, Grid } from "@mui/material";
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
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZGQwYTU5My1jZjdmLTQyZmUtOWU4NS0zYmI0Y2Q0ZWI1MDQiLCJlbWFpbCI6ImZhdGltYWtpcm1hbmk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2NDIzMmVjYTQ4ZDNiYjg0YWVlZCIsInNjb3BlZEtleVNlY3JldCI6IjgzNTA2ODE0YzI3MTc3M2RjNmI5NTIxMmFhMWZhYjIxY2I1MTE5NzYzZDg3MjAzMjM5NTZiNzI5ZWVhMTA0YTciLCJleHAiOjE3ODEyODQ4NDZ9.0OhwRzdoO1K0SA1YbCeUL17n79ouNb9lz1Kye2cw1IU";
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
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Card sx={{ 
        maxWidth: "550px", 
        width: "100%",
        margin: "auto",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
      }}>
        <MDBox 
          variant="gradient" 
          bgColor="info"
          borderRadius="lg" 
          coloredShadow="info" 
          mx={2}
          mt={-3}
          p={2.5}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white">
            Upload Your Document
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" onSubmit={uploadToBlockchain}>
            <Grid container spacing={3}>
              <Grid item xs={12} textAlign="center">
                <MDButton 
                  variant="outlined" 
                  color="info" 
                  onClick={connectWallet}
                  sx={{ minWidth: "200px" }}
                >
                  {walletAddress ? `Connected: ${walletAddress.slice(0, 9)}...` : "Connect Wallet"}
                </MDButton>
              </Grid>

              <Grid item xs={12}>
                <MDInput 
                  type="text" 
                  label="CNIC Number" 
                  fullWidth 
                  value={cnic} 
                  onChange={(e) => setCnic(e.target.value)} 
                  required 
                />
              </Grid>

              <Grid item xs={12}>
                <Select 
                  fullWidth 
                  value={documentType} 
                  onChange={(e) => setDocumentType(e.target.value)} 
                  displayEmpty
                  sx={{ 
                    height: "45px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)"
                    }
                  }}
                >
                  <MenuItem value="" disabled>Select Document Type</MenuItem>
                  <MenuItem value="CNIC Copy">CNIC Copy</MenuItem>
                  <MenuItem value="Vehicle Original Copy">Vehicle Original Copy</MenuItem>
                  <MenuItem value="Passport">Passport</MenuItem>
                  <MenuItem value="Driving License">Driving License</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  multiline 
                  rows={3} 
                  fullWidth 
                  placeholder="Enter document description (optional)" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0, 0, 0, 0.23)"
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <MDBox 
                  sx={{
                    border: "1px dashed rgba(0, 0, 0, 0.23)",
                    borderRadius: "8px",
                    padding: "1rem",
                    textAlign: "center"
                  }}
                >
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    style={{ 
                      width: "100%",
                      cursor: "pointer"
                    }}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12}>
                <MDButton 
                  variant="gradient" 
                  color="info" 
                  fullWidth 
                  type="submit" 
                  disabled={isUploading}
                  sx={{ 
                    py: 1.5,
                    mt: 1
                  }}
                >
                  {isUploading ? "Uploading..." : "UPLOAD"}
                </MDButton>
              </Grid>

              {(successMessage || error) && (
                <Grid item xs={12} textAlign="center">
                  {successMessage && (
                    <MDTypography color="success" variant="button" fontWeight="medium">
                      {successMessage}
                    </MDTypography>
                  )}
                  {error && (
                    <MDTypography color="error" variant="button" fontWeight="medium">
                      {error}
                    </MDTypography>
                  )}
                </Grid>
              )}
            </Grid>
          </MDBox>
        </MDBox>
      </Card>
    </div>
    </DashboardLayout>
  );
}

export default UploadDocument;
