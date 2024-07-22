import { SlashCommandBuilder } from "discord.js";
import { Interaction } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("ping")
                        .setDescription("pinging the bot to check if the bot connection is alive")

export async function execute(interaction:Interaction){
    if(interaction.member?.user.username){}
    console.log(interaction.member?.user.username)
}