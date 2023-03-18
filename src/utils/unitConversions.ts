import { BN , formatBalance} from '@polkadot/util';

// This function converts a balance to a unit
function toUnit(balance: string | number | number[] | BN | Uint8Array | Buffer, decimals: string | number | number[] | BN | Uint8Array | Buffer) {
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString())
}

// convert unit to balance
function toBalance(amount:number , decimals:number) {
    return amount * Math.pow(10, decimals);
  }

  
export  { toUnit, toBalance };