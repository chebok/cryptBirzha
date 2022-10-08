import { Markup, Composer, Scenes } from 'telegraf';
import { SellRequest } from '../models/models.js';
import getMarketRate from '../src/getMarketRate.js';

const startStep = new Composer();

startStep.on('text', async (ctx) => {
    ctx.wizard.state.data = {};
    ctx.wizard.state.data.userName = ctx.message.from.username;
    await ctx.replyWithHTML('Какую валюту вы хотите продать\n Например USDT', Markup.keyboard(
        [
            [Markup.button.callback('USDT', 'USDT'), Markup.button.callback('BTC', 'BTC'), , Markup.button.callback('ETH', 'ETH')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const sellStep = new Composer();

sellStep.on('text', async (ctx) => {
    ctx.wizard.state.data.sellCurrency = ctx.message.text;
    await ctx.replyWithHTML('Какое количество вы хотите продать\n Например 1000');
    return ctx.wizard.next();
})

const buyStep = new Composer();

buyStep.on('text', async (ctx) => {
    ctx.wizard.state.data.count = ctx.message.text;
    await ctx.replyWithHTML('Какую валюты вы хотите получить\n Например BTC', Markup.keyboard(
        [
            [Markup.button.callback('USD 💵', 'USD'), Markup.button.callback('EUR 💶', 'EUR'), Markup.button.callback('RUB ', 'RUB')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const priceStep = new Composer();

priceStep.on('text', async (ctx) => {
    ctx.wizard.state.data.buyCurrency = ctx.message.text;
    await ctx.replyWithHTML('По какому курсу вы хотите продать\n Например 1', Markup.inlineKeyboard(
        [
            [Markup.button.callback('По рынку', 'market')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const confirmStep = new Composer();

confirmStep.action('market', async (ctx) => {
    await ctx.answerCbQuery()
    const reqData = ctx.wizard.state.data;
    ctx.wizard.state.data.price = await getMarketRate(reqData.sellCurrency, reqData.buyCurrency).catch(e => console.log(e));

    await ctx.replyWithHTML(`Вы хотите продать ${reqData.count} ${reqData.sellCurrency}. Получить за них ${reqData.buyCurrency} по курсу ${reqData.price}.\nОформляем заявку?`, Markup.keyboard(
        [
            [Markup.button.callback('Оформить', 'Оформить'), Markup.button.callback('Изменить', 'Изменить')],
            [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

confirmStep.on('text', async (ctx) => {
    ctx.wizard.state.data.price = ctx.message.text;

    const reqData = ctx.wizard.state.data;
    await ctx.replyWithHTML(`Вы хотите продать ${reqData.count} ${reqData.sellCurrency}. Получить за них ${reqData.buyCurrency} по курсу ${reqData.price}.\nОформляем заявку?`, Markup.keyboard(
        [
            [Markup.button.callback('Оформить', 'Оформить'), Markup.button.callback('Изменить', 'Изменить')],
            [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

const finalStep = new Composer();

finalStep.on('text', async (ctx) => {
    if (ctx.message.text === 'Оформить') {
        const userId = ctx.session.state.id;
        const {sellCurrency, count, buyCurrency, price} = ctx.wizard.state.data;
        await SellRequest.create({ sellCurrency, count, buyCurrency, price, user_id: userId });
        await ctx.replyWithHTML('Заявка успешно оформлена');
    } if (ctx.message.text === 'Изменить') {
        await ctx.replyWithHTML('Заявка отменена', Markup.keyboard(
            [
                [Markup.button.callback('Возврат на начало', 'return')]
            ]
        ).oneTime().resize());
        return ctx.wizard.selectStep(ctx.wizard.cursor - 5);
    }
    return ctx.scene.leave();
})

const sellRequestScene = new Scenes.WizardScene('sellRequestScene', startStep, sellStep, buyStep, priceStep, confirmStep, finalStep);

export default sellRequestScene;