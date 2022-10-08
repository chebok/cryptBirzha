import axios from 'axios';

const getMarketRate = async (curr1, curr2) => {
  const res = await axios.get(`https://garantex.io/api/v2/trades?market=${curr1}${curr2}`);
  const result = res.data[0];
  return Number(result.price);
};
export default getMarketRate;

console.log(await getMarketRate('eth', 'usd'));
// console.log(await getMarketRate('btc', 'usd'));
// console.log(await getMarketRate('usdt', 'usd'));
// console.log(await getMarketRate('eth', 'eur'));