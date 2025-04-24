const TrafficChallan = artifacts.require("TrafficChallan");

module.exports = function (deployer) {
    console.log("Deploying TrafficChallan...")
    // Deploy the TrafficChallan contract
    deployer.deploy(TrafficChallan);
};

