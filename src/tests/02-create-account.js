import { ApiPromise, WsProvider ,Keyring} from '@polkadot/api';
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
  const keyring = new Keyring({type: 'sr25519'});;
  
  // 1. Generate a mnemonic  
  // Create mnemonic string for your own account using BIP39
  const MNEMONIC = mnemonicGenerate()
  console.log(`mnemonicGenerate: ${MNEMONIC}`)
    
  // Validate the mnemonic string that was generated, returns a boolean
  const isValidMnemonic = mnemonicValidate(MNEMONIC)
  console.log(`isValidMnemonic: ${isValidMnemonic}`)

  // 2. Create an account  
  // Add account with keypair from the generated mnemonic
  const newAccount = await keyring.addFromUri(`${MNEMONIC}`, { name: 'acala-uno-learn-polkadot-acala'})

  // Show the pair has been added to our keyring
  console.log(keyring.pairs.length, ' available keypair(s)')

  // Display the metadata name & Substrate generic ss58Format encoded address
  console.log(newAccount.meta.name, 'has address', newAccount.address, 'and derivation path', newAccount.meta.derivation)

  // 3. Persist the account data  
  // Convert the account data to JSON and format it for readability   
  const accountData = JSON.stringify(keyring.toJson(newAccount.address), null, 2);

  // Generate a filename from the account address
  const fileName = newAccount.address.substr(0, 8).toUpperCase();

  // Write the data to disk
  fs.writeFileSync(`${fileName}.json`, accountData);
  console.log(`Wrote accountData to ./${fileName}.json`);

  // 4. Sign and verify a message
  // Convert message to an Unsigned 8-byte Array
  const message = stringToU8a('this is our message in a polkadot-acala bottle')

  // Sign the message with both accounts
  const signature = newAccount.sign(message)

  // Verify the message was signed
  const isValid = newAccount.verify(message, signature, newAccount.publicKey)

 console.log(`The signature ${u8aToHex(signature)}, is ${isValid ? '' : 'in'}valid for message "${u8aToString(message)}"`)

}

main().catch((err) => {
  console.error(err)
}).finally(() => process.exit());
