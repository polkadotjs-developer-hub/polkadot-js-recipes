import { ApiPromise, WsProvider } from '@polkadot/api';
import { toDecimal, toPlanckUnit, toDecimalAmount, toPlanckUnitAmount, addChainTokens } from './unitConversions';
import '@testing-library/jest-dom';
import * as dotenv from 'dotenv'
dotenv.config()

describe('toDecimal', () => {
  it('should return the correct decimal with token name', async () => {
    const api = await createApiInstance();
    const balance = '1000000000000'; // Replace with valid planck balance
    const decimal = toDecimal(balance, api);
    expect(decimal).toEqual('1 WND'); // Replace WND with your own chain token
  });
});

describe('toPlanckUnit', () => {
  it('should return the correct planck unit', async () => {
    const api = await createApiInstance();
    const balance = 1; // Replace with valid decimal balance
    const planck = toPlanckUnit(balance, api);
    expect(planck).toEqual(1000000000000n);
  });
});

describe('toDecimalAmount', () => {
  it('should return the correct decimal', async () => {
    const api = await createApiInstance();
    const balance = '1000000000000'; // Replace with valid planck balance
    const decimal = toDecimalAmount(balance, api);
    expect(decimal).toEqual(1);
  });
});

describe('toPlanckUnitAmount', () => {
  it('should return the correct planck unit with token name', async () => {
    const api = await createApiInstance();
    const balance = 1; // Replace with valid decimal balance
    const planckAmount = toPlanckUnitAmount(balance, api);
    expect(planckAmount).toEqual('1000000000000 WND'); // Replace WND with your own chain token
  });
});

describe('addChainTokens', () => {
  it('should return the balance with chain token', async () => {
    const api = await createApiInstance();
    const balance = 10; // Replace with valid balance number
    const balanceWithToken = addChainTokens(balance, api);
    expect(balanceWithToken).toEqual('10 WND'); // Replace WND with your own chain token
  });
});


//create API instance
async function createApiInstance() {
  const wsProvider = new WsProvider(process.env.WS_URL);
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider, noInitWarn: true });
  return api;
}