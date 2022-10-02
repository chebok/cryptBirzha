import { Markup, Composer, Scenes } from 'telegraf';
import { SellRequest, BuyRequest } from '../models/models.js';

const startStep = new Composer();

startStep.on('text', async (ctx) => {
    const reqs = await SellRequest.findAll({});
    const reqsWithButton = reqs.map((req) => [Markup.button.callback(`${req.count} ${req.sellCurrency} продаются за ${req.buyCurrency} по курсу ${req.price}. Статус ${req.is_open}`, `${req.id}`)])
    await ctx.replyWithHTML('Выбери заявку в которой хочешь поучаствовать', Markup.inlineKeyboard(reqsWithButton));
    return ctx.wizard.next();
});

const insideRequest = new Composer();

insideRequest.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.wizard.state.data = {};
    const id = Number(ctx.update.callback_query.data);
    const req = await SellRequest.findOne({where: {id}});
    ctx.wizard.state.data.sell = req;
    await ctx.replyWithHTML(`Напишите в каком количестве вы хотите купить ${req.count} ${req.sellCurrency}`, Markup.inlineKeyboard(
        [
            [Markup.button.callback('Весь объём', 'full')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
});

const buying = new Composer();

buying.action('full', async (ctx) => {
    await ctx.answerCbQuery()
    ctx.wizard.state.data.count = ctx.wizard.state.data.sell.count;

    const reqData = ctx.wizard.state.data.sell;
    await ctx.replyWithHTML(`Вы хотите купить ${reqData.count} ${reqData.sellCurrency}. За ваши ${reqData.buyCurrency} По курсу ${reqData.price} в количестве.\nОформляем заявку?`, Markup.keyboard(
        [
            [Markup.button.callback('Оформить', 'Оформить'), Markup.button.callback('Изменить', 'Изменить')],
            [Markup.button.callback('Выйти из оформления', 'Выйти из оформления')],
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
})

buying.on('text', async (ctx) => {
    ctx.wizard.state.data.count = ctx.message.text;

    const reqData = ctx.wizard.state.data.sell;
    await ctx.replyWithHTML(`Вы хотите продать ${ctx.wizard.state.data.count} ${reqData.sellCurrency}. Получить за них ${reqData.buyCurrency} по курсу ${reqData.price}.\nОформляем заявку?`, Markup.keyboard(
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
        const count = Number(ctx.wizard.state.data.count);
        await BuyRequest.create({ count, user_id: userId, sell_request_id: ctx.wizard.state.data.sell.id});
        await ctx.replyWithHTML('Заявка успешно оформлена');
    } if (ctx.message.text === 'Изменить') {
        await ctx.replyWithHTML('Заявка отменена', Markup.keyboard(
            [
                [Markup.button.callback('Возврат на начало', 'return')]
            ]
        ).oneTime().resize());
        return ctx.wizard.selectStep(ctx.wizard.cursor - 3);
    }
    return ctx.scene.leave();
})

const viewRequestScene = new Scenes.WizardScene('viewRequestScene', startStep, insideRequest, buying, finalStep);

export default viewRequestScene;