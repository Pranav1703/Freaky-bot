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
    
    const min = interaction.options.getInteger("min") 
    const sec = interaction.options.getInteger("sec")

    let timerToSec = 0
    let timer = 0;
    if (min && sec){
        timerToSec = (min *60 ) + sec
    
        const currSec = Math.round(Date.now()/1000)

        timer = currSec + timerToSec
        console.log("min && sec conditon:",timerToSec)
    }else if (min){
        timerToSec = min * 60
        const currSec = Math.round(Date.now()/1000)
    
        timer = currSec + timerToSec
        console.log("min conditon:",timerToSec)
    }
    console.log("unix timestamp: ",timer)
    const msg = interaction.options.getString("message")
    
    if(msg){
        await interaction.reply(`${msg} <t:${timer}:R>`)
    }else{
        await interaction.reply(`<t:${timer}:R>`)
    }


}