import '@polkadot/api-augment';
import '@polkadot/types-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Balance } from '@polkadot/types/interfaces/runtime';
import { toUnit } from '../utils/unitConversions';
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
	const wsProvider = new WsProvider(process.env.WS_URL);

	// Create a new instance of the api
	const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

	/**
	 * 1. Retrieve the existential deposit of the chain
	 * 	  Existential deposit is the minimum balance required to create an account
	 * 
	 */

	//API to retrieve the existential deposit
	const ED: Balance = api.consts.balances.existentialDeposit;

	// Convert the balance to a human readable format
	const transferAmount = toUnit(ED, api);
	console.log(`\n Existential deposit  ----- ${transferAmount}`);

	//disconnect from the chain
	api.disconnect();
}



main().catch(console.error);

