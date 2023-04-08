import { ApiPromise } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { toDecimalAmount, toPlanckUnit, addChainTokens, toDecimal } from '../utils/unitConversions';
import { Keyring } from '@polkadot/api';

async function fetchConvertedAmount(SENDER_AMOUNT: number, RECEIVER_ACCOUNT: string, account: KeyringPair, api: ApiPromise) {
    console.log(`\n Requested amount: ${addChainTokens(SENDER_AMOUNT, api)}`);
    const convertedAmount = toPlanckUnit(SENDER_AMOUNT, api);

    //API to retrieve the transaction fees for a particular transaction amount
    const info = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, convertedAmount)
        .paymentInfo(account);

    // Convert the transaction fees generated in planck unit to decimal format
    let transactionFees = toDecimalAmount(info.partialFee, api);
    console.log(`\n Transaction fees: ${addChainTokens(transactionFees, api)}`);

    // Calculate the total amount to be transferred
    let totalAmount = SENDER_AMOUNT + transactionFees;
    console.log(`\n Total amount = Requested amount(${addChainTokens(SENDER_AMOUNT, api)}) + Transaction fees(${addChainTokens(transactionFees, api)}) : ${addChainTokens(totalAmount, api)}`);

    return convertedAmount;
}

async function fetchBalances(api: ApiPromise, SENDER_ACCOUNT: string, RECEIVER_ACCOUNT: string) {

    // balance of the sender account after the transfer
    let { data: senderBalance } = await api.query.system.account(SENDER_ACCOUNT);
    console.log(`\n Sender Account ${SENDER_ACCOUNT} has a balance of ` + toDecimal(senderBalance.free, api));
    
    // balance of the receiver account after the transfer
    let { data: receiverBalance } = await api.query.system.account(RECEIVER_ACCOUNT);
    console.log(`\n Receiver Account ${RECEIVER_ACCOUNT} has a balance of ` + toDecimal(receiverBalance.free, api));

}

async function signedTransfer(api: ApiPromise, convertedAmount: bigint, account: KeyringPair, RECEIVER_ACCOUNT: string) {

    //API call to transfer tokens from the sender account to the receiver account
    const txHash = await api.tx.balances
        .transfer(RECEIVER_ACCOUNT, convertedAmount)
        .signAndSend(account);

    // Redirect to the transaction hash on the Subscan explorer
    console.log(`\n Check transaction status on the Subscan explorer : https://westend.subscan.io/extrinsic/${txHash}`);

}

async function fetchAccountInfo(SENDER_ACCOUNT: string, SENDER_MNEMONIC: string, api: ApiPromise) {
    // instantiate the sender account from the mnemonic
    const keyring = new Keyring({ type: 'sr25519' });
    const account = keyring.addFromUri(SENDER_MNEMONIC);
    return account;
}

export {fetchConvertedAmount, fetchBalances, signedTransfer, fetchAccountInfo};