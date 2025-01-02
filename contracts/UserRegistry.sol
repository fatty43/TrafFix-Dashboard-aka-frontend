// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserRegistry {
    struct User {
        string name;
        string email;
        string privateKey; // Store the private key
        address walletAddress;
    }

    mapping(address => User) public users;

    function registerUser(string memory _name, string memory _email, string memory _privateKey) public {
        require(bytes(users[msg.sender].email).length == 0, "User already registered");
        users[msg.sender] = User(_name, _email, _privateKey, msg.sender);
    }

    function getUser(address _userAddress) public view returns (string memory, string memory, string memory, address) {
        User memory user = users[_userAddress];
        return (user.name, user.email, user.privateKey, user.walletAddress);
    }
}
