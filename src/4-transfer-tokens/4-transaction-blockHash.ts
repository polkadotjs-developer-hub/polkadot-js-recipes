import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { fetchBalances, fetchAccountInfo } from '../utils/transactionUtils';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
import { fetchConvertedAmount } from './fetchConvertedAmount';
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
const SENDER_AMOUNT = 0.001;

async function main() {

  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

  console.log(`\n######################################## Balance before transfer ############################################`);

  await fetchBalances(api, SENDER_ACCOUNT, RECEIVER_ACCOUNT);

  console.log(`\n######################################## Transaction initiating ############################################`);

  /**
   * 1. Retrieve the initial balance of the account.
   * 
   */

  const account = await fetchAccountInfo(SENDER_ACCOUNT, SENDER_MNEMONIC, api);

  /**
   * 2. calculate transaction fees for a particular transaction amount while transferring tokens from sender account 
   *    to receiver account and convert it to decimal format
   * 
   **/
  const planckAmount = await fetchConvertedAmount(SENDER_AMOUNT, RECEIVER_ACCOUNT, account, api);


  /**
   * 3. Transfer tokens from the sender account to the receiver account and print the transaction hash
   * 
   **/

  await signedTransfer(api, planckAmount, account);

}



main().catch(console.error);

async function disconnect(api: ApiPromise) {
  await api.disconnect();
  console.log('\n Disconnected from the API');
}

async function signedTransfer(api: ApiPromise, convertedAmount: bigint, account: KeyringPair) {

  //API call to transfer tokens from the sender account to the receiver account
  const txHash = await api.tx.balances
    .transfer(RECEIVER_ACCOUNT, convertedAmount)
    .signAndSend(account, async ({ status, txHash }) => {
      if (status.isInBlock) {
        console.log(`\n\n######################################## Transaction pending ###########################################`);
        console.log(`\n Transaction included at blockHash : ${status.asInBlock}`);
        console.log(`\n Check block status for pending transaction on the Subscan explorer : https://westend.subscan.io/block/${status.asInBlock}`);

      } else if (status.isFinalized) {
        console.log(`\n\n######################################## Transaction successful and finalized ##########################################`);
        console.log(`\n Transaction finalized at blockHash : ${status.asFinalized}`);
        console.log(`\n Check block status for finalized transaction on the Subscan explorer : https://westend.subscan.io/block/${status.asFinalized}`);
        console.log(`\n######################################## Balance after transfer ############################################`);
        
        await fetchBalances(api, SENDER_ACCOUNT, RECEIVER_ACCOUNT);
        console.log(`\n Check transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);
        await disconnect(api);
      }
    });

}


