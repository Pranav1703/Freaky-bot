import 'dotenv/config'
import { 
	Client,
    Collection,
    GatewayIntentBits,
} from "discord.js";
import fs from 'fs';
import { dirname} from 'path';
import { fileURLToPath } from 'url';
import { Player } from 'discord-player';
import {YoutubeiExtractor} from 'discord-player-youtubei'
import playerEventHandlers  from './utils/playerEvents.js';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 


export const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
    ]
});

client.commands = new Collection();
const player = new Player(client);

// await player.extractors.loadDefault();
// player.extractors.unregister('YouTubeExtractor');
await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

await player.extractors.register(YoutubeiExtractor,undefined);

playerEventHandlers(player);

//set commands
(async () => {
	const commandFolders = fs.readdirSync(__dirname+"/commands").filter((folder)=>fs.lstatSync(`${__dirname}/commands/${folder}`).isDirectory());

	for(const folder of commandFolders){
	    const commandFiles = fs.readdirSync(__dirname+`/commands/${folder}`).filter(file => file.endsWith('.js'));
	    for(const file of commandFiles){
	        const command = await import(`./commands/${folder}/${file}`)
	        if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${`./commands/${folder}/${file}`} is missing a required "data" or "execute" property.`);
			}
	    }
	}

})();

//set events
(async()=>{
	const eventFiles = fs.readdirSync(__dirname+'/events').filter((file)=>file.endsWith(".js"))
	for(const file of eventFiles){
		const event = await import(`./events/${file}`)
		if(event.once){
			client.once(event.name,(...args)=>event.execute(...args))
		}else{
			client.on(event.name,(...args)=>event.execute(...args))
		}
	}	
})();


const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("Token not found. Check .env file");
}

client.login(token);

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // reconnect or restart the bot here
});
