const GrievanceContractV2 = artifacts.require("GrievanceContractV2");

module.exports = function (deployer) {
    deployer.deploy(GrievanceContractV2);
};
