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
 * TODO: add your sender mnemonic below
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
    const account = keyring.addFromUri(SENDER_MNEMONIC);
    let { data } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${data.free}`);


    /**
     * 2. calculate transaction fees for a particular transfer amount and convert it to decimal format
     * 
     **/
    const requestedAmount = 0.01;
    console.log(`\n Requested amount: ${requestedAmount}`);
    const convertedAmount = toPlanckUnit(requestedAmount, api);
    const info = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, convertedAmount)
        .paymentInfo(account);

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

    //API call to transfer tokens from the sender account to the receiver account
    const txHash = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, convertedAmount)
        .signAndSend(account);

    // Redirect to the transaction hash on the Subscan explorer
    console.log(`\n Check transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);


    /**
     * 4. Retrieve the balance of the sender and receiver account after the transfer
     *  
     **/

    // balance of the sender account after the transfer
    let { data: senderBalance } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Sender Account ${SENDER_ACCOUNT} has a balance of ` + toDecimal(senderBalance.free, api) + ` after the transfer`);
    // balance of the receiver account after the transfer
    let { data: receiverBalance } = await api.query.system.account(RECEIVER_ACCOUNT);
    console.log(`\n Receiver Account ${RECEIVER_ACCOUNT} has a balance of ` + toDecimal(receiverBalance.free, api) + ` after the transfer`);

    //disconnect from the chain
    api.disconnect();
}



main().catch(console.error);

