const Discord = require("discord.js");
const {default: Poll} = require("../src/index.js");
const dotenv = require("dotenv");
dotenv.config();
const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS]});

client.login("");

console.log(Poll)
const poll = new Poll({
    client: client,
    message: "A new Poll!",
    title: "A fun title",
    description: "hurah",
    color: "GREEN",
    itemlist: ["yes", "no"],
    endDate: Date.now() + 300000
})

poll.start(client.channels.cache.get("839562429536534552"))