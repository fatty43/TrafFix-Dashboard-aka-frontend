// // react-router-dom components
import { Link } from "react-router-dom";
import { useState } from "react";

import { registerUser  } from "services/blockchainService";
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { getWeb3, getContract } from "../../../services/blockchainService"; // Update with the correct file path

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");/
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const connectWalletHandler = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        accountChangedHandler(accounts[0]);
      } else {
        setError("MetaMask is not installed. Please install MetaMask and try again.");
      }
    } catch (err) {
      setError("Failed to connect MetaMask. Please try again.");
      console.error("MetaMask connection error:", err);
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
  };



  // Function to handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email ) {
      setError("All fields are required.");
      return;
    }

    try {


      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
// Fetch the registered user details from the contract
const web3 = await getWeb3(); // Ensure Web3 is initialized
const contract = await getContract(web3); // Get the contract instance
const transaction = await contract.methods.registerUser(name, email).send({
  from: accounts[0],
});

console.log("Transaction successful:", transaction);
setSuccessMessage("Registration successful!");
setError("");
} catch (err) {
  console.error("Registration failed:", err.message || err);
  setError("Registration failed. Please check your inputs or MetaMask configuration.");
  setSuccessMessage("");
}



// if (!activeAccount) {
//   setError("No MetaMask account connected. Please connect your wallet.");
//   return;
// }

// if (activeAccount !== window.ethereum.selectedAddress) {
//   setError("MetaMask account mismatch. Please select the correct account.");
//   console.error("MetaMask account mismatch. Please select the correct account.");
//   return;
// }



}
      // const privateKey = await registerUser(name, email);
      // setSuccessMessage(`Registration successful! Your private key is: ${privateKey}`);
      // setError("");






// const accounts = await web3.eth.getAccounts(); // Get the user's MetaMask account

// const activeAccount = accounts[0];

// if (activeAccount !== window.ethereum.selectedAddress) {
//   setError("The selected MetaMask account does not match the active account.");
//   console.error("MetaMask account mismatch:", activeAccount, window.ethereum.selectedAddress);
//   return;
// }

// console.log("Connected MetaMask Account:", activeAccount);
// // const user = await contract.methods.getUser(accounts[0]).call(); // Query the user
// // console.log("Registered User Details:", user);

// // if (accounts.length === 0) {
// //   console.error("No MetaMask accounts found!");
// //   setError("MetaMask account not found. Please connect your wallet.");
// //   return;
// // }

// // Fetch user data from the contract


// if (user.name && user.email) {
//   console.log("Registered User Details:", user);
//   setSuccessMessage(`User Found: Name - ${user.name}, Email - ${user.email}`);
// } else {
//   console.log("No user registered with this account.");
//   setError("No user registered with this account.");
// }
// } catch (err) {
// console.error(err);
// setError("Registration failed. Please try again.");
// setSuccessMessage("");
// }
// };











// Fetch the registered user details from the contract
// const web3 = await getWeb3(); // Ensure Web3 is initialized
// const contract = await getContract(web3); // Get the contract instance
// const accounts = await web3.eth.getAccounts(); // Get the user's MetaMask account
// const user = await contract.methods.getUser(accounts[0]).call(); // Fetch user data
// if (accounts.length === 0) {
//   console.error("No MetaMask accounts found!");
//   return;
// }
// console.log("Registered User Details:", user); // Log the details to the console for verification






//     } catch (err) {
//       console.error(err);
//       setError("Registration failed. Please try again.");
//       setSuccessMessage("");
//     }







    
//   };
      
  return (
    <CoverLayout image={bgImage}>
      <Card>
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
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleRegister}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Register
              </MDButton>
            </MDBox>
            {successMessage && (
              <MDTypography variant="body2" color="success.main" mt={2}>
                {successMessage}
              </MDTypography>
            )}
            {error && (
              <MDTypography variant="body2" color="error.main" mt={2}>
                {error}
              </MDTypography>
            )}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
