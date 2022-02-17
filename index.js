const TelegramApi = require('node-telegram-bot-api')
require('dotenv').config()

const bot = new TelegramApi(process.env.BOT_TOKEN,{polling:true})
const {gameOptions,againOptions} = require('./options')
const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю тебе цифру от 0 до 9, а ты попробуй её угадать!) `, gameOptions)
    chats[chatId] = Math.floor(Math.random() * 10)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description:'Приветствие 👌'},
    {command: '/info', description: 'Инфо о пользователе ✔'},
    {command: '/game', description: 'Игра 🎉'},
    {command: '/help', description: 'Обо мне 😋'}
  ])

  bot.on('message',async msg => {
    const sticker = msg.sticker
    const photo = msg.photo
    const text = msg.text
    const chatId = msg.chat.id
    if (sticker) {
      return bot.sendMessage(chatId,'👍')
    }
    if (text === 'Привет') {
      return bot.sendMessage(chatId, `Привет ${msg.from.first_name} 👍`)
    }
    if (photo) {
      return bot.sendMessage(chatId,'😜')
    }
    if(text === '/start' || text === '/start@amr555JS_bot') {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/5.webp')
      return bot.sendMessage(chatId,`Приветствую тебя ${msg.from.first_name}!`)
    }
    if(text === '/info' || text === '/info@amr555JS_bot') {
      return bot.sendMessage(chatId,` Тебя зовут ${msg.from.first_name}!`)
    }
    if(text === '/game' || text === '/game@amr555JS_bot') {
      return startGame(chatId)
    }
    if(text === '/help' || text === '/help@amr555JS_bot') {
      return bot.sendMessage(chatId,`Оправь мне свой любимый стикер ${msg.from.first_name} !`)
    }
    return bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/256/16.webp')
    // return bot.sendMessage(chatId,'Я не понимаю тебя, попробуй ещё раз!)')
  })

  bot.on('callback_query', async function (msg) {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again') {
      return startGame(chatId)
    }
    if(data == chats[chatId]) {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/10.webp')
      return bot.sendMessage(chatId, `Поздравляю  ${msg.from.first_name} ! Бот действительно загадал цифру ${chats[chatId]} !!!`, againOptions)
    } else {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/a02/150/a02150f8-6e7d-4269-aa3b-2097aafc2f32/12.webp')
      return bot.sendMessage(chatId, `К сожалению ${msg.from.first_name} не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()