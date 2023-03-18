// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toBalance, toUnit, toUnitAmount} from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * TODO: add your sender account here
 */
const SENDER_ACCOUNT = '5GEwX4bq8uzehVgdTKfmPrXPU61XoUdqfCZmWxs1tajKz9K8';

/**
 * TODO: add your sender mneomonic here
 */
const SENDER_MNEMONIC = 'cause trip unique fossil hello supreme release know design marriage never filter';

/**
 * TODO: add your receiver account here
 */
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';


async function main() {

    const wsProvider = new WsProvider(process.env.WS_URL);
    // Create a new instance of the api
    const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

    /**
     * 1. Retrieve the initial balance of the account.
     */
    const keyring = new Keyring({type: 'sr25519'});
    const account = keyring.addFromUri(SENDER_MNEMONIC);
    let { data } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${data.free}`);

    const WND_AMOUNT = 0.01;
    console.log(`\n Request amount: ${WND_AMOUNT}`);
    
    /**
     * 2. calculate transaction fees
     **/
    const convertedAmount = toBalance(WND_AMOUNT,api);
    const info = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, convertedAmount)
        .paymentInfo(account);

    // Convert the transaction fees to a human readable format
    let totalTransactionAmount = toUnitAmount(info.partialFee, api);
    console.log(`\n Transaction fees: ${totalTransactionAmount}`);

    // Calculate the total amount to be transferred
    let totalAmount = WND_AMOUNT + totalTransactionAmount;
    console.log(`\n Total amount = requested amount + transaction fees : ${totalAmount}`);
   

    /**
     * 3. Transfer tokens from the sender account to the receiver account
     *      and print the transaction hash
     **/ 
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
    console.log(`\n Sender Account ${SENDER_ACCOUNT} has a balance of ` + toUnit(senderBalance.free, api) + ` after the transfer`);
    // balance of the receiver account after the transfer
    let { data: receiverBalance } = await api.query.system.account(RECEIVER_ACCOUNT);
    console.log(`\n Receiver Account ${RECEIVER_ACCOUNT} has a balance of ` + toUnit(receiverBalance.free, api) + ` after the transfer`);
}



main().catch(console.error);

