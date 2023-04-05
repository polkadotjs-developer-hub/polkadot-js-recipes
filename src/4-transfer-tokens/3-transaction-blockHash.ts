import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal, toDecimalAmount } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * ############################ TODO: add your sender account address below #############################
 */
const SENDER_ACCOUNT = '5GEwX4bq8uzehVgdTKfmPrXPU61XoUdqfCZmWxs1tajKz9K8';

/**
 * ############################ TODO: add your sender mnemonic below ############################
 */
const SENDER_MNEMONIC = 'cause trip unique fossil hello supreme release know design marriage never filter';

/**
 * ############################ TODO: add your receiver account address below ############################
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
  console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ` + toDecimal(data.free, api));

  const requestedAmount = 0.001;
  console.log(`\n Requested amount: ${requestedAmount}`);


  /**
   * 2. calculate transaction fees for a particular transaction amount while transferring tokens from sender account to receiver account and convert it to decimal format
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
   * 3. Transfer tokens from the sender account to the receiver account and print the transaction hash
   * 
   **/

  await api.tx.balances
    .transfer(RECEIVER_ACCOUNT, convertedAmount)
    .signAndSend(senderAccount, ({ status, txHash }) => {

      if (status.isInBlock) {
        console.log(`\n\n######################################## Transaction status ############################################`);
        console.log(`\n Check transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);
        console.log(`\n\n######################################## Transaction pending ###########################################`);
        console.log(`\n Transaction included at blockHash : ${status.asInBlock}`);
        console.log(`\n Check block status for pending transaction on the Subscan explorer : https://westend.subscan.io/block/${status.asInBlock}`);

      } else if (status.isFinalized) {
        console.log(`\n\n######################################## Transaction finalized ##########################################`);
        console.log(`\n Transaction finalized at blockHash : ${status.asFinalized}`);
        console.log(`\n Check block status for finalized transaction on the Subscan explorer : https://westend.subscan.io/block/${status.asFinalized}`);
        console.log(`\n\n######################################## Transaction successful ########################################`);

      }
    });


  //disconnect from the chain
  api.disconnect();
}



main().catch(console.error);

