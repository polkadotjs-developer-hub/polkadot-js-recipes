import { toPlanckUnit, toDecimalAmount, addChainTokens } from '../utils/unitConversions';
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiPromise } from '@polkadot/api';

export async function fetchConvertedAmount(SENDER_AMOUNT: number, RECEIVER_ACCOUNT: string, account: KeyringPair, api: ApiPromise) {
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
