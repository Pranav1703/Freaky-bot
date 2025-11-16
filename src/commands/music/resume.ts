import { GuildQueueTimeline, useQueue, useTimeline } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("resume")
                        .setDescription("Resumes the current track in the queue if it is paused.")


export async function execute(interaction:ChatInputCommandInteraction) {
    const queueTimeline = useTimeline() as GuildQueueTimeline

    const queue = useQueue(interaction.guild?.id as string)
    if(queue===null){
        await interaction.reply("Player is idle.")
        return
    }
    if(queueTimeline.paused){
        queueTimeline.resume()
    }else{
        await interaction.reply(`Player is Playing. No need to resume`)
        return
    }
    
    await interaction.reply(`Player resumed at ${queueTimeline.timestamp.current.label}`)
}



 