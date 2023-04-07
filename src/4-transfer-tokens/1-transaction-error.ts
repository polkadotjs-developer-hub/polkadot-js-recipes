import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
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
const RECEIVER_ACCOUNT = '11';

// Amount to be transferred from sender account to receiver account
const SENDER_AMOUNT = 10000;

async function main() {

  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
  console.log(`\n######################################## Transaction initiating ############################################`);

  /**
   * 1. Retrieve the initial balance of the account.
   * 
   */

  const keyring = new Keyring({ type: 'sr25519' });
  const senderAccount = keyring.addFromUri(SENDER_MNEMONIC);
  let { data } = await api.query.system.account(SENDER_ACCOUNT);
  console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${toDecimal(data.free, api)}`);

  /**
   * 2. calculate transaction fees for a particular transaction amount while transferring tokens from sender account to receiver account and convert it to decimal format
   * 
   **/
  // Convert the transaction amount to planck unit
  const convertedAmount = toPlanckUnit(SENDER_AMOUNT, api);
  console.log(`\n Requested amount: ${SENDER_AMOUNT} WND`);

  try {
    //API to calculate transaction fees from sender account to receiver account
    const info = await api.tx.balances
      .transfer(RECEIVER_ACCOUNT, convertedAmount)
      .paymentInfo(senderAccount);

  } catch (error) {
    console.log(`\n######################################## Transaction failed ################################################`);
    console.log(`\n Transaction failed with ${error}`);
  }
  //disconnect from the chain
  api.disconnect();
}



main().catch(console.error).finally(() => process.exit());


