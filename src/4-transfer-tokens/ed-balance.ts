// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Balance } from '@polkadot/types/interfaces/runtime';
import toUnit from '../utils/unitConversions';
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
	const wsProvider = new WsProvider(process.env.WS_URL);
	// Create a new instance of the api
	const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
	const chainDecimals = await api.registry.chainDecimals[0];

	/**
	 * 1. Retrieve the existential deposit of the chain
	 * 	  Existential deposit is the minimum balance required to create an account
	 */
	const ED: Balance = api.consts.balances.existentialDeposit;
	const { tokenSymbol } = await api.rpc.system.properties();
	// Convert the balance to a human readable format
	const amount = toUnit(ED, chainDecimals);
	console.log(`Existential deposit  ----- ${amount} ${tokenSymbol}`);

}



main().catch(console.error);

