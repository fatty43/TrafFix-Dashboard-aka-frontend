const UserRegistry = artifacts.require("UserRegistry");

module.exports = async (deployer, network, accounts) => {
    const userRegistry = await UserRegistry.deployed();

    // Call registerUser
    const tx = await userRegistry.registerUser(name, email, {
        from: accounts[0],
    });

    console.log("User registered. Transaction hash:", tx.tx);

    // Call getUser to verify
    const user = await userRegistry.getUser(accounts[0]);
    console.log("User fetched from contract:", user);
};
