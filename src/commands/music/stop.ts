import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("stop")
                        .setDescription("Stops the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    
}
