import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal } from '../utils/unitConversions';
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
const RECEIVER_ACCOUNT = '11';

// Amount to be transferred from sender account to receiver account
const SENDER_AMOUNT = 10000;

async function main() {

  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
  console.log(`\n######################################## Transaction initiating ############################################`);

  try {

    // fetch the balance of the sender account before the transfer
    const account = await fetchAccountInfo(SENDER_MNEMONIC, api);
    let { data } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${toDecimal(data.free, api)}`);

    //API to calculate transaction fees from sender account to receiver account
    await calculateTransactionFees(SENDER_AMOUNT, RECEIVER_ACCOUNT, account, api);

  } catch (error: any) {
    console.log(`\n######################################## Transaction failed ################################################`);
    console.log(`\n Transaction failed with ${error}`);

    console.log(`\n######################################## Stack trace #######################################################`);
    console.error(error.stack);

  }
  //disconnect from the chain
  api.disconnect();
}



main().catch(console.error).finally(() => process.exit());


