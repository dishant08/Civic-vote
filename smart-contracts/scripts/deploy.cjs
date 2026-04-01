const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const Voting = await ethers.getContractFactory("VotingManagement");
    const voting = await Voting.deploy();

    await voting.waitForDeployment();
    const address = await voting.getAddress();

    console.log("VotingManagement deployed to:", address);

    // Write ABI and address directly to frontend
    const artifactPath = "./artifacts/contracts/VotingManagement.sol/VotingManagement.json";
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    const frontendAbiPath = "../web/src/lib/VotingManagementABI.json";
    fs.writeFileSync(frontendAbiPath, JSON.stringify(artifact.abi, null, 2));

    console.log("Wrote ABI to", frontendAbiPath);

    // Also write the address directly to wagmi config
    let wagmiConfig = fs.readFileSync("../web/src/lib/wagmi.ts", "utf8");
    wagmiConfig = wagmiConfig.replace(/export const VOTING_CONTRACT_ADDRESS = ".*" as const;/, `export const VOTING_CONTRACT_ADDRESS = "${address}" as const;`);
    fs.writeFileSync("../web/src/lib/wagmi.ts", wagmiConfig);

    console.log("Updated Wagmi config address as well.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
