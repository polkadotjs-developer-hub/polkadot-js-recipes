const { ApiPromise, Keyring } = require('@polkadot/api');
const { HttpProvider } = require('@polkadot/rpc-provider');
require("dotenv").config();

const main = async () => {
  const httpProvider = new HttpProvider(process.env.WESTEND_RPC_ACALA_UNO);
  const api = await ApiPromise.create({ provider: httpProvider });
  const keyring = new Keyring({type: 'sr25519'});
  
  const AMOUNT = 100000000000; // 1/10 of a WND
  const RECIPIENT_A_ADDRESS = process.env.EDUCATION_PROXY_A_ADDRESS;
  const RECIPIENT_B_ADDRESS = process.env.EDUCATION_PROXY_B_ADDRESS;
  const RECIPIENT_ADDRESS = RECIPIENT_A_ADDRESS;
  //const RECIPENT_ADDRESS = RECIPIENT_B_ADDRESS;

  // Initialize account from the mnemonic
  const account = keyring.addFromUri(process.env.EDUCATION_STASH_MNEMONIC);

  // Retrieve account from the address
  const now = await api.query.timestamp.now();
  const { data: balance } = await api.query.system.account(process.env.EDUCATION_STASH_ADDRESS);
  console.log(`${account.address} has a balance of ${balance.free} at timestamp: ${now}`);

  // Transfer tokens
  const txHash = await api.tx.balances
    .transfer(RECIPIENT_ADDRESS, AMOUNT)
    .signAndSend(account);

  // Go to https://westend.subscan.io/extrinsic/<TxHash> to check your transaction
  console.log(`Transaction hash: https://westend.subscan.io/extrinsic/${txHash}`);
};

main().catch((err) => {
  console.error(err);
}).finally(() => process.exit());
