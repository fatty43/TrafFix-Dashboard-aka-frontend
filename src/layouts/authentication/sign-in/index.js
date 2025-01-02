 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { loginUser } from "services/blockchainService";


const LoginPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [metaMaskError, setMetaMaskError] = useState("");
  const [isRequestPending, setIsRequestPending] = useState(false); // Add this state
  const navigate = useNavigate();

  // Function to handle MetaMask login
  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      setIsRequestPending(true); // Mark as pending
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setMetaMaskError(""); // Clear any error
        console.log("Logged in with MetaMask: ", accounts[0]);
        setWalletAddress(walletAddress); // Save to state
        // Navigate to dashboard or other page after successful login
        navigate("/dashboard");



// Attempt login with blockchainService
try {
  const user = await loginUser(walletAddress);
  console.log("User details:", user);
  navigate("/dashboard"); // Navigate to dashboard after successful login
} catch (error) {
  setMetaMaskError("Failed to login. User might not be registered.");
  console.error("Blockchain login error:", error.message);
}





      } catch (error) {
        if (error.code === 4001) {
          setMetaMaskError("Connection request was rejected by the user.");
        } else if (error.code === -32002) {
          setMetaMaskError("A connection request is already pending. Please wait.");
        } else {
          setMetaMaskError("Failed to connect to MetaMask. Please try again.");
        }
        console.error(error);
      } finally {
        setIsRequestPending(false); // Mark as not pending
      }
    } else {
      setMetaMaskError("MetaMask is not installed. Please install it.");
    }
  };

  // Add MetaMask event listeners using useEffect
  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
    if (window.ethereum) {
      // Listen for account changes
      
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log("Account changed to:", accounts[0]);
        } else {
          setWalletAddress("");
          console.log("Wallet disconnected");
        }
      });

      // Listen for network changes
      window.ethereum.on("chainChanged", (chainId) => {
        console.log("Network changed to:", chainId);
      });


      
 // Add the event listeners
 window.ethereum.on("accountsChanged", handleAccountsChanged);
 window.ethereum.on("chainChanged", handleChainChanged);
      return () => {
        // Remove listeners with the same references
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    } }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundImage: "url(/)", // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography variant="h4" mb={3}>
        Welcome To Traffix
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleMetaMaskLogin}
        sx={{ mb: 2 }}
        disabled={isRequestPending} // Disable during pending state
      >
        {isRequestPending ? "Connecting..." : "Login with MetaMask"}
      </Button>
      {walletAddress && (

  <Typography variant="body2" color="success.main" mt={2}>
    Logged in with MetaMask: {walletAddress}
  </Typography>
      )} 
    </Box>
  );
};

export default LoginPage;
