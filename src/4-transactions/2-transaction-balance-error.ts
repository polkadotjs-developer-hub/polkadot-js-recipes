import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal, toDecimalAmount } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
import { calculateTransactionFees, fetchAccountInfo, fetchBalances } from '../utils/transactionUtils';
dotenv.config()

/**
 * TODO: add your sender account address below
 */
const SENDER_ACCOUNT = '5GEwX4bq8uzehVgdTKfmPrXPU61XoUdqfCZmWxs1tajKz9K8';

/**
 * TODO: add your sender mnemonic below
 */
const SENDER_MNEMONIC = 'cause trip unique fossil hello supreme release know design marriage never filter';

/**
 * TODO: add your receiver account address below
 */
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';

// Amount to be transferred from sender account to receiver account
const SENDER_AMOUNT = 100000;

async function main() {

  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
  console.log(`\n######################################## Transaction initiating ############################################`);

  /**
   * 1. Retrieve the initial balance of the account of the sender and receiver account.
   * 
   */
  const account = await fetchAccountInfo(SENDER_MNEMONIC, api);
  await fetchBalances(api, SENDER_ACCOUNT, RECEIVER_ACCOUNT);


  /**
   * 2. calculate transaction fees for a particular transaction amount while transferring tokens from 
   *    sender account to receiver account and convert it to decimal format
   * 
   **/

  const planckAmount = await calculateTransactionFees(SENDER_AMOUNT, RECEIVER_ACCOUNT, account, api);

  /**
   * 3. Handle transaction errors while transferring tokens from the sender account to the receiver account
   * 
   **/

  //API to transfer tokens from the sender account to the receiver account
  await api.tx.balances
    .transfer(RECEIVER_ACCOUNT, planckAmount)
    .signAndSend(account, async ({ dispatchError, txHash }) => {

      // in case of error, the dispatchError is set and we can display the error details
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
          console.log(`\n######################################## Transaction failed ################################################`);
          console.log(`\n Transaction failed with error: ${section}.${name} : ${docs.join(' ')}`);
          console.log(`\n Check failed transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);
          await api.disconnect();
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(dispatchError.toString());
        }
      }
    });

}



main().catch(console.error);

