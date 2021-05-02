const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const client = new DiscordJS.Client({
  partials: ['MESSAGE', 'REACTION'],
})

client.on('ready', () => {
  console.log("Bot is ready now")
  const disabledDefaultCommands = [
    'help',
    'command',
    'language',
    'prefix',
    'requiredrole'
  ]

  // Initialize WOKCommands with specific folders and MongoDB
  new WOKCommands(client, {
    testServers: ['829701534559633408','740494945638416455','744036166734708817'],
    commandsDir: 'commands',
    featuresDir: 'features',
    messagesPath: '',
    showWarns: true, // Show start up warnings
    del: -1, // Timeout in seconds before and error message gets deleted (Missing permissions, missing roles, or command disabled) set to -1 to disable
    dbOptions:'',
    disabledDefaultCommands
  })
    .setDefaultPrefix('g.')
})

client.login(process.env.TOKEN)

const {registerFont} = require('canvas')

registerFont('NotoSansJP-Regular.otf', {
  family: 'NSJP'
})
registerFont('NotoSansJP-Bold.otf', {
  family: 'BoldJP'
})
registerFont('GenWanMin-M.ttc', {
  family: 'GenWanMin',
  weight: '500'
})
registerFont('GenWanMin-SB.ttc', {
  family: 'GenWanMin',
  weight: '600'
})