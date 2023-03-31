const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
    // Connect to a Polkadot node
    const wsProvider = new WsProvider(process.env.WS_URL);
    const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
    // Initialize the keyring and add Alice and Bob's accounts



    // Initialize the keyring and add Alice and Bob's accounts
    const keyring = new Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice');
    const bob = keyring.addFromUri('//Bob');

    // Define the amount to send (e.g. 1 WND)
    const amount = api.createType('Balance', 1 * 10 ** 12);

    try {
        // Create and sign the transfer transaction
        const transfer = api.tx.balances.transfer(bob.address, amount);
        const signedTx = await transfer.signAsync(alice);

        // Send the transaction and wait for the result
        const txHash = await signedTx.send();
        console.log('Transaction hash:', txHash.toHex());

        // Wait for the transaction to be finalized
        const result = await api.tx.tx(txHash).wait();
        console.log('Transaction status:', result.status.type);
        
    } catch (error: any) {
        console.log('Error:', error.toString());
    }

    // Fetch the updated balances of Alice and Bob
    const aliceBalance = await api.query.system.account(alice.address);
    const bobBalance = await api.query.system.account(bob.address);

    console.log('Alice balance:', aliceBalance.data.free.toString());
    console.log('Bob balance:', bobBalance.data.free.toString());

    // Disconnect from the Westend testnet
    await api.disconnect();
}

main().catch(console.error);