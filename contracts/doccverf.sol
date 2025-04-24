 // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// // Interface for DocumentRegistry Contract
// interface IDocumentRegistry {
//     struct Document {
//         string cnic;
//         string documentType;
//         string description;
//         string ipfsHash;
//         address uploadedBy;
//         uint256 timestamp;
//     }
// function getDocumentsByCNIC(string memory _cnic) public view returns (
//     string[] memory, string[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory
// ) {
//     uint count = 0;
//     for (uint i = 0; i < documents.length; i++) {
//         if (keccak256(bytes(documents[i].cnic)) == keccak256(bytes(_cnic))) {
//             count++;
//         }
//     }

//     string[] memory cnicArray = new string[](count);
//     string[] memory types = new string[](count);
//     string[] memory descriptions = new string[](count);
//     string[] memory ipfsHashes = new string[](count);
//     address[] memory uploaders = new address[](count);
//     uint256[] memory timestamps = new uint256[](count);

//     uint index = 0;
//     for (uint i = 0; i < documents.length; i++) {
//         if (keccak256(bytes(documents[i].cnic)) == keccak256(bytes(_cnic))) {
//             cnicArray[index] = documents[i].cnic;
//             types[index] = documents[i].documentType;
//             descriptions[index] = documents[i].description;
//             ipfsHashes[index] = documents[i].ipfsHash;
//             uploaders[index] = documents[i].uploadedBy;
//             timestamps[index] = documents[i].timestamp;
//             index++;
//         }
//     }

//     return (cnicArray, types, descriptions, ipfsHashes, uploaders, timestamps);
// }

//     // function getDocumentsByCNIC(string memory _cnic) external view returns (Document[] memory);
// }

// contract DocumentVerification {
//     IDocumentRegistry public documentRegistry;

//     constructor(address _documentRegistryAddress) {
//         documentRegistry = IDocumentRegistry(_documentRegistryAddress); // Set the DocumentRegistry contract address
//     }

//     // Verify Document by CNIC
//     function verifyDocumentByCNIC(string memory cnic) public view returns (string memory) {
//         // Fetch documents for the provided CNIC
//         IDocumentRegistry.Document[] memory documents = documentRegistry.getDocumentsByCNIC(cnic);
        
//         if (documents.length == 0) {
//             return "No documents found for this CNIC";
//         }
        
//         // Add further verification or processing logic here
//         return "Documents found and verified.";
//     }
// }
 SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    struct Document {
        string cnic;
        string documentType;
        string description;
        string ipfsHash;
        address uploadedBy;
        uint256 timestamp;
    }

    Document[] public documents;

    function uploadDocument(string memory _cnic, string memory _documentType, string memory _description, string memory _ipfsHash) public {
        documents.push(Document({
            cnic: _cnic,
            documentType: _documentType,
            description: _description,
            ipfsHash: _ipfsHash,
            uploadedBy: msg.sender,
            timestamp: block.timestamp
        }));
    }

    function getDocumentsByCNIC(string memory _cnic) public view returns (
        string[] memory, string[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory
    ) {
        uint count = 0;
        for (uint i = 0; i < documents.length; i++) {
            if (keccak256(bytes(documents[i].cnic)) == keccak256(bytes(_cnic))) {
                count++;
            }
        }

        string[] memory cnics = new string[](count);
        string[] memory types = new string[](count);
        string[] memory descriptions = new string[](count);
        string[] memory hashes = new string[](count);
        address[] memory uploaders = new address[](count);
        uint256[] memory timestamps = new uint256[](count);

        uint j = 0;
        for (uint i = 0; i < documents.length; i++) {
            if (keccak256(bytes(documents[i].cnic)) == keccak256(bytes(_cnic))) {
                cnics[j] = documents[i].cnic;
                types[j] = documents[i].documentType;
                descriptions[j] = documents[i].description;
                hashes[j] = documents[i].ipfsHash;
                uploaders[j] = documents[i].uploadedBy;
                timestamps[j] = documents[i].timestamp;
                j++;
            }
        }

        return (cnics, types, descriptions, hashes, uploaders, timestamps);
    }
}
