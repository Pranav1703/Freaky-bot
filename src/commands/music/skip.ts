import { usePlayer, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("skip")
                        .setDescription("Skips the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    const guildNode = usePlayer(interaction.guild?.id as string)
    if(guildNode===null){
        await interaction.reply("Player is idle.")
        return
    }
    
    const { track } = useTimeline(interaction.guildId as string)!

    await interaction.reply(`Skipping **${track?.title}**.`) 
    guildNode.skip()

    
}
