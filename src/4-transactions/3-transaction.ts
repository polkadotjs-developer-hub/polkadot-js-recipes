import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { fetchConvertedAmount, fetchBalances, signedTransfer, fetchAccountInfo } from '../utils/transactionUtils';
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
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';

// Amount to be transferred from sender account to receiver account
const SENDER_AMOUNT = 0.001;

async function main() {

    const wsProvider = new WsProvider(process.env.WS_URL);
    // Create a new instance of the api
    const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

    console.log(`\n######################################## Balance before transfer ############################################`);

    // fetch the balance of the sender and receiver account before the transfer
    await fetchBalances(api, SENDER_ACCOUNT, RECEIVER_ACCOUNT);

    console.log(`\n######################################## Transaction initiating ############################################`);

    /**
     * 1. Retrieve the initial balance of the account.
     * 
     */

    const account = await fetchAccountInfo(SENDER_ACCOUNT, SENDER_MNEMONIC, api);

    /**
     * 2. calculate transaction fees for a particular transaction amount while 
     *   transferring tokens from sender account to receiver account and convert it to decimal format
     * 
     **/
    const planckAmount = await fetchConvertedAmount(SENDER_AMOUNT, RECEIVER_ACCOUNT, account, api);


    /**
     * 3. Transfer tokens from the sender account to the receiver account and print the transaction hash
     * 
     **/

    await signedTransfer(api, planckAmount, account, RECEIVER_ACCOUNT);


    /**
     * 4. Retrieve the balance of the sender and receiver account after the transfer
     *  
     **/
    console.log(`\n######################################## Balance after transfer ############################################`);

    // fetch the balance of the sender and receiver account after the transfer
    await fetchBalances(api, SENDER_ACCOUNT, RECEIVER_ACCOUNT);

    //disconnect from the chain
    api.disconnect();
}



main().catch(console.error);