import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
const {
  mnemonicGenerate,
  mnemonicValidate,
} = require('@polkadot/util-crypto');
const {
  stringToU8a,
  u8aToString,
  u8aToHex
} = require('@polkadot/util');
const fs = require('fs');
require("dotenv").config();

const main = async () => {
  const wsProvider = new WsProvider(process.env.WS_URL);

  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

  // Create a new instance of the keyring with the default sr25519 type
  const keyring = new Keyring({ type: 'sr25519' });;

  /* 
    1. Generate a mnemonic 
    The mnemonic is a string of 12 words that can be used to generate a private key.
   */

  // Create mnemonic string for your own account using BIP39
  const MNEMONIC = mnemonicGenerate()
  console.log(`\n mnemonicGenerate: ${MNEMONIC}`)


  /*
    2. Create an account  
    Add account with keypair from the generated mnemonic
   */
  const newAccount = await keyring.addFromUri(`${MNEMONIC}`, { name: 'learn-polkadot' })

  // Display the metadata name & Substrate generic ss58Format encoded address
  console.log('\n',newAccount.meta.name, 'has address', newAccount.address)

}

main().catch((err) => {
  console.error(err)
}).finally(() => process.exit());
