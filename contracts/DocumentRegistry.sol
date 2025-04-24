// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract DocumentRegistry {
    struct Document {
        string cnic;
        string documentType;
        string description;
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
    }

    mapping(string => Document[]) public documentsByCnic; // Mapping documents by CNIC
    
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
        
        documentsByCnic[_cnic].push(newDocument); // Storing document by CNIC
        
        emit DocumentUploaded(msg.sender, _cnic, _documentType, _description, _ipfsHash, block.timestamp);
    }

    // Get documents by CNIC
    function getDocumentsByCNIC(string memory _cnic) public view returns (Document[] memory) {
        return documentsByCnic[_cnic];
    }
}
