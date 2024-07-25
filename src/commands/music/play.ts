import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("plays the song")
                        .addStringOption(option=>
                            option.setName("url")
                            .setDescription("url of the song")
                            .setRequired(true)
                            );

                            

