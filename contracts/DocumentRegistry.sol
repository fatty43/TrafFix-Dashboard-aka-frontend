// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DocumentRegistry {
    struct Document {
        string cnic;
        string documentType;
        string description;
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
    }

    mapping(address => Document[]) public userDocuments;
    address[] public users;
    
    event DocumentUploaded(
        address indexed uploadedBy,
        string cnic,
        string documentType,
        string description,
        string ipfsHash,
        uint256 timestamp
    );

    // Upload a document
    function uploadDocument(
        string memory _cnic,
        string memory _documentType,
        string memory _description,
        string memory _ipfsHash
    ) public {
        Document memory newDocument = Document({
            cnic: _cnic,
            documentType: _documentType,
            description: _description,
            ipfsHash: _ipfsHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp
        });
        
        userDocuments[msg.sender].push(newDocument);
        
        if (userDocuments[msg.sender].length == 1) {
            users.push(msg.sender);
        }

        emit DocumentUploaded(msg.sender, _cnic, _documentType, _description, _ipfsHash, block.timestamp);
    }

    // Get all documents uploaded by a user
    function getUserDocuments(address _user) public view returns (Document[] memory) {
        return userDocuments[_user];
    }
    
    // Get list of all users who uploaded documents
    function getAllUsers() public view returns (address[] memory) {
        return users;
    }
}
