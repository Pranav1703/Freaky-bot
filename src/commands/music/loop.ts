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

    
}
