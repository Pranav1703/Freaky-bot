import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("resume")
                        .setDescription("Resumes the track in the queue if paused.")


export async function execute(interaction:ChatInputCommandInteraction) {

}



 