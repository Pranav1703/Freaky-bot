import { usePlayer, useQueue, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("skip")
                        .setDescription("Skips the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild?.id as string)
    if(queue===null){
        await interaction.reply("Player is idle.")
        return
    }
    
    const { track } = useTimeline(interaction.guildId as string)!

    await interaction.reply(`Skipping **${track?.title}**.`) 
    queue.node.skip()

    
}
