import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import * as dotenv from 'dotenv'
dotenv.config()

async function main () {

  const wsProvider = new WsProvider(process.env.WS_URL);

  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

  // Create a new instance of the keyring with the default sr25519 type
  const keyring = new Keyring({ type: 'sr25519' });;

  /**
   * 1. Generate a mnemonic. The mnemonic is a string of 12 words that can be used to generate a private key.
   * 
   */

  // Create mnemonic string for your own account using BIP39
  const MNEMONIC = mnemonicGenerate()
  console.log('\n\x1b[36m%s\x1b[0m', ` Save the Mnenomic generated : `);  //cyan
  console.log(` ${MNEMONIC}`)


  /**
   * 2. Create an account and add account with keypair from the generated mnemonic
   * 
   */

  // API to create an account from a mnemonic
  const newAccount = await keyring.addFromUri(`${MNEMONIC}`);

  // Display the metadata name & Substrate generic ss58Format encoded address
  console.log(`\n Address:  ${newAccount.address}`)
  console.log(`\n Public Key:  ${newAccount.publicKey}`)
}

main().catch((err) => {
  console.error(err)
}).finally(() => process.exit());
