const options = {
    sellRequestOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'USDT', callback_data: 'USDT'}, {text: 'BTC', callback_data: 'BTC'}, {text: 'ETH', callback_data: 'ETH'}],
                [{text: 'RUB', callback_data: 'RUB'}, {text: 'USD', callback_data: 'USD'}, {text: 'EUR', callback_data: 'EUR'}],
                [{text: 'Waves', callback_data: 'Waves'}]
            ],

        })
    }
};

export default options;