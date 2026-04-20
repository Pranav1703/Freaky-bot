import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
 
export const data = new SlashCommandBuilder()
                        .setName("stop")
                        .setDescription("Stops playing the queue.")

export async function execute(interaction:ChatInputCommandInteraction) {
    
}
