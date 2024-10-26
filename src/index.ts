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

player.on('debug', async (message) => {
    // Emitted when the player sends debug info
    // Useful for seeing what dependencies, extractors, etc are loaded
    console.log(`\x1b[1m General player debug event: \x1b[0m${message}`);
});

// player.events.on('debug', async (queue, message) => {
//     // Emitted when the player queue sends debug info
//     // Useful for seeing what state the current queue is at
//     console.log(`\x1b[1m Player state change debug event: \x1b[0m ${message}.`);
	
// });

player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`\x1b[1m General player error event: \x1b[0m ${error.message}`);
    console.log(error);
});

player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("Token not found. Check .env file");
}

client.login(token);

