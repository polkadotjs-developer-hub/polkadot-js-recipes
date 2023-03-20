// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toUnit } from '../utils/unitConversions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * TODO: add your account address here
 */
const ACCOUNT = '5D1tdPadpW4U22i1EmbyFSeTJQpYBL8VVTbU18Q3AL8jw8QE';

async function main() {

	const wsProvider = new WsProvider(process.env.WS_URL);
	// Create a new instance of the api
	const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

	/**
	 * 1. Retrieve the initial balance of the account.
	 */
	let { data } = await api.query.system.account(ACCOUNT);
	console.log(`\n Account ${ACCOUNT} has a balance of ${data.free}`);


	/**
	 * 2. Convert the balance to a human readable format
	 */

	// Convert the balance to a human readable format
	const transferAmount = toUnit(data.free, api);
	console.log(`\n Westend balance --------  ${transferAmount}`);
}


main().catch(console.error);

