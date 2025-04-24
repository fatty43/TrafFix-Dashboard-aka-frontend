import Web3 from "web3";
 // import trafficChallan from "../contracts/TrafficChallan.json";

// Replace with your deployed contract address
const CHALLAN_CONTRACT_ADDRESS = "0xFa50850cA313AC2D82fFbbCa990aaec4A7976eBD";

// Initialize Web3
export const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return web3;
    } else {
        throw new Error("MetaMask not installed");
    }
};

// Get instance of TrafficChallan contract
export const getChallanContract = async () => {
    const web3 = await getWeb3();
    return new web3.eth.Contract(TrafficChallan.abi, CHALLAN_CONTRACT_ADDRESS);
};

// Generate a new challan
export const generateChallan = async (vehicleNumber, offense, fineAmount, date, time) => {
    const web3 = await getWeb3();
    const contract = await getChallanContract();
    const accounts = await web3.eth.getAccounts();

    const receipt = await contract.methods
        .generateChallan(vehicleNumber, offense, fineAmount, date, time)
        .send({ from: accounts[0] });

    return receipt;
};

// Fetch challan details by challan ID
export const getChallan = async (challanId) => {
    const web3 = await getWeb3();
    const contract = await getChallanContract();

    const challanDetails = await contract.methods
        .getChallan(challanId)
        .call();

    return challanDetails;
};
