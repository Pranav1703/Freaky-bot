import { usePlayer, useQueue } from "discord-player";
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

    const volume = interaction.options.getNumber("volume") as number;

    const queue = useQueue(interaction.guild?.id as string);
    
    if(queue===null){
        await interaction.reply("Player is idle. No track is playing")
        return
    }

    queue.node.setVolume(Number(volume)); 

    await interaction.reply(`Volume set to ${volume}%`)
}
