import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("skip")
                        .setDescription("Skips the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    
}
