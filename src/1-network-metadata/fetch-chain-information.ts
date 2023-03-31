import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'

// Load the .env file and set the environment variables
dotenv.config()

async function main () {

  // Create connection to blockchain network with the websocket url(WS_URL) environment variable from .env file
  const wsProvider = new WsProvider(process.env.WS_URL);

  // Create a new instance of APIPromise with the websocket provider
  const api = await ApiPromise.create({ provider: wsProvider , noInitWarn: true});
  
  /**
   *  1. fetch the chain information
   * 
   */
  const chainInfo = await api.registry.getChainProperties()
  console.log(`chainInfo ${chainInfo}`);

  // output for above code for Westend network
  // {"ss58Format":42,"tokenDecimals":[12],"tokenSymbol":["WND"]}
}


main().catch(console.error).finally(() => process.exit());;