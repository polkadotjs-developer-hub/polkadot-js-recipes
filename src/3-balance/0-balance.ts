import '@polkadot/api-augment';
import '@polkadot/types-augment';
import { toDecimal } from '../utils/unitConversions';

import { ApiPromise, WsProvider } from '@polkadot/api';
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * ###################TODO: add your account address below  ######################
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
	console.log(`\n Account ${ACCOUNT} has a balance of : `)
	
	console.log(`\n Planck amount --- ${data.free.toHuman()}`);


	/**
	 * 2. Convert the planck amount to decimal amount
	 */

	const transferAmount = toDecimal(data.free, api);
	console.log(`\n Westend amount --- ${transferAmount}`);

	//disconnect from the chain
	api.disconnect();

}


main().catch(console.error);

