import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
                        .setName("timer")
                        .setDescription("start timer.")
                        .addIntegerOption(option=>
                            option.setName("min")
                                .setDescription("minutes")
                                .setRequired(true)
                        )
                        .addIntegerOption(option=>
                            option.setName("sec")
                                .setDescription("seconds")
                                .setRequired(false)
                        )
                        .addStringOption(option=>
                            option.setName("message")
                                .setDescription("message along with timer")
                                .setRequired(false)
                        )

export async function execute(interaction:ChatInputCommandInteraction){
    
    const min = interaction.options.getInteger("val") as number
    const sec = interaction.options.getInteger("sec") as number

    const timerToSec = (min *60 ) + sec
    console.log("time in unix timestamp:",Date.now())

    const currSec = Math.round(Date.now()/1000)

    const timer = currSec + timerToSec

    const msg = interaction.options.getString("message")

    await interaction.reply(`${msg} <t:${timer}:R>`)

}