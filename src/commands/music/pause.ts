import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("pause")
                        .setDescription("Pause the currently playing Track.")

export async function execute(interaction:ChatInputCommandInteraction) {

}
