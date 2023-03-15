import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'

// Load the .env file and set the environment variables
dotenv.config()

async function main () {

  // Create connection to blockchain network with the websocket url(WS_URL) environment variable from .env file
  const wsProvider = new WsProvider(process.env.WS_URL);

  // Create a new instance of APIPromise with the websocket provider
  const api = await ApiPromise.create({ provider: wsProvider , noInitWarn: true});
  
  // get the chain information
  const chainInfo = await api.registry.getChainProperties()
  console.log(`chainInfo ${chainInfo}`);
  // for Polkadot this would print
  // {ss58Format: 0, tokenDecimals: [10], tokenSymbol: [DOT]}
}

main().catch(console.error).finally(() => process.exit());;