import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
                        .setName("timer")
                        .setDescription("start timer.")
                        .addIntegerOption(option=>
                            option.setName("val")
                                .setDescription("value in minutes")
                                .setRequired(true)
                        )

export async function execute(interaction:ChatInputCommandInteraction){
    const min = interaction.options.getInteger("val") as number
    const sec = min * 60
    console.log("time in unix timestamp:",Date.now())

    const currSec = Math.round(Date.now()/1000)

    const timer = currSec + sec

    interaction.reply(`<t:${timer}:R>`)

}