const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()

// const token = 'process.env.BOT_TOKEN'

const bot = new TelegramApi(process.env.BOT_TOKEN,{polling:true})
const {gameOptions,againOptions} = require('./options')
const chats = {}



const startGame = async (chatId) => {
  await bot.sendMessage(chatId,`Сейчас я загадаю тебе цифру от 0 до 9, а ты должен её угадать!`)
  chats[chatId] = Math.floor(Math.random() * 10)
  await bot.sendMessage(chatId,'Отгадывай дружок', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description:'Приветствие'},
    {command: '/info', description: 'Инфо о пользователе'},
    {command: '/game', description: 'Игра'},
  ])

  bot.on('message',async msg => {
    const sticker = msg.sticker
    const emoji = msg.emojis
    const text = msg.text
    const chatId = msg.chat.id
    if (sticker) {
      return bot.sendMessage(chatId,'👍')
    }
    if (emoji) {
      return bot.sendMessage(chatId,'👍')
    }
    if(text === '/start') {
      return bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/5.webp')
      // return bot.sendMessage(chatId,'Добро пожаловать в нашего бота ! ')
    }
    if(text === '/info') {
      return bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if(text === '/game') {
      return startGame(chatId)
    }
    await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/256/16.webp')
    return bot.sendMessage(chatId,'Я не понимаю тебя, попробуй ещё раз!)')
  })

  bot.on('callback_query', async function(msg){
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again') {
      return startGame(chatId)
    }
    if(data == chats[chatId]) {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/10.webp')
      return await bot.sendMessage(chatId,'Поздравляю ты отгадал цифру ' + chats[chatId], againOptions)
    } else {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/12.webp')
      return bot.sendMessage(chatId,'К сожалению ты не угадал, бот загадал цифру ' + chats[chatId], againOptions)
    }
  })
}

start()