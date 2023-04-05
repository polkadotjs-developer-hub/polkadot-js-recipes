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
const RECEIVER_ACCOUNT = '5GW83GQ53B3UGAMCyoFeFTJV8GKwU6bDjF3iRksdxtSt8QNU';

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
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${toDecimal(data.free, api)}`);


    /**
     * 2. calculate transaction fees for a particular transaction amount while transferring tokens from sender account to receiver account and convert it to decimal format
     * 
     **/

    // convert the amount to planck unit
    const AMOUNT = toPlanckUnit(0.01, api);

    //API to calculate transaction fees from sender account to receiver account
    const info = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, AMOUNT)
        .paymentInfo(account);

    // Convert the transaction fees to decimal format
    let transactionFees = toDecimal(info.partialFee, api);
    console.log(`\n Transaction fees: ${transactionFees}`);


    //disconnect from the chain
    api.disconnect();
}



main().catch(console.error);

