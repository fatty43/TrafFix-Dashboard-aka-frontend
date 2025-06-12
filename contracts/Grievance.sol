// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Grievance {
    struct Complaint {
        uint id; 
        address user;
        string category;    
        string description;
        string officerName;
        string date;  // New field
        string time;  // New field
        uint timestamp;
        string status; // e.g., "Filed", "Under Review", "Resolved"
    }

    uint public complaintCount = 0;
    mapping(uint => Complaint) public complaints;
    mapping(address => uint[]) public userComplaints;

    event ComplaintFiled(uint id, address user, string status);

    function fileComplaint(
    string memory  description,
    string memory officerName,
    string memory category,
    string memory  date,
    string memory time
    ) public {
        complaints[complaintCount] = Complaint(
            complaintCount,
            msg.sender,
            description,
            officerName,
             category,
            date,
            time,
            block.timestamp,
            "Filed"
        );
        userComplaints[msg.sender].push(complaintCount);

        emit ComplaintFiled(complaintCount, msg.sender, "Filed");
        complaintCount++;
    }

    function getComplaintsByUser(address user) public view returns (Complaint[] memory) {
        uint[] memory ids = userComplaints[user];
        Complaint[] memory userComplaintsArray = new Complaint[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            userComplaintsArray[i] = complaints[ids[i]];
        }
        return userComplaintsArray;
    }
}
