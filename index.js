const dotenv = require('dotenv');
const sellRequestScene = require('./scenes/sellRequestScene');
const { Telegraf, Scenes, Markup, session } = require('telegraf');


dotenv.config()
const bot = new Telegraf(process.env.BOT_TOKEN);

const stage = new Scenes.Stage([sellRequestScene]);
bot.use(session());
bot.use(stage.middleware())

bot.hears('Разместить заявку', (ctx) => ctx.scene.enter('sellRequestScene'));

bot.start(async (ctx) => {
    try {
        await ctx.reply('Разместить заявку', Markup.keyboard(
            [
                ['Разместить заявку'],
            ]
        ).oneTime().resize());
    } catch (error) {
        console.log(error)
    }
    
})


bot.launch();



