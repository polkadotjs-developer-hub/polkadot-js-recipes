// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toBalance } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';
import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * TODO: add your account address here
 */
const SENDER_ACCOUNT = '5GEwX4bq8uzehVgdTKfmPrXPU61XoUdqfCZmWxs1tajKz9K8';
const SENDER_MNEMONIC = 'cause trip unique fossil hello supreme release know design marriage never filter';
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

    const AMOUNT = toBalance(0.01, 12);

    // Transfer tokens
    const txHash = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, AMOUNT)
        .signAndSend(account);

    console.log(`\n Transaction hash: https://westend.subscan.io/extrinsic/${txHash}`);

    // balance of the sender account after the transfer
    let { data: dataAfterTransferSender } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Account ${SENDER_ACCOUNT} has a balance of ${dataAfterTransferSender.free}`)
    // balance of the receiver account after the transfer
    let { data: dataAfterTransferReceiver } = await api.query.system.account(RECEIVER_ACCOUNT);
    console.log(`\n Account ${RECEIVER_ACCOUNT} has a balance of ${dataAfterTransferReceiver.free}`)
}



main().catch(console.error);

