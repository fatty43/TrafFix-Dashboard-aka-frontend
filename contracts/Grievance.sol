// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Grievance {
    struct Complaint {
        uint id; 
        address user;
        string description;
        string officerName;
        uint timestamp;
        string status; // e.g., "Filed", "Under Review", "Resolved"
    }

    uint public complaintCount = 0;
    mapping(uint => Complaint) public complaints;
    mapping(address => uint[]) public userComplaints;

    event ComplaintFiled(uint id, address user, string status);

    function fileComplaint(string memory description, string memory officerName) public {
        complaints[complaintCount] = Complaint(
            complaintCount,
            msg.sender,
            description,
            officerName,
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
