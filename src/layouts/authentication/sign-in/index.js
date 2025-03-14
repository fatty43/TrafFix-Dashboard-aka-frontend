 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { loginUser } from "services/blockchainService";
import signinImage from "assets/images/signInn.jpg"; // Import the image

const LoginPage = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [metaMaskError, setMetaMaskError] = useState("");
  const [isRequestPending, setIsRequestPending] = useState(false); // Add this state
  const navigate = useNavigate();












  const handleMetaMaskLogin = async () => {
    if (window.ethereum) {
      setIsRequestPending(true); // Mark as pending
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
  
        const connectedWallet = accounts[0];
        setWalletAddress(connectedWallet); // Save the wallet address
        setMetaMaskError(""); // Clear any error
  
        console.log("Connected to MetaMask with wallet:", connectedWallet);
  
        // Check if the user is registered
        try {
          const user = await loginUser(connectedWallet); // Check registration
          if (user) {
            console.log("User details:", user);
            navigate("/dashboard"); // Navigate to dashboard after successful login
          } else {
            setMetaMaskError("User is not registered. Please register first.");
            console.warn("User not registered:", connectedWallet);
          }
        } catch (error) {
          setMetaMaskError("Failed to verify user registration.");
          console.error("Registration verification error:", error.message);
        }
      } catch (error) {
        if (error.code === 4001) {
          setMetaMaskError("Connection request was rejected by the user.");
        } else if (error.code === -32002) {
          setMetaMaskError("A connection request is already pending. Please wait.");
        } else {
          setMetaMaskError("Failed to connect to MetaMask. Please try again.");
        }
        console.error("MetaMask connection error:", error);
      } finally {
        setIsRequestPending(false); // Mark as not pending
      }
    } else {
      setMetaMaskError("MetaMask is not installed. Please install it.");
    }
  };
  









  // Function to handle MetaMask login
  // const handleMetaMaskLogin = async () => {
  //   if (window.ethereum) {
  //     setIsRequestPending(true); // Mark as pending
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //       setWalletAddress(accounts[0]);
  //       setMetaMaskError(""); // Clear any error
  //       console.log("Logged in with MetaMask: ", accounts[0]);
  //       setWalletAddress(walletAddress); // Save to state
  //       // Navigate to dashboard or other page after successful login
  //       navigate("/dashboard");



// Attempt login with blockchainService
// try {
//   const user = await loginUser(walletAddress);
//   console.log("User details:", user);
//   navigate("/dashboard"); // Navigate to dashboard after successful login
// // } catch (error) {
// //   setMetaMaskError("Failed to login. User might not be registered.");
//   console.error("Blockchain login error:", error.message);
// }

//       } catch (error) {
//         if (error.code === 4001) {
//           setMetaMaskError("Connection request was rejected by the user.");
//         } else if (error.code === -32002) {
//           setMetaMaskError("A connection request is already pending. Please wait.");
//         } else {
//           setMetaMaskError("Failed to connect to MetaMask. Please try again.");
//         }
//         console.error(error);
//       } finally {
//         setIsRequestPending(false); // Mark as not pending
//       }
//     } else {
//       setMetaMaskError("MetaMask is not installed. Please install it.");
//     }
//   };

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
        backgroundImage: `url(${signinImage})`, // Use the imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Typography
  variant="h1"
  mb={3}
  sx={{
    color: "#FFFFFF", // Explicitly set to white using hex code
    fontWeight: "bold", // Ensure better visibility
    // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Add a shadow for contrast
  }}
>
  Welcome To Traffix
</Typography>
<Button
  variant="contained"
  sx={{
    backgroundColor: "#000000", // Set your desired background color
    color: "white", // Set the text color
    "&:hover": {
      backgroundColor: "#e0e0e0", // Hover effect
    },
  }}

  onClick={handleMetaMaskLogin}
  disabled={isRequestPending} // Disable during pending state
>
  {isRequestPending ? "Connecting..." : "Login with MetaMask"}
</Button>













      {/* <Button
        variant="contained"
        sx={{
          backgroundColor: "black",
          color: "white", // Change text color to white for better visibility
          "&:hover": {
            backgroundColor: "gray", 
          },
          mb: 2,
        }}


        onClick={handleMetaMaskLogin}
      disabled={isRequestPending} // Disable during pending state
    >
      {isRequestPending ? "Connecting..." : "Login with MetaMask"}
    </Button> */}
      {walletAddress && (

  <Typography variant="body2" color="success.main" mt={2}>
    Logged in with MetaMask: {walletAddress}
  </Typography>
      )} 
    </Box>
  );
};

export default LoginPage;
