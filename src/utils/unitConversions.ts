import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN , formatBalance} from '@polkadot/util';

// This function converts a balance to a unit
function toUnit(balance: string | number | number[] | BN | Uint8Array | Buffer, api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString()) + " " + api.registry.chainTokens[0];
}

function toUnitAmount(balance: string | number | number[] | BN | Uint8Array | Buffer, api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString());
}

// convert unit to balance
function toBalance(amount:number , api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    return amount * Math.pow(10, decimals);
}

export  { toUnit, toBalance,toUnitAmount };