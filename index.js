const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5646516072:AAHKaBAimYayBSWFwHnK8Sqyzski8rcHquc'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить ниформацию о пользователе'},
    {command: '/game', description: 'Игра угадай число!'},
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp')
      return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот игры "Угадай число" `)
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз.')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю! Ты угадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот выбрал цифру ${chats[chatId]}`, againOptions)
    }
  })
}

start()