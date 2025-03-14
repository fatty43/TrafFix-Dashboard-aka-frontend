// import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { getWeb3, getContract } from "services/docuploadser"; 
import React, { useState ,useCallback, useEffect } from "react";

import Card from "@mui/material/Card";
import { Checkbox, MenuItem, Select, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";

import bgImage from "assets/images/traffic-light-1360645_1280.jpg";

const IPFS_API_KEY = "2a5fdc47aaf3fa0db3c4"; 
const IPFS_SECRET_API_KEY = "a912ce045d894c1455b7bf84d9a208f7a71962d224b3eee959620f5affcc83f1";

function UploadDocument() {
  
  const [cnic, setCnic] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
// 📌 Track state changes
useEffect(() => {
  console.log("Updated CNIC:", cnic);
}, [cnic]);

useEffect(() => {
  console.log("Updated Document Type:", documentType);
}, [documentType]);

useEffect(() => {
  console.log("Updated File:", file);
}, [file]);
  const connectWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        console.log("Connected wallet:", accounts[0]); // Debugging log
        setWalletAddress(accounts[0]); //  Prevents unnecessary re-renders
        setError("");
      } else {
        // setError("MetaMask is not installed. Please install MetaMask.");
      }
    } catch (err) {
      // setError("Failed to connect MetaMask. Please try again.");
    }
  }, []);

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and PDF files are allowed.");
      return false;
    }
    return true;
  };

  const uploadToIPFS = async () => {
    if (!file || !validateFile(file)) {
      return null;
    }

    setIsUploading(true);
    setError("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: IPFS_API_KEY,
          pinata_secret_api_key: IPFS_SECRET_API_KEY,
        },
      });

      setIsUploading(false);
      return res.data.IpfsHash; 
    } catch (err) {
      setError("IPFS upload failed. Please try again.");
      setIsUploading(false);
      return null;
    }
  };

  const uploadToBlockchain = useCallback(async (e) => {
    debugger
    console.log("Submit button clicked"); // ✅ Debugging log
    
    console.log("CNIC:", cnic);
console.log("Document Type:", documentType);
console.log("File:", file);
    e.preventDefault();
    
    // if (!walletAddress) {
    //   setError("Please connect your MetaMask wallet first.");
    //   return;
    // }
    if (!cnic.trim() || !documentType || !file) {
      
    //  setError("All fields are required.");
  // setError(""); // Clear previous errors
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
      setError("");
    } catch (err) {
      console.error("Blockchain upload failed:", err);
      setError("Failed to store document on blockchain. Please try again.");
    }
  }, []);

  return (
    <div
    style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        // marginTop: "-50px", // Moves the form slightly upwards
        

      }}
    >
      <CoverLayout >
        <Card style={{ width: "350pxs", padding: "20px" }}>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Upload Your Document
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Store your documents securely on the blockchain
            </MDTypography>
          </MDBox>

          <MDBox pt={2} pb={2} px={2}>
            <MDBox component="form" role="form" onSubmit={(e) => uploadToBlockchain(e)}>
              
              <MDBox mb={2} textAlign="center">
                <MDButton variant="outlined" color="info" onClick={connectWallet}>
                  {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
                </MDButton>
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="CNIC Number"
                  variant="standard"
                  fullWidth
                  value={cnic}
                  onChange={(e) => {                                    // chnged this oart
                    console.log("CNIC changed to:", e.target.value); // Debugging
                    setCnic(e.target.value);
                  }}
                  required
                />
              </MDBox>

              <MDBox mb={2}>
                <Select
                  fullWidth
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  displayEmpty
                  variant="standard"
                >
                  <MenuItem value="" disabled>Select Document Type</MenuItem>
                  <MenuItem value="CNIC Copy">CNIC Copy</MenuItem>
                  <MenuItem value="Passport">Passport</MenuItem>
                  <MenuItem value="Driving License">Driving License</MenuItem>
                </Select>
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Enter document description (optional)"
                  variant="standard"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  type="file"
                  variant="standard"
                  fullWidth
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      let selectedFile = e.target.files[0]; // ✅ Declare selectedFile properly
                      console.log("File selected:", selectedFile); // Debugging log
                      setFile(selectedFile);
                    }
                  }}
                  required
                />
              </MDBox>

              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox />
                <MDTypography variant="button" fontWeight="regular" color="text" sx={{ cursor: "pointer", ml: -1 }}>
                  &nbsp;&nbsp;I agree to the&nbsp;
                </MDTypography>
                <MDTypography component="a" href="#" variant="button" fontWeight="bold" color="info" textGradient>
                  Terms and Conditions
                </MDTypography>
              </MDBox>

              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit" >
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
  );
}

export default UploadDocument;
