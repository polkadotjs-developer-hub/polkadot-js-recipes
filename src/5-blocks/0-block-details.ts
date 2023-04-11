import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 *  ############################## TODO: add your block hash below ########################################
 */
const blockHash = '0x43376170b4c1c446e0506c5d39b70a88d68795a0c21002980d70f29866888671';


async function main() {

  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

  /**
   * 
   * 1. Retrieve the block hash of the block and fetch extrinsics and events
   *    
   */

  // Get the block for the block hash
  const signedBlock = await api.rpc.chain.getBlock(blockHash);

  console.log(`\n######################################## Block details ############################################`);
  // Print block details
  console.log(`\n Block hash: ${signedBlock.block.hash}`);
  console.log(`\n Block number: ${signedBlock.block.header.number}`);
  console.log(`\n Parent hash: ${signedBlock.block.header.parentHash}`);
  console.log(`\n State root: ${signedBlock.block.header.stateRoot}`);
  console.log(`\n Extrinsics root: ${signedBlock.block.header.extrinsicsRoot}`);
  console.log(`\n Digest logs: ${signedBlock.block.header.digest.logs}`);
  console.log(`\n Extrinsics count: ${signedBlock.block.extrinsics.length}`);

  //disconnect from the chain
  api.disconnect();
}

main().catch(console.error);