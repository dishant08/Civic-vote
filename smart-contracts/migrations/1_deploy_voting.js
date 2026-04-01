const VotingManagement = artifacts.require("VotingManagement");

module.exports = function (deployer) {
    deployer.deploy(VotingManagement);
};
