// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract UserRegistry {
    struct User {
        string name;
        string email;
        address walletAddress;
    }

    mapping(address => User) public users; // Mapping to store user data
    address[] public userAddresses; // Array to keep track of registered addresses

// Event for user registration
    event UserRegistered(address indexed walletAddress, string name, string email);



    // Register a new user
    function registerUser(string memory _name, string memory _email) public {
        require(bytes(users[msg.sender].email).length == 0, "User already registered");

        // Store user details in the mapping
        users[msg.sender] = User(_name, _email, msg.sender);

        // Add the user's address to the array
        userAddresses.push(msg.sender);

// Emit the UserRegistered event
        emit UserRegistered(msg.sender, _name, _email);

    }

    // Get user details by address
    function getUser(address _userAddress) public view returns (string memory, string memory, address) {
        User memory user = users[_userAddress];
        return (user.name, user.email, user.walletAddress);
    }

    // Get the list of all registered addresses
    function getAllUsers() public view returns (address[] memory) {
        return userAddresses;
    }
}
