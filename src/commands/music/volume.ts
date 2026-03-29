import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("volume")
                        .setDescription("Sets the volume.")
                        .addNumberOption(option=>
                            option
                                .setName("value")
                                .setDescription("volume value")
                                .setMinValue(0)
                                .setMaxValue(100)
                                .setRequired(true)
                        )

export async function execute(interaction:ChatInputCommandInteraction) {

}
