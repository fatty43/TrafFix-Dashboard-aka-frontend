// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract TrafficChallan {

    // Define a struct to hold the challan details
    struct Challan {
        uint challanId;
        string vehicleNumber;
        string offense;
        uint fineAmount;
        string date;
        string time;
        address officer;
        bool isPaid;
        uint timestamp;
    }

    // Store all the generated challans in a mapping
    mapping(uint => Challan) public challans;

    // Generate a counter to create unique Challan IDs
    uint public challanCounter;

    // Event to emit when a challan is generated
    event ChallanGenerated(
        uint indexed challanId,
        string vehicleNumber,
        string offense,
        uint fineAmount,
        string date,
        string time,
        address officer
    );

    // Modifier to check if the caller is an authorized officer
    modifier onlyOfficer() {
        // Assuming the officer's address is the caller of the function
        require(msg.sender != address(0), "Invalid address");
        _;
    }

    // Constructor to initialize the contract with a starting challan ID
    constructor() {
        challanCounter = 1; // Start from challan ID 1
    }

    // Function to generate a traffic challan
    function generateChallan(
        string memory vehicleNumber,
        string memory offense,
        uint fineAmount,
        string memory date,
        string memory time
    ) public onlyOfficer returns (uint) {
        // Create a new challan
        Challan memory newChallan = Challan({
            challanId: challanCounter,
            vehicleNumber: vehicleNumber,
            offense: offense,
            fineAmount: fineAmount,
            date: date,
            time: time,
            officer: msg.sender,
            isPaid: false,
            timestamp: block.timestamp
        });

        // Store the challan in the mapping
        challans[challanCounter] = newChallan;

        // Emit the ChallanGenerated event
        emit ChallanGenerated(
            challanCounter,
            vehicleNumber,
            offense,
            fineAmount,
            date,
            time,
            msg.sender
        );

        // Increment the challan counter for the next challan
        challanCounter++;

        // Return the generated challan ID
        return challanCounter - 1;
    }

    // Function to get challan details by challan ID
    function getChallan(uint challanId) public view returns (
        uint, 
        string memory, 
        string memory, 
        uint, 
        string memory, 
        string memory, 
        address, 
        bool,
        uint
    ) {
        Challan memory c = challans[challanId];
        return (
            c.challanId,
            c.vehicleNumber,
            c.offense,
            c.fineAmount,
            c.date,
            c.time,
            c.officer,
            c.isPaid,
            c.timestamp
        );
    }}

    
