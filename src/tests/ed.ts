// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Balance } from '@polkadot/types/interfaces/runtime';
import * as dotenv from 'dotenv'
dotenv.config()

async function main() {
	// Create connection to websocket
	const wsProvider = new WsProvider(process.env.WS_URL);
	// Create a new instance of the api
	const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });

	console.log(
		`Connected to chain : ${(await api.rpc.system.chain()).toHuman()}`
	);

	// reading a constant
	const ED: Balance = api.consts.balances.existentialDeposit;
	console.log(`ED Balance ${ED.toHuman()}`);
}

main().catch(console.error);
