import { useQueue} from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("loop")
                        .setDescription("loop command. True - enters into loop. False - exits out of the loop.")
                        .addBooleanOption(option=>(
                            option
                                .setName("track")
                                .setDescription("loops the current track")
                        ))
                        .addBooleanOption(option=>(
                            option 
                                .setName("queue")
                                .setDescription("loops the queue")
                                
                        ))

export async function execute(interaction:ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild?.id as string)
    if(queue===null){
        await interaction.reply("Player is idle.")
        return
    }
    
    // queue.setRepeatMode(queue.repeatMode)

    const loopTrack = interaction.options.getBoolean("track")
    const loopQueue = interaction.options.getBoolean("queue")
    
    if(loopTrack){
        queue.setRepeatMode(1)
        await interaction.reply(`Current Track is in loop.`) 
    }else if(loopQueue){
        queue.setRepeatMode(2)
        await interaction.reply(`Current Queue is in loop.`) 
    }else{
        await interaction.reply("Track or queue option was not previded")
    }
    return
}
