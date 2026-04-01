# Decentralized Voting System - Local Testing Guide

This guide explains how to run the three components of the voting system locally for testing and verification.

---

## Prerequisites
- Node.js (v20+ recommended for backend/frontend, v18/v20 compatible for Truffle)
- npm or yarn

---

## 1. Smart Contracts (Truffle Local Blockchain)

To simulate the blockchain, we will use Truffle's local development node.

1. Open Terminal 1
2. Navigate to the contract folder:
   ```bash
   cd /home/silence/antigravity/BLOCKCHAIN_VOTE/smart-contracts
   ```
3. Start the local Truffle development blockchain:
   ```bash
   npx truffle develop
   ```
4. Inside the `truffle(develop)>` console, compile and deploy the contracts:
   ```bash
   compile
   migrate
   ```
   **Note the `VotingManagement` contract address** that is printed upon successful migration.

---

## 2. Off-Chain Verification API (Node.js/Express)

The backend handles the simulation of document reviews (since documents should not be stored on the blockchain).

1. Open Terminal 2
2. Navigate to the backend folder:
   ```bash
   cd /home/silence/antigravity/BLOCKCHAIN_VOTE/backend
   ```
3. Start the API server:
   ```bash
   npm run start 
   ```
   *(Or run `npx tsc && node dist/index.js`)*
4. The server will run on `http://localhost:4000`. It automatically creates the SQLite `verification.db` file.

---

## 3. Frontend Application (Next.js)

The frontend contains all three portals: Admin, Voter, and Public Transparency.

1. Open Terminal 3
2. Navigate to the frontend folder:
   ```bash
   cd /home/silence/antigravity/BLOCKCHAIN_VOTE/web
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. The application will run on `http://localhost:3000`.

### Navigation Paths
Open your browser and navigate to these routes to view the UIs:
- **Admin Setup & Candidates:** [http://localhost:3000/admin/candidates](http://localhost:3000/admin/candidates)
- **Admin Verification Portal:** [http://localhost:3000/admin/verification](http://localhost:3000/admin/verification)
- **Voter Onboarding:** [http://localhost:3000/voter](http://localhost:3000/voter)
- **Voter Ballot:** [http://localhost:3000/voter/ballot](http://localhost:3000/voter/ballot)
- **Public Dashboard:** [http://localhost:3000/public](http://localhost:3000/public)
