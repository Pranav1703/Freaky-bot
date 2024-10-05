import { channel } from "diagnostics_channel";
import { useMainPlayer } from "discord-player";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";



export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("plays the song")
                        .addStringOption(option=>
                            option.setName("url")
                            .setDescription("url of the song")
                            .setRequired(true)
                            );

                            

export async function execute(interaction:ChatInputCommandInteraction){
    const player = useMainPlayer();
    const member = interaction.member as GuildMember
    const channel = member.voice.channel
    console.log(channel)
    
    if(!channel) return interaction.reply("You are not connected to a voice channel. Connect to a voice channel and try the command agian.")
    interaction.reply("command called.")
}