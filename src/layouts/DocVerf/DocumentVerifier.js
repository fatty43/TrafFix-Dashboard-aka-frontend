import React, { useState, useEffect } from 'react';
import {
  TextField, Button, CircularProgress, Card, Grid
} from '@mui/material';
import { fetchDocumentsByCNIC } from '../../services/documentVerf';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Images
import bgImage from "assets/images/signInn.jpg";

const DocumentVerifier = () => {
  const [cnic, setCnic] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState('');
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');

  const checkNetworkAndAccount = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Get both chainId and networkId for debugging
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const networkId = await window.ethereum.request({ method: 'net_version' });
      
      console.log('Current chainId:', chainId);
      console.log('Current networkId:', networkId);
      
      // Store network info
      setNetwork(networkId);

      // Get accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected accounts:', accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }
      setAccount(accounts[0]);

      return accounts[0];
    } catch (error) {
      console.error('Network check error:', error);
      if (error.code === -32002) {
        throw new Error('MetaMask is already processing a connection request. Please check your MetaMask.');
      }
      throw error;
    }
  };

  // Check network and account on component mount
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        await checkNetworkAndAccount();
      } catch (error) {
        console.error('Initialization error:', error);
        setError(error.message);
      }
    };

    initializeConnection();

    // Set up event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setError(''); // Clear any previous errors
        } else {
          setAccount('');
          setError('Please connect your MetaMask wallet.');
        }
      });

      window.ethereum.on('chainChanged', async (chainId) => {
        console.log('Network changed to chainId:', chainId);
        window.location.reload(); // Reload when network changes
      });

      // Cleanup listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      };
    }
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      // Check MetaMask and network first
      await checkNetworkAndAccount();
      
      // Verify CNIC input
      if (!cnic || cnic.trim() === '') {
        throw new Error('Please enter a valid CNIC number.');
      }

      // Format CNIC: remove any spaces or dashes and ensure it's only numbers
      const formattedCNIC = cnic.replace(/[^0-9]/g, '');
      
      // Add CNIC format validation
      const cnicRegex = /^\d{13}$/;  // Expects exactly 13 digits
      if (!cnicRegex.test(formattedCNIC)) {
        throw new Error('CNIC must be exactly 13 digits.');
      }
      
      console.log('Verifying CNIC:', formattedCNIC);
      const result = await fetchDocumentsByCNIC(formattedCNIC);
      
      if (!result || result.length === 0) {
        throw new Error('No documents found for this CNIC.');
      }
      
      console.log('Documents found:', result);
      setDocuments(result);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Verification error:', err);
      let errorMessage = '';
      
      // Handle specific MetaMask errors
      if (err.code === 4001) {
        errorMessage = 'Transaction was rejected by user.';
      } else if (err.code === -32603) {
        errorMessage = 'Network connection error. Please check your MetaMask connection and try again.';
      } else if (err.message.includes('User denied')) {
        errorMessage = 'Please approve the connection request in MetaMask.';
      } else if (err.message.includes('nonce')) {
        errorMessage = 'Transaction nonce error. Please reset your MetaMask account.';
      } else {
        errorMessage = err.message || 'An error occurred while verifying the documents. Please try again.';
      }
      
      setError(errorMessage);
      setDocuments([]); // Clear any previous results
    } finally {
      setLoading(false);
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
              Verify Vehicle Documents
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDInput
                    label="Enter CNIC"
                    variant="outlined"
                    fullWidth
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    error={!!error}
                    helperText={error}
                    inputProps={{ 
                      pattern: "[0-9]*",
                      inputMode: "numeric",
                      maxLength: 13
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={handleVerify}
                    disabled={loading}
                    sx={{ 
                      py: 1.5
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                  </MDButton>
                </Grid>

                {!loading && documents.length > 0 && (
                  <Grid item xs={12}>
                    <MDBox mt={2}>
                      {documents.map((doc, i) => (
                        <Card key={i} sx={{ mb: 2, p: 2 }}>
                          <MDTypography variant="body2" component="div" gutterBottom>
                            <strong>Type:</strong> {doc.documentType}
                          </MDTypography>
                          <MDTypography variant="body2" component="div" gutterBottom>
                            <strong>Description:</strong> {doc.description}
                          </MDTypography>
                          <MDTypography variant="body2" component="div" gutterBottom>
                            <strong>Uploader:</strong> {doc.uploadedBy}
                          </MDTypography>
                          <MDTypography variant="body2" component="div">
                            <strong>IPFS:</strong>{' '}
                            <MDTypography
                              component="a"
                              href={`https://ipfs.io/ipfs/${doc.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="info"
                            >
                              {doc.ipfsHash}
                            </MDTypography>
                          </MDTypography>
                        </Card>
                      ))}
                    </MDBox>
                  </Grid>
                )}
              </Grid>
            </MDBox>
          </MDBox>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DocumentVerifier;