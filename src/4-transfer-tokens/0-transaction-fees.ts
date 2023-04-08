import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toPlanckUnit, toDecimal, addChainTokens, toDecimalAmount } from '../utils/unitConversions';
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
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';

// Amount to be transferred from sender account to receiver account
const SENDER_AMOUNT = 0.001;

async function main() {

    const wsProvider = new WsProvider(process.env.WS_URL);
    // Create a new instance of the api
    const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

    /**
    * 1. Retrieve the initial balance of the account and convert it to decimal format
    */
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromUri(SENDER_MNEMONIC);
    let { data } = await api.query.system.account(SENDER_ACCOUNT);

    // planck unit is generated by the chain, so we need to convert it to decimal format
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${toDecimal(data.free, api)}`);


    /**
     * 2. calculate transaction fees for a particular transaction amount while transferring tokens from sender account to receiver account and convert it to decimal format
     * 
     **/

    // convert the sender amount to planck unit
    const AMOUNT = toPlanckUnit(SENDER_AMOUNT, api);
    console.log(`\n Requested amount: ${addChainTokens(SENDER_AMOUNT, api)}`);
    
    //API to calculate transaction fees from sender account to receiver account
    const info = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, AMOUNT)
        .paymentInfo(account);

    // Convert the transaction fees generated in planck unit to decimal format
    let transactionFees = toDecimalAmount(info.partialFee, api);
    console.log(`\n Transaction fees: ${addChainTokens(transactionFees,api)}`);

    // Calculate the total amount to be transferred
    let totalAmount = SENDER_AMOUNT + transactionFees;
    console.log(`\n Total amount = Requested amount(${addChainTokens(SENDER_AMOUNT, api)}) + Transaction fees(${addChainTokens(transactionFees,api)}) : ${addChainTokens(totalAmount,api)}`);


    //disconnect from the chain
    api.disconnect();
}



main().catch(console.error);

