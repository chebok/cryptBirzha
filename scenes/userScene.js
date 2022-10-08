import { Markup, Composer, Scenes } from 'telegraf';
import { User } from '../models/models.js';

const startStep = new Composer();

startStep.on('text', async (ctx) => {
    const users = await User.findAll({});
    const usersWithButton = users.map((user) => [Markup.button.callback(`Пользователь ${user.username}. Статус авторизации ${user.authorized}`, `${user.id}`)])
    await ctx.replyWithHTML('Выбери пользователя для редактирования', Markup.inlineKeyboard(usersWithButton));
    return ctx.wizard.next();
});

const editing = new Composer();

editing.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
    const id = ctx.update.callback_query.data;
    ctx.wizard.state.id = id;
    await ctx.replyWithHTML(`Выберите операцию`, Markup.keyboard(
        [
            [Markup.button.callback('авторизовать', 'авторизовать'), Markup.button.callback('разавторизовать', 'разавторизовать'), Markup.button.callback('выйти', 'выйти')]
        ]
    ).oneTime().resize());
    return ctx.wizard.next();
});

const finalStep = new Composer();

finalStep.on('text', async (ctx) => {
    const id = Number(ctx.wizard.state.id);
    if (ctx.message.text === 'авторизовать') {
        await User.update({ authorized: true }, { where: { id } });
        await ctx.replyWithHTML(`Теперь пользователь авторизован 👌`);
    } if (ctx.message.text === 'разавторизовать') {
        await User.update({ authorized: false }, { where: { id } });
        await ctx.replyWithHTML(`Теперь пользователь разавторизован`);
    }
    return ctx.scene.leave();
})

const userScene = new Scenes.WizardScene('userScene', startStep, editing, finalStep);

export default userScene;