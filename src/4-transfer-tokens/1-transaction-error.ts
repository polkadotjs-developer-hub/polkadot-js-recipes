import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal, toDecimalAmount } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * TODO: add your sender account below
 */
const SENDER_ACCOUNT = '5GEwX4bq8uzehVgdTKfmPrXPU61XoUdqfCZmWxs1tajKz9K8';

/**
 * TODO: add your sender mneomonic below
 */
const SENDER_MNEMONIC = 'cause trip unique fossil hello supreme release know design marriage never filter';

/**
 * TODO: add your receiver account below
 */
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';


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
  console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${data.free}`);

  const requestedAmount = 100;
  console.log(`\n Requested amount: ${requestedAmount}`);

  /**
   * 2. calculate transaction fees for a particular transfer amount and convert it to a decimal format
   * 
   **/

  const convertedAmount = toPlanckUnit(requestedAmount, api);

  //API to calculate transaction fees
  const info = await api.tx.balances
    .transfer(RECEIVER_ACCOUNT, convertedAmount)
    .paymentInfo(senderAccount);

  // Convert the transaction fees to a human readable format
  let transactionFees = toDecimalAmount(info.partialFee, api);
  console.log(`\n Transaction fees: ${transactionFees}`);

  // Calculate the total amount to be transferred
  let totalAmount = requestedAmount + transactionFees;
  console.log(`\n Total amount = requested amount(${requestedAmount}) + transaction fees(${transactionFees}) : ${totalAmount}`);


  /**
   * 3. Handle transaction errors while transferring tokens from the sender account to the receiver account
   * 
   **/

  //API to transfer tokens from the sender account to the receiver account
  await api.tx.balances
    .transfer(RECEIVER_ACCOUNT, convertedAmount)
    .signAndSend(senderAccount, ({ dispatchError, txHash }) => {

      // in case of error, the dispatchError is set and we can display the error details
      if (dispatchError) {
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          const decoded = api.registry.findMetaError(dispatchError.asModule);
          const { docs, name, section } = decoded;
          console.log(`\n######################################## Transaction failed ################################################`);
          console.log(`\n Transaction failed with error: ${section}.${name} : ${docs.join(' ')}`);
          console.log(`\n Check failed transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);

        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          console.log(dispatchError.toString());
        }
      }
    });


  //disconnect from the chain
  api.disconnect();
}



main().catch(console.error);

