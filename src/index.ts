import 'dotenv/config'
// import { ExtendedClient } from './types/extendedClient.js';
import { 
	Client,
    Collection,
    Events,
    GatewayIntentBits,
} from "discord.js";
import fs from 'fs';
import { dirname} from 'path';
import { fileURLToPath } from 'url';

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


// client.on(Events.InteractionCreate, async (interaction) => {
    
//     if(!interaction.isCommand()){return}
//     const command = client.commands.get(interaction.commandName)

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return
// 	}

// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 		}
// 	}

// });



const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("Token not found. Check .env file");
}

client.login(token);

