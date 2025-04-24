const TrafficChallan = artifacts.require("TrafficChallan");

module.exports = function (deployer) {
    // Deploy the TrafficChallan contract
    deployer.deploy(TrafficChallan);
};

