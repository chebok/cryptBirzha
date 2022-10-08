const buyCurs = ['USD', 'EUR', 'RUB'];
const selCurs = ['USDT', 'BTC', 'ETH'];


const validateSellRequest = (req) => {
  const errors = [];
  if (!selCurs.includes(req.sellCurrency)) {
    errors.push(`Выберите корректную валюту для продажи. ${req.sellCurrency} не существует`);
  }
  if (!buyCurs.includes(req.buyCurrency)) {
    errors.push(`Выберите корректную валюту для покупки. ${req.buyCurrency} не существует`);
  }
  if (!Number(req.count)) {
    errors.push(`Требуется числовое значение. ${req.count} не допустимо для параметра количество`);
  }
  if (!Number(req.price)) {
    errors.push(`Требуется числовое значение. ${req.count} не допустимо для параметра price`);
  }
  return errors;
};  

export default validateSellRequest;