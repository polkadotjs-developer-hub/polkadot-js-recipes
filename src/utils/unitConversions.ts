import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN , formatBalance} from '@polkadot/util';

// convert planck unit to decimal with token name(WND,DOT,KSM) e.g. / 1000000000000 to 1.0000 WND 
function toDecimal(balance: string | number | number[] | BN | Uint8Array | Buffer, api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString()) + " " + api.registry.chainTokens[0];
}

// convert planck unit to decimal e.g. 1000000000000 to 1.0000
function toDecimalAmount(balance: string | number | number[] | BN | Uint8Array | Buffer, api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString());
}

// convert decimal to planck unit e.g. 1.0000  to 1000000000000
function toPlanckUnit(balance:number , api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const convertedValue = BigInt(balance * (10 ** decimals));
    return convertedValue;
}

// convert decimal to planck unit with token name(WND,DOT,KSM)  e.g. 1.0000  to 1000000000000 WND
function toPlanckUnitAmount(balance:number , api: ApiPromise) {
    const decimals = api.registry.chainDecimals[0];
    const convertedValue = BigInt(balance * (10 ** decimals));
    return convertedValue.toString() + " " + api.registry.chainTokens[0];
}

// add chain tokens to balance number
function addChainTokens(balance:number , api: ApiPromise) {
    return balance.toString() + " " + api.registry.chainTokens[0];
}

export  { toDecimal, toPlanckUnit, toDecimalAmount , toPlanckUnitAmount, addChainTokens};