import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const statusString = (wsPing: number,commandPing: number): string=> {
    return `
            \nWebSocket ping: ${wsPing}ms\nCommand latency: ${commandPing}ms 
           `    
}

export const data = new SlashCommandBuilder()
                        .setName("ping")
                        .setDescription("pinging the bot to check if the bot connection is alive")

export async function execute(interaction:ChatInputCommandInteraction){
    
    switch (interaction.user.username) {

        case "ImMoRtAl LoRd":
            interaction.reply({
                content:"?No more W gaming?"
            })
            break;
        
        case "Abhi005":
            interaction.reply({
                content:"8.7 years."
            })
            break;
        
        case "73.53.2532.53.01":
            interaction.reply({
                content:`
                    Remainder!
                    u need to install and finish elden ring dlc.
                `
            })
            break;
        case "rahul":
            interaction.reply({
                content:"total living creatures in your basement: 429"
            })
            break;

        default:
            const resp = await interaction.reply({
                content: `pinging...`
                
            })
            interaction.editReply({
                content: statusString(interaction.client.ws.ping,(resp.createdTimestamp - interaction.createdTimestamp))
            })
            break;
    }
}