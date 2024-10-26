import { usePlayer, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("loop")
                        .setDescription("set the current queue to loop the tracks")

export async function execute(interaction:ChatInputCommandInteraction) {
    const guildNode = usePlayer(interaction.guild?.id as string)
    if(guildNode===null){
        await interaction.reply("Player is idle.")
        return
    }
    
    guildNode.queue.setRepeatMode(guildNode.queue.repeatMode)

    await interaction.reply(`Current queue is in loop.`) 

}
