
import { BN , formatBalance} from '@polkadot/util';

function toUnit(balance: string | number | number[] | BN | Uint8Array | Buffer, decimals: string | number | number[] | BN | Uint8Array | Buffer) {
    const base = new BN(10).pow(new BN(decimals));
    const dm = new BN(balance).divmod(base);
    return parseFloat(dm.div.toString() + "." + dm.mod.toString())
}
export default toUnit;