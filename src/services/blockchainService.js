// import Web3 from "web3";
// import UserRegistry from "../contracts/UserRegistry.json"; // Path to your contract's JSON file

// // Initialize Web3
// const getWeb3 = async () => {
//   if (window.ethereum) {
//     const web3 = new Web3(window.ethereum);
//     await window.ethereum.enable(); // Request user to connect MetaMask
//     return web3;
//   } else {
//     throw new Error("MetaMask is not installed!");
//   }
// };

// // Get Contract Instance
// const getContract = async (web3) => {
//   const networkId = await web3.eth.net.getId();
//   const deployedNetwork = UserRegistry.networks[networkId];
//   if (!deployedNetwork) {
//     throw new Error("Contract not deployed on this network!");
//   }
//   return new web3.eth.Contract(UserRegistry.abi, deployedNetwork.address);
// };

// // Example: Register a User
// export const registerUser = async (name, email, walletAddress) => {
//   try {
//     const web3 = await getWeb3();
//     const contract = await getContract(web3);
//     const accounts = await web3.eth.getAccounts();

//     const result = await contract.methods
//       .register(name, email, walletAddress)
//       .send({ from: accounts[0] });

//     return result; // Transaction receipt
//   } catch (error) {
//     console.error("Error registering user:", error);
//     throw error;
//   }
// };

// export const loginUser = async (walletAddress) => {
//   try {
//     const web3 = await getWeb3();
//     const contract = await getContract(web3);
//     const user = await contract.methods.getUser(walletAddress).call();
//     return user; // Return user details
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     throw error;
//   }
// };
import Web3 from "web3";
import UserRegistry from "../contracts/UserRegistry.json"; // Adjust the path to your contract's JSON file

const CONTRACT_ADDRESS ="0x3d7f624FDc8DaA2e7C85991eaEaa8E04Ac939B90";;

// Initialize Web3
export const getWeb3 = async () => {
  if (window.ethereum) {
    debugger;
    const web3 = new Web3(window.ethereum);
    // await window.ethereum.enable(); // Request user to connect MetaMask
    await window.ethereum.request({ method: 'eth_requestAccounts' });
   
    return web3;
  } else {
    throw new Error("MetaMask is not installed!");
  }
};


export const getContract = async (web3) => {
  
  return new web3.eth.Contract(UserRegistry.abi, CONTRACT_ADDRESS);
};







// // Function to check if a user is registered
// export const isUserRegistered = async (walletAddress) => {
//   try {
//     const web3 = await getWeb3();
//     const contract = await getContract(web3);

//     const user = await contract.methods.getUser(walletAddress).call();

//     // Check if the email or name fields are empty
//     if (user.email === "" && user.name === "") {
//       return false; // User not registered
//     }
//     return true; // User already registered
//   } catch (error) {
//     console.error("Error checking user registration:", error);
//     throw error;
//   }
// };









// Register a User
export const registerUser = async (name, email) => {
  try {
    const web3 = await getWeb3(); // Initialize Web3
    const contract = await getContract(web3); // Get the contract instance
    const accounts = await web3.eth.getAccounts(); // Get the user's MetaMask account

    const result = await contract.methods
      .registerUser(name, email,) // Call the `register` method on the smart contract
      .send({ from: accounts[0] }); // Send the transaction from the user's account

    // Return the transaction result (can include event data like privateKey)
    return result.events.NewUserRegistered.returnValues;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login a User
export const loginUser = async (walletAddress) => {
  try {
    const web3 = await getWeb3(); // Initialize Web3
    const contract = await getContract(web3); // Get the contract instance

    const user = await contract.methods
      .getUser(walletAddress) // Call the `getUser` method on the smart contract
      .call(); // Call the method without sending a transaction

    // Return the user details fetched from the blockchain
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
