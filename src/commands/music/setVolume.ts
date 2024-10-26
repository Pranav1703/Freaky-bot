import { usePlayer, useTimeline } from "discord-player";
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

    const guildNode = usePlayer(interaction.guild?.id as string);

    if(guildNode===null){
        await interaction.reply("Player is idel. No track is playing")
        return
    }

    const volume = interaction.options.getNumber("volume") as number;
    guildNode.setVolume(volume)


    await interaction.reply(`Volume set to ${volume}%`)
}