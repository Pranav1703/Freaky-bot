import 'dotenv/config'
import { ExtendedClient } from './types/extendedClient.js';
import { 
    GatewayIntentBits,    
} from "discord.js";
import { messageResponse } from './listeners/message.js';
import fs from 'fs';
import { dirname} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 


const client = new ExtendedClient({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

//setting commands
// const commandsFolderPath = join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(commandsFolderPath).filter((folder)=>fs.lstatSync(`${commandsFolderPath}/${folder}`).isDirectory());

// for (const folder of commandFolders) {
//     const commandFolderPath = join(commandsFolderPath, folder);
//     const commandFiles = fs.readdirSync(commandFolderPath).filter(file => file.endsWith('.js'));
    
//     for (const file of commandFiles) {
//         const command = await import(`./commads/${folder}/${file}`)
//     }
// }

const commandFolders = fs.readdirSync(__dirname+"/commands").filter((folder)=>fs.lstatSync(`${__dirname+"/commands"}/${folder}`).isDirectory());
console.log("command folders:",commandFolders)
for(const folder of commandFolders){
    const commandFiles = fs.readdirSync(__dirname+`/commands/${folder}`).filter(file => file.endsWith('.js'));
    for(const file of commandFiles){
        // const command = await import(`./commads/${folder}/${file}`)

    }
}


client.on("interactionCreate", async (interaction) => {
    // Handle interactions here
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("Token not found. Check .env file");
}

client.login(token);

