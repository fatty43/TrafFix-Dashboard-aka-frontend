const Grievance = artifacts.require("Grievance");

module.exports = function (deployer) {
    
  deployer.deploy(Grievance);
};
