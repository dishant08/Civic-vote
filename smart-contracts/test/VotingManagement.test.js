const VotingManagement = artifacts.require("VotingManagement");
const { expectRevert } = require('@openzeppelin/test-helpers');

contract("VotingManagement", accounts => {
    const [admin, voter1, voter2, unverifiedVoter] = accounts;
    let voting;

    before(async () => {
        voting = await VotingManagement.new({ from: admin });
    });

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            const owner = await voting.owner();
            assert.equal(owner, admin, "Owner is not the admin account");
        });

        it("Should start in Registration state", async () => {
            const state = await voting.currentState();
            assert.equal(state.toString(), "0", "State is not Registration (0)");
        });
    });

    describe("Candidate Registration", () => {
        it("Should allow admin to add candidates", async () => {
            const tx = await voting.addCandidate("Alice", "Party A", "http://alice.png", { from: admin });
            assert.equal(tx.logs[0].event, "CandidateAdded");

            const candidates = await voting.getCandidates();
            assert.equal(candidates.length, 1);
            assert.equal(candidates[0].name, "Alice");
        });

        it("Should not allow non-admin to add candidates", async () => {
            try {
                await voting.addCandidate("Bob", "Party B", "bob.png", { from: voter1 });
                assert.fail("Expected revert not received");
            } catch (error) {
                assert(error.message.includes("revert"), "Expected revert error but got " + error.message);
            }
        });
    });

    describe("Voter Verification", () => {
        it("Should allow admin to whitelist voters", async () => {
            await voting.whitelistVoter([voter1, voter2], { from: admin });

            const isVerified1 = await voting.isVerifiedVoter(voter1);
            const isVerified2 = await voting.isVerifiedVoter(voter2);

            assert.isTrue(isVerified1, "Voter 1 should be verified");
            assert.isTrue(isVerified2, "Voter 2 should be verified");
        });

        it("Should not allow non-admin to whitelist voters", async () => {
            try {
                await voting.whitelistVoter([voter2], { from: voter1 });
                assert.fail("Expected revert not received");
            } catch (error) {
                assert(error.message.includes("revert"), "Expected revert error but got " + error.message);
            }
        });
    });

    describe("Voting Process", () => {
        it("Should transition from Registration to VotingLive", async () => {
            await voting.startVoting({ from: admin });
            const state = await voting.currentState();
            assert.equal(state.toString(), "1", "State should be VotingLive (1)");
        });

        it("Should not allow adding candidates after Voting starts", async () => {
            await expectRevert(
                voting.addCandidate("Charlie", "Party C", "charlie.png", { from: admin }),
                "Invalid election state for this action"
            );
        });

        it("Should allow a verified voter to cast a vote", async () => {
            const tx = await voting.castVote(0, { from: voter1 });
            assert.equal(tx.logs[0].event, "VoteCast");

            const candidates = await voting.getCandidates();
            assert.equal(candidates[0].voteCount.toString(), "1");

            const totalVotes = await voting.totalVotesCast();
            assert.equal(totalVotes.toString(), "1");
        });

        it("Should prevent non-verified voters from voting", async () => {
            await expectRevert(
                voting.castVote(0, { from: unverifiedVoter }),
                "Not a verified voter"
            );
        });

        it("Should prevent double voting", async () => {
            await expectRevert(
                voting.castVote(0, { from: voter1 }),
                "Already voted"
            );
        });
    });

    describe("Ending Election", () => {
        it("Should allow admin to end election", async () => {
            await voting.endVoting({ from: admin });
            const state = await voting.currentState();
            assert.equal(state.toString(), "2", "State should be Ended (2)");
        });
    });
});
