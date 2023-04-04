import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {

  // Create connection to blockchain network 
  const wsProvider = new WsProvider(`wss://rpc.ibp.network/westend`);

  // Create a new instance of APIPromise with the websocket provider
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

  /**
   *  1. fetch the chain information
   */
  const chainInfo = await api.registry.getChainProperties()
  console.log(`chainInfo ${chainInfo}`);
  console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan

  // output for above code for Westend network
  // {"ss58Format":42,"tokenDecimals":[12],"tokenSymbol":["WND"]}

  //disconnect from the chain
  api.disconnect();
}


main().catch(console.error).finally(() => process.exit());;