import { ApiPromise, WsProvider } from '@polkadot/api';

async function main () {

  // Create connection to blockchain network 
  const wsProvider = new WsProvider(`wss://westend-rpc.polkadot.io`);

  // Create a new instance of APIPromise with the websocket provider
  const api = await ApiPromise.create({ provider: wsProvider , noInitWarn: true});
  
  /**
   *  1. fetch the chain information
   */
  const chainInfo = await api.registry.getChainProperties()
  console.log(`chainInfo ${chainInfo}`);

  // output for above code for Westend network
  // {"ss58Format":42,"tokenDecimals":[12],"tokenSymbol":["WND"]}
}


main().catch(console.error).finally(() => process.exit());;