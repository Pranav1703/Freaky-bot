import 'dotenv/config'
import { Client, GatewayIntentBits } from "discord.js";
import { messageResponse } from './listeners/message.js';

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.on("messageCreate",messageResponse)


const token = process.env.DISCORD_TOKEN 

if(!token){
    throw new Error("Token not found. Check .env file")
}

client.login(token)