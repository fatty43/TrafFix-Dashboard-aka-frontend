const DocumentVerification = artifacts.require("DocumentVerification");

module.exports = async function (deployer) {
  const documentRegistryAddress = "0x1C53FBD08E33DBF3D6f0281E60adBAdE737aDFB5"; // Replace with actual address
  await deployer.deploy(DocumentVerification, documentRegistryAddress);
};

