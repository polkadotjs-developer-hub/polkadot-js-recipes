// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

async function main () {
  // Create connection to websocket
  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider , noInitWarn: true});
  // get the chain information
  const chainInfo = await api.registry.getChainProperties()

  console.log(`chainInfo ${chainInfo}`);
  // for Polkadot this would print
  // {ss58Format: 0, tokenDecimals: [10], tokenSymbol: [DOT]}
}

main().catch(console.error).finally(() => process.exit());;