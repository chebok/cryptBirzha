const { Markup, Composer, Scenes } = require('telegraf')

const startStep = new Composer();

startStep.on('text', async (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userName = ctx.message.from.username;
    await ctx.replyWithHTML('Какую валютe вы хотите продать\n Например USDT', Markup.keyboard(
        [
            [Markup.button.callback('USDT', 'USDT'), Markup.button.callback('EUR', 'EUR')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const titleStep = new Composer();

titleStep.on('text', async (ctx) => {
    ctx.wizard.state.data.sellCurrency = ctx.message.text;
    await ctx.replyWithHTML('Какое количество вы хотите продать\n Например 1000');
    return ctx.wizard.next();
})

const buyStep = new Composer();

buyStep.on('text', async (ctx) => {
    ctx.wizard.state.data.count = ctx.message.text;
    await ctx.replyWithHTML('Какую валюты вы хотите получить\n Например BTC', Markup.keyboard(
        [
            [Markup.button.callback('BTC', 'BTC'), Markup.button.callback('ETH', 'ETH')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const priceStep = new Composer();

priceStep.on('text', async (ctx) => {
    ctx.wizard.state.data.buyCurrency = ctx.message.text;
    await ctx.replyWithHTML('По какому курсу вы хотите продать\n Например 1');
    return ctx.wizard.next();
})

const finalStep = new Composer();

finalStep.on('text', async (ctx) => {
    ctx.wizard.state.data.price = ctx.message.text;

    reqData = ctx.wizard.state.data;
    await ctx.replyWithHTML(`Вы хотите продать ${reqData.count} ${reqData.sellCurrency}. Получить за них ${reqData.buyCurrency} по курсу${reqData.price}.\nОформляем заявку?`, Markup.keyboard(
        [
            [Markup.button.callback('yes', 'yes'), Markup.button.callback('no', 'no')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const sellRequestScene = new Scenes.WizardScene('sellRequestScene', startStep, titleStep, buyStep, priceStep, finalStep);

module.exports = sellRequestScene;