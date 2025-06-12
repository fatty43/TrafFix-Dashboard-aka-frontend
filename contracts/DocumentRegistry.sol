// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    struct Document {
        string documentType;
        string description;
        string ipfsHash;
        address uploadedBy;
    }

    mapping(string => Document[]) private documentsByCnic;

    function uploadDocument(
        string memory _cnic,
        string memory _documentType,
        string memory _description,
        string memory _ipfsHash
    ) public {
        documentsByCnic[_cnic].push(Document({
            documentType: _documentType,
            description: _description,
            ipfsHash: _ipfsHash,
            uploadedBy: msg.sender
        }));
    }

    // ✅ Get number of documents for a CNIC
    function getDocumentCount(string memory _cnic) public view returns (uint) {
        return documentsByCnic[_cnic].length;
    }

    // ✅ Get a single document by index
    function getDocumentByIndex(string memory _cnic, uint index) public view returns (
        string memory, string memory, string memory, address
    ) {
        Document memory doc = documentsByCnic[_cnic][index];
        return (doc.documentType, doc.description, doc.ipfsHash, doc.uploadedBy);
    }
}
