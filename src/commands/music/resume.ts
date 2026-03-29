import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("resume")
                        .setDescription("Resumes the current track in the queue if it is paused.")


export async function execute(interaction:ChatInputCommandInteraction) {

}



 