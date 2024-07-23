//this script should run seperately
import { REST,Routes } from "discord.js";
import "dotenv/config"
import fs from "fs"
import { dirname } from "path";
import { fileURLToPath } from "url";
import getEnvVar from "../utils/env.js";

const token = getEnvVar("DISCORD_TOKEN")
const clientId = getEnvVar("CLIENT_ID")
const guildId = getEnvVar("GUILD_ID")

const commands = []
const __dirname = dirname(fileURLToPath(import.meta.url))

const commandFolders = fs
                        .readdirSync(__dirname)
                        .filter((folder)=>fs.lstatSync(`${__dirname}/${folder}`).isDirectory());

for(const folder of commandFolders){
    
    const commmandFiles = fs.readdirSync(__dirname+`/${folder}`).filter(file=>file.endsWith(".js"))
    
    for(const file of commmandFiles){
        const filePath = `./${folder}/${file}`
        const command = await import(filePath)
        if('data' in command && 'execute' in command){
            commands.push(command.data.toJSON())
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);


    const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    ) as Array<unknown>;

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
    console.error(error);
}