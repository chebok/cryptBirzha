import { Markup, Composer, Scenes } from 'telegraf';
import { User, SellRequest, BuyRequest } from '../models/models.js';

const startStep = new Composer();

startStep.on('text', async (ctx) => {
    ctx.wizard.state.userData = await User.findOne({where: {username: ctx.message.chat.username}, include: [SellRequest, BuyRequest] });
    await ctx.replyWithHTML('Какие ордеры посмотреть', Markup.inlineKeyboard(
        [
            [Markup.button.callback('продажа', 'продажа'), Markup.button.callback('покупка', 'покупка')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
});

const viewRequests = new Composer();

viewRequests.action('продажа', async (ctx) => {
    await ctx.answerCbQuery();
    const userData = ctx.wizard.state.userData;
    if (userData.sell_requests.length === 0) {
        await ctx.replyWithHTML('Заявок нет', Markup.keyboard(
            [
                [Markup.button.callback('Возврат на начало', 'return')]
            ]
        ).oneTime().resize());
        return ctx.scene.leave();
    }
    const reqsWithButton = userData.sell_requests.map((req) => [Markup.button.callback(`${req.count} ${req.sellCurrency} продаются за ${req.buyCurrency} по курсу ${req.price}`, `sell ${req.id}`)]);
    await ctx.replyWithHTML('Выбери заявку которую хочешь редактировать', Markup.inlineKeyboard(reqsWithButton));
    
    return ctx.wizard.next();
});

viewRequests.action('покупка', async (ctx) => {
    await ctx.answerCbQuery();
    const userData = ctx.wizard.state.userData;
    if (userData.buy_requests.length === 0) {
        await ctx.replyWithHTML('Заявка нет', Markup.keyboard(
            [
                [Markup.button.callback('Возврат на начало', 'return')]
            ]
        ).oneTime().resize());
        return ctx.scene.leave();
    }
    const reqsWithButton = userData.buy_requests.map((req) => {
        console.log(req);
        // const selReq = await SellRequest.findOne({where: {id: req.sell_request_id}});
        // console.log(selReq);
        const result = [Markup.button.callback(`Покупка ${req.count} ${req.id}`, `buy ${req.id}`)];
        return result;
    });
    console.log(reqsWithButton);
    await ctx.replyWithHTML('Выбери заявку которую хочешь редактировать', Markup.inlineKeyboard(reqsWithButton));
    
    return ctx.wizard.next();
});

const editing = new Composer();

editing.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
    const [type, id] = ctx.update.callback_query.data.split(' ');
    ctx.wizard.state.req = { type, id };
    await ctx.replyWithHTML(`Выберите операцию`, Markup.keyboard(
        [
            [Markup.button.callback('delete', 'delete'), Markup.button.callback('отмена', 'отмена'), Markup.button.callback('выйти', 'выйти')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
});

const finalStep = new Composer();

finalStep.on('text', async (ctx) => {
    if (ctx.message.text === 'delete') {
        const type = ctx.wizard.state.req.type;
        const id = Number(ctx.wizard.state.req.id);
        if (type === 'sell') {
            await SellRequest.update({ is_open: false }, { where: { id } });
        }
        if (type === 'buy') {
            await BuyRequest.update({ is_open: false }, { where: { id } });
        }
        await ctx.replyWithHTML('Заявка успешно удалена');
    } if (ctx.message.text === 'отмена') {
        await ctx.replyWithHTML('Заявка отменена', Markup.keyboard(
            [
                [Markup.button.callback('Возврат на начало', 'return')]
            ]
        ).oneTime().resize());
        return ctx.wizard.selectStep(ctx.wizard.cursor - 3);
    }
    return ctx.scene.leave();
})

const personalScene = new Scenes.WizardScene('personalScene', startStep, viewRequests, editing, finalStep);

export default personalScene;