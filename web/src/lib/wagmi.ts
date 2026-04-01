import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { localhost } from 'wagmi/chains'

export const config = createConfig({
    chains: [localhost],
    connectors: [injected()],
    transports: {
        [localhost.id]: http('http://127.0.0.1:8545'),
    },
})

// Current dynamically deployed Truffle address
export const VOTING_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3" as const;
