import dotenv from 'dotenv';
import sellRequestScene from './scenes/sellRequestScene.js';
import { Telegraf, Scenes, Markup, session } from 'telegraf';
import sequelize from './db.js';
import User from './models/User.js';


dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([sellRequestScene]);
bot.use(session());
bot.use(stage.middleware())


bot.hears('Разместить заявку', (ctx) => ctx.scene.enter('sellRequestScene'));

bot.start(async (ctx) => {

    try {
        await sequelize.authenticate();
        await sequelize.sync()
    } catch (error) {
        console.log(error);
    }

    try {
        const chatId = ctx.message.chat.id;
        const userName = ctx.message.chat.username;
        let user;
        user = await User.findOne({chatId});
                if (!user) {
                    user =  await User.create({ chatId, userName});
                }
        ctx.session.state = user;
        await ctx.reply(`Добро пожаловать на биржу ${user.userName}`, Markup.keyboard(
            [
                ['Разместить заявку'], ['Смотреть заявки']
            ]
        ).oneTime().resize());
    } catch (error) {
        console.log(error)
    }
    
})


bot.launch();



