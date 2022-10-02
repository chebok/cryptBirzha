import dotenv from 'dotenv';
import sellRequestScene from './scenes/sellRequestScene.js';
import viewRequestScene from './scenes/viewRequestScene.js';
import personalScene from './scenes/personalScene.js';
import { Telegraf, Scenes, Markup, session } from 'telegraf';
import sequelize from './db.js';
import { User, SellRequest, BuyRequest } from './models/models.js';


dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([sellRequestScene, viewRequestScene, personalScene]);
bot.use(session());
bot.use(stage.middleware())


bot.hears('Разместить заявку', (ctx) => ctx.scene.enter('sellRequestScene'));

bot.hears('Смотреть все заявки', (ctx) => ctx.scene.enter('viewRequestScene'));

bot.hears('Смотреть свои ордеры', (ctx) => ctx.scene.enter('personalScene'));

bot.start(async (ctx) => {

    try {
        await sequelize.authenticate();
        await sequelize.sync()
    } catch (error) {
        console.log(error);
    }

    try {
        const chatId = ctx.message.chat.id;
        const username = ctx.message.chat.username;
        let user;
        user = await User.findOne({where: {username}, include: [SellRequest, BuyRequest] });
                if (!user) {
                    user =  await User.create({ chat_id: chatId, username});
                }
        ctx.session.state = user;
        await ctx.reply(`Добро пожаловать на биржу ${user.username}`, Markup.keyboard(
            [
                ['Разместить заявку'], ['Смотреть все заявки'], ['Смотреть свои ордеры']
            ]
        ).oneTime().resize());
    } catch (error) {
        console.log(error)
    }
    
})


bot.launch();



