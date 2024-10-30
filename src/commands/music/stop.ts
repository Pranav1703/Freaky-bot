import { usePlayer, useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
 
export const data = new SlashCommandBuilder()
                        .setName("stop")
                        .setDescription("Stops the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    
    const queue = useQueue(interaction.guild?.id as string);
    if(queue===null){
        await interaction.reply("Player is idle.")
        return
    }
    
    queue.delete();
    await interaction.reply("Deleting the queue")

}
