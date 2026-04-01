// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingManagement is Ownable {
    enum ElectionState { Registration, VotingLive, Ended }

    ElectionState public currentState;
    
    struct Candidate {
        uint256 id;
        string name;
        string party;
        string symbolUrl;
        uint256 voteCount;
    }

    struct Voter {
        address walletAddress;
        string name;
    }

    mapping(address => bool) public isVerifiedVoter;
    mapping(address => bool) public hasVoted;
    
    Candidate[] public candidates;
    Voter[] public whitelistedVotersList;
    uint256 public totalVotesCast;

    event CandidateAdded(uint256 candidateId, string name);
    event VoterVerified(address voter, string name);
    event ElectionStateChanged(ElectionState newState);
    event VoteCast(address voter, uint256 candidateId);

    // Initializing Ownable without arguments in OpenZeppelin 5 requires passing msg.sender to the parent constructor
    constructor() Ownable(msg.sender) {
        currentState = ElectionState.Registration;
    }

    modifier inState(ElectionState state) {
        require(currentState == state, "Invalid election state for this action");
        _;
    }

    function addCandidate(string memory _name, string memory _party, string memory _symbolUrl) external onlyOwner inState(ElectionState.Registration) {
        uint256 newId = candidates.length;
        candidates.push(Candidate({
            id: newId,
            name: _name,
            party: _party,
            symbolUrl: _symbolUrl,
            voteCount: 0
        }));
        emit CandidateAdded(newId, _name);
    }

    function whitelistVoter(address _voter, string calldata _name) external onlyOwner {
        require(!isVerifiedVoter[_voter], "Voter already verified");
        isVerifiedVoter[_voter] = true;
        whitelistedVotersList.push(Voter({
            walletAddress: _voter,
            name: _name
        }));
        emit VoterVerified(_voter, _name);
    }

    function startVoting() external onlyOwner inState(ElectionState.Registration) {
        currentState = ElectionState.VotingLive;
        emit ElectionStateChanged(ElectionState.VotingLive);
    }

    function castVote(uint256 _candidateId) external inState(ElectionState.VotingLive) {
        require(isVerifiedVoter[msg.sender], "Not a verified voter");
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId < candidates.length, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount += 1;
        totalVotesCast += 1;

        emit VoteCast(msg.sender, _candidateId);
    }

    function endVoting() external onlyOwner inState(ElectionState.VotingLive) {
        currentState = ElectionState.Ended;
        emit ElectionStateChanged(ElectionState.Ended);
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getWhitelistedVoters() external view returns (Voter[] memory) {
        return whitelistedVotersList;
    }
}
