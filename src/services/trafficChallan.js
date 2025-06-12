 import Web3 from 'web3';
import TrafficChallanABI from '../abis/TrafficChallan.json'; // Make sure the ABI JSON is exported from Truffle

const CONTRACT_ADDRESS = '0x3ebf61d7368F7f4cc6B482b219DC008eA82D1d31'; // Update with actual address from Ganache

export const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    return web3;
  } else {
    throw new Error('Please install MetaMask!');
  }
};

export const getChallanContract = async (web3) => {
  return new web3.eth.Contract(TrafficChallanABI.abi, CONTRACT_ADDRESS);
};
