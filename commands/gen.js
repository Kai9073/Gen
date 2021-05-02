const {
  registerFont,
  createCanvas,
  loadImage
} = require('canvas')
const Discord = require('discord.js')
const {
  roundRect,
  SendErr
} = require('../functions/index.js')
const {
  validateHTMLColorHex,
  validateHTMLColorHwb,
  validateHTMLColorHsl,
  validateHTMLColorRgb,
  validateHTMLColorLab
} = require("validate-color");

const validateColor = (color) => {
  if (
    (color && validateHTMLColorHex(color)) ||
    validateHTMLColorRgb(color) ||
    validateHTMLColorHsl(color) ||
    validateHTMLColorHwb(color) ||
    validateHTMLColorLab(color)
  ) {
    return true;
  }
  return false;
};

module.exports = {
  slash: true,
  testOnly: true,
  description: 'Generate signage',
  minArgs: 7,
  expectedArgs: '<路線號碼> <中文目的地> <英文目的地> <月台號碼> <路線顏色> <路線名稱> <方向_L或R> <選填_路線號碼使用黑色_true或false>',
  callback: async ({
    interaction,
    args,
    channel
  }) => {
    console.log("hi.")
    function checkArg(arg) {
      return (!arg | arg == null) ? "缺少" : `\`${arg}\``
    }
    console.log(args)
    if (!args[6]) return SendErr(channel, `缺少選項!\n\n路線號碼 ： ${checkArg(args[0])}\n目的地(中文) ： ${checkArg(args[1])}\n目的地(英文) ： ${checkArg(args[2])}\n月台號碼 ： ${checkArg(args[3])}\n路線顏色 ： ${checkArg(args[4])}\n路線名稱 : ${checkArg(args[6])}`)
    let [routeNum, destinationCh, destinationEn, platformNum, routeColor, routeName, direction] = args
    direction = direction.toUpperCase()
    routeNumColor = args[7]=="true" ? "rgb(60,60,60)" : "#fff"
    console.log(routeNumColor)
    const check1 = /^[0-9]{2}$/.test(routeNum)
    destinationCh = destinationCh.replace(/_/g, " ")
    destinationEn = destinationEn.replace(/_/g, " ")
    const check4 = /^[1]?[0-9]$/.test(platformNum)
    const check5 = validateColor(routeColor)
    const check6 = validateColor(routeNumColor)
    const check7 = /^(R|L)$/.test(direction)
    routeName = routeName.replace(/_/g, " ")
    if (!check1) SendErr(channel, `Line Number must be a 2-digit number; from 00 to 99\n(received : \`${routeNum}\`)`)
    if (!check4) SendErr(channel, `Platform number should be a number; from 0 to 19\n(received : \`${platformNum}\`)`)
    if (!check5) SendErr(channel, `${routeColor} is not a valid colour`)
    if (!check6) SendErr(channel, `${routeColor} is not a valid colour`)
    if (!check7) SendErr(channel, `direction must be \`L\` or \`R\`, but received \`${direction}\``)
    if (!check1||!check4||!check5||!check6||!check7) return "Action failed.";
    const canvas = createCanvas(512, 128)
    const ctx = canvas.getContext('2d')
    const arrL = await loadImage(direction == "R" ? 'https://i.imgur.com/T1LuwcH.png' : 'https://i.imgur.com/GClHiuU.png')
    const offset = direction === "R" ? 109 : 0
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = `${routeColor}`
    ctx.beginPath();
    for (let i = 42; i > 37; i--) {
      ctx.arc(169 - offset, 74, i, 0, 2 * Math.PI);
    }
    ctx.drawImage(arrL, direction === "R" ? 416 : 16, 48)
    ctx.fillStyle = `${routeColor}`
    ctx.stroke();
    roundRect(ctx, 7, 5, 20, 20, 3, true, true)
    ctx.fillStyle = "rgb(60,60,60)"
    ctx.font = '500 20px GenWanMin'
    ctx.fillStyle = "white"
    ctx.font = "500 15px GenWanMin"
    ctx.textAlign = "center"
    ctx.fillStyle = `${routeNumColor}`
    ctx.fillText(routeNum, 17, 21, 17)
    ctx.textAlign = "start"
    ctx.fillStyle = "rgb(60,60,60)"
    ctx.fillText(routeName.toString(), 34, 21, 300)
    ctx.fillStyle = "rgb(60,60,60)"
    ctx.font = '500 40px GenWanMin'
    ctx.fillText(`往 ${destinationCh}`, 242 - offset, 74, 241)
    ctx.font = '500 20px GenWanMin'
    ctx.fillText(`to ${destinationEn}`, 242 - offset, 107, 241)
    ctx.font = '500 50px GenWanMin'
    ctx.textAlign = "center";
    ctx.fillText(platformNum.toString(), 169 - offset, 92, 40)
    ctx.textAlign = "start";
    const genDate = new Date()
    const fileName = `sign_Line${routeNum}_Platform${platformNum}_${destinationEn.replace(/\s/g,"_")}.png`
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), fileName);
    channel.send(attachment)
    const finishEmbed = new Discord.MessageEmbed()
    .setAuthor("SRT 目的地牌產生器","https://cdn.discordapp.com/attachments/793775129904939008/829701573449744445/LOGOYRT.png")
    .setDescription(`Generated \n\`${fileName}\`\n\n路線號碼 ： ${checkArg(args[0])}\n目的地(中文) ： ${checkArg(args[1])}\n目的地(英文) ： ${checkArg(args[2])}\n月台號碼 ： ${checkArg(args[3])}\n路線顏色 ： ${checkArg(args[4])}\n路線名稱 : ${checkArg(args[5])}\n路線號碼顏色 : ${routeNumColor === "#fff" ? "`白色 [#fff]`" : "`黑色 [rgb(60,60,60)]`"}`)
    .setFooter("由 D²#1772 製作");
    return finishEmbed
  }
}