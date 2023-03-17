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
    const keyring = new Keyring({ type: 'sr25519' });;

    //TODO:part 1
    // 1. Generate a mnemonic  
    // Create mnemonic string for your own account using BIP39
    const MNEMONIC = mnemonicGenerate()
    console.log(`mnemonicGenerate: ${MNEMONIC}`)

    // Validate the mnemonic string that was generated, returns a boolean
    const isValidMnemonic = mnemonicValidate(MNEMONIC)
    console.log(`isValidMnemonic: ${isValidMnemonic}`)


    //TODO:part 2
    // 2. Create an account  
    // Add account with keypair from the generated mnemonic
    const newAccount = await keyring.addFromUri(`${MNEMONIC}`+ `///pass`, { name: 'learn-polkadot' })

    console.log(`newAccount: ${newAccount.toJson}`)
    // Show the pair has been added to our keyring
    console.log(keyring.pairs.length, ' available keypair(s)')

    //print public key and private key
    console.log(`public key: ${newAccount.publicKey}`)

}

main().catch((err) => {
    console.error(err)
}).finally(() => process.exit());
