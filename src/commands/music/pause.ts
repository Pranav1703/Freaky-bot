import { usePlayer, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("pause")
                        .setDescription("Pause the currently playing Track.")

export async function execute(interaction:ChatInputCommandInteraction) {

    // const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(interaction.guildId as string);
    const { paused, pause, timestamp} = useTimeline(interaction.guildId as string)!

    const guildNode = usePlayer(interaction.guild?.id as string)
    if(guildNode===null){
        await interaction.reply("Player is idle.")
        return
    }
    pause();
    await interaction.reply(`Player paused at ${timestamp.current.label}.`)
}
