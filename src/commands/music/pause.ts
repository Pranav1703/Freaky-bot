import { GuildQueueTimeline, useQueue, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("pause")
                        .setDescription("Pause the currently playing Track.")

export async function execute(interaction:ChatInputCommandInteraction) {

    // const { timestamp, volume, paused, pause, resume, setVolume, setPosition, track } = useTimeline(interaction.guildId as string);
    const queueTimeline = useTimeline() as GuildQueueTimeline

    const queue = useQueue(interaction.guild?.id as string)
    if(queue===null){
        await interaction.reply("Player is idle.")
        return
    }

    if(!queueTimeline.paused){
        queueTimeline.pause();
    }else{
        await interaction.reply("Player is already paused.")
        return
    }
    
    await interaction.reply(`Player paused at ${queueTimeline.timestamp.current.label}.`)
}
