import { useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("pause")
                        .setDescription("Pause the currently playing Track.")

export async function execute(interaction:ChatInputCommandInteraction) {

    // const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(interaction.guildId as string);
    const { paused, pause } = useTimeline(interaction.guildId as string)!

    pause();
    interaction.reply(`Player paused: ${paused}`)
}
