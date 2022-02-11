const TelegramApi = require('node-telegram-bot-api');

const token = '5202250704:AAEQ0161zlcnn_WQCybVb1kKOfFyfa-Wmnc'

const bot = new TelegramApi(token,{polling:true})
const {gameOptions,againOptions} = require('/options')
const chats = {}



const startGame = async (chatId) => {
  await bot.sendMessage(chatId,`Сейчас я загадаю тебе цифру от 0 до 9, а ты должен её угадать!`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId,'Отгадывай дружок', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description:'Начальное привествие'},
    {command: '/info', description:'Инфо о пользователе'},
    {command: '/game', description:'Игра'},
  ])

  bot.on('message',async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start') {
      await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/1df/82b/1df82bcc-cb4f-343c-a961-3417125411e0/1.webp')
      return  bot.sendMessage(chatId,'Добро пожаловать в нашего бота ! ')
    }
    if(text === '/info') {
      return bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if(text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId,'Я не понимаю тебя, попробуй ещё раз!)')
  })

  bot.on('callback_query', async function(msg){
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again') {
      return startGame(chatId)
    }
    if(data === chats[chatId]) {
      return await bot.sendMessage(chatId,'Поздравляю ты отгадал цифру ' + chats[chatId], againOptions)
    } else {
      return bot.sendMessage(chatId,'К сожалению ты не угадал, бот загадал цифру ' + chats[chatId], againOptions)
    }
  })
}

start()