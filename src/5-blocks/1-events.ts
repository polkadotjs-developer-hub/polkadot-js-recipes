// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 *  TODO: add your block hash here
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

  // Returns a decorated API instance at a specific block hash
  const apiAt = await api.at(blockHash);
  // Get the events for the block hash
  const events = await apiAt.query.system.events();
  // Get the block for the block hash
  const signedBlock = await api.rpc.chain.getBlock(blockHash);

  console.log(`\n######################################## Extrinsic events ############################################`);

  /**
   * 
   * 2. Print the extrinsics and events for the block
   * 
   */

  // Iterate through the extrinsics in the block and print the events for each extrinsic
  signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {

    console.log(`\n Extrinsic ${index} is ${section}.${method}`);
    events
      .forEach(({ event }) => {
        console.log(`\n Event ${event.section}.${event.method}:: ${JSON.stringify(event.data)}`);

      });

  });
}

main().catch(console.error);