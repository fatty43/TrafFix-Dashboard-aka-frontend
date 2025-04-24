 import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getWeb3, getContract } from 'services/docsverfi'; // Utility functions for Web3 and Contract interaction
import { TextField, Button, Card, Typography, CircularProgress, Grid } from '@mui/material';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import signinImage from "assets/images/signInn.jpg"; // Import the image


function DocumentVerification() {
  const [cnic, setCnic] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async (e) => {            debugger 
    e.preventDefault();
    setError("");
    setDocuments([]);
    setLoading(true);

    if (!cnic) {
      setError("Please enter a valid CNIC.");
      setLoading(false);
      return;
    }
   
    try {
      const web3 = await getWeb3();
      console.log("Web3:", web3);

      // const contract = await getContract(web3);
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      console.log("Contract loaded:", contract);


      const testDocs = await contract.methods.getDocumentsByCNIC("35202-1234567-8").call();
      console.log("Manual CNIC test output:", testDocs);

      // Fetch documents by CNIC
    //   const allDocuments = await contract.methods.getUserDocuments(cnic).call();
    // const allDocuments = await contract.methods.getDocumentsByCNIC(cnic).call();
    // console.log("Documents:", allDocuments);

    const allDocuments = await contract.methods.getDocumentsByCNIC(cnic).call();
    console.log("Raw Documents:", allDocuments);
    
    // Convert tuple arrays to structured document objects
    const structuredDocs = allDocuments[0].map((_, i) => ({
      cnic: allDocuments[0][i],
      documentType: allDocuments[1][i],
      description: allDocuments[2][i],
      ipfsHash: allDocuments[3][i],
      uploadedBy: allDocuments[4][i],
      timestamp: allDocuments[5][i],
    }));
    
    console.log("Structured Documents:", structuredDocs);
    
    if (structuredDocs.length === 0) {
      setError("No documents found for this CNIC.");
    } else {
      setDocuments(structuredDocs);
    }
    

      if (allDocuments.length === 0) {
        setError("No documents found for this CNIC.");
      } else {
        setDocuments(allDocuments);
      }
    } catch (err) {
      console.error("Error in contract call:", err);
      setError("Failed to fetch documents. Please try again.");
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
  sx={{
    height: "100vh", // Full screen height
    backgroundImage: `url(${signinImage})`, // Set background image
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // So the header can be placed correctly
  }}
>
<Typography
        variant="h3"
        sx={{
          position: "absolute",  // Make the header text float over the background
          top: "20px",           // Adjust distance from top
          color: "#ffffff",      // White text color for contrast
          fontWeight: "bold",    // Bold text for emphasis
          textShadow: "2px 2px 4px rgba(0,0,0,0.6)",  // Add shadow for text clarity
        }}
      >
        TRAFFIC OFFICER DASHBOARD
      </Typography>

  <Card style={{ padding: "20px", width: "80%", maxWidth: "600px" }}>

          <Typography variant="h4" gutterBottom>
            Verify Document by CNIC
          </Typography>

          <MDBox component="form" onSubmit={fetchDocuments}>
            <TextField
              label="Enter CNIC"
              variant="outlined"
              fullWidth
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              style={{ marginBottom: "20px" }}
            />

            <MDButton variant="gradient" color="info" fullWidth type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Documents"}
            </MDButton>
          </MDBox>

          {error && <Typography color="error" variant="body2" style={{ marginTop: "20px" }}>{error}</Typography>}

          {documents.length > 0 && (
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              {documents.map((doc, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card style={{ padding: "10px", textAlign: "center" }}>
                    <Typography variant="h6">Document {index + 1}</Typography>
                    <Typography variant="body2">Type: {doc.documentType}</Typography>
                    <Typography variant="body2">Description: {doc.description}</Typography>
                    <Typography variant="body2">Uploaded By: {doc.uploadedBy}</Typography>
                    <Typography variant="body2">Timestamp: {new Date(doc.timestamp * 1000).toLocaleString()}</Typography>
                    <MDButton
                      variant="outlined"
                      color="success"
                      onClick={() => alert(`Verified Document ${index + 1}`)}
                      style={{ marginTop: "10px" }}
                    >
                      Verify Document
                    </MDButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default DocumentVerification;
