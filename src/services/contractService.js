 import Web3 from "web3";

import Grievance from "../abis/Grievance.json";

const CONTRACT_ADDRESS = "0xAb4A1DBD3333327D2e15c92Bad20Cb3528D02220";

// Export getWeb3
export const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return web3;
    } else {
        throw new Error("MetaMask not installed");
    }
};

export const getGrievanceContract = async () => {
    const web3 = await getWeb3();
    return new web3.eth.Contract(Grievance.abi, CONTRACT_ADDRESS);
};

export const fileComplaint = async (description, officerName,category, date, time) => {
    const web3 = await getWeb3();
    const contract = await getGrievanceContract();
    const accounts = await web3.eth.getAccounts();

    const receipt = await contract.methods
    .fileComplaint(description, officerName,category, date, time)
    .send({ from: accounts[0] });

return receipt;
};

export const getUserComplaints = async () => {
    const web3 = await getWeb3();
    const contract = await getGrievanceContract();
    const accounts = await web3.eth.getAccounts();

    const complaints = await contract.methods
        .getComplaintsByUser(accounts[0])
        .call();

    return complaints;
};
