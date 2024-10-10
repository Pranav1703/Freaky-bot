import { usePlayer, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("resume")
                        .setDescription("Resumes the track in the queue if paused.")


export async function execute(interaction:ChatInputCommandInteraction) {
    const { resume,timestamp } = useTimeline(interaction.guildId as string)!

    const guildNode = usePlayer(interaction.guild?.id as string)
    if(guildNode===null){
        await interaction.reply("Player is idle.")
        return
    }
    resume();
    await interaction.reply(`Player resumed at ${timestamp.current.label}`)
}



 