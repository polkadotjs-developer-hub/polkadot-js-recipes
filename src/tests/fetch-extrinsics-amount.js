// needed as of 7.x series, see CHANGELOG of the api repo.
import '@polkadot/api-augment';
import '@polkadot/types-augment';

import { ApiPromise, WsProvider } from '@polkadot/api';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { BN, formatBalance } from '@polkadot/util';

const optionsPromise = yargs(hideBin(process.argv)).option('endpoint', {
	alias: 'e',
	type: 'string',
	default: 'wss://rpc.polkadot.io',
	description: 'the wss endpoint. It must allow unsafe RPCs.',
	required: true
}).argv;

async function main() {
	const options = await optionsPromise;
	const provider = new WsProvider(options.endpoint);
	const api = await ApiPromise.create({ provider });
// get the api and events at a specific block
const hasht = '0x7e621cf5b1c8488a1ef321b3a97e98a01e0065b7558ad44bbe0233cc7603f0db';
const apiAt = await api.at(hasht);
const events = await apiAt.query.system.events();
const signedBlock = await api.rpc.chain.getBlock(hasht);
const chainDecimals = await api.registry.chainDecimals[0];
const unit = await api.registry.chainTokens[0];

console.log(chainDecimals);

//TODO:explain why below is needed
// map between the extrinsics and events
signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
  events
    // filter the specific events based on the phase and then the
    // index of our extrinsic in the block
    .filter(({ phase }) =>
      phase.isApplyExtrinsic &&
      phase.asApplyExtrinsic.eq(index)
    )
    // test the events against the specific types we are looking for
    .forEach(({ event }) => {
        
        if(event.method === 'Transfer'){
          if(event.data.hasOwnProperty('amount')){
            console.log(`${section}.${method}:: ExtrinsicSuccess:: ${JSON.stringify(event.toHuman())}`);
            const defaults = formatBalance.getDefaults();
            const free = formatBalance(event.data.amount, {withUnit:unit,decimals:chainDecimals });

            const amount = event.data.amount;
            console.log(`free:::::::::: ${JSON.stringify(free)}`);

            console.log(`amount:::::::::: ${JSON.stringify(toDecimal(amount,chainDecimals))}`);
          }
        }

    });
});
}
function toDecimal(balance, decimals) {
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString())
}

main().catch(console.error);