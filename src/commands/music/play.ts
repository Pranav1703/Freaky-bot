import { channel } from "diagnostics_channel";
import { useMainPlayer } from "discord-player";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";



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
    const channel = member.voice.channel as VoiceBasedChannel
    
    const url = interaction.options.getString("url") as string;
    console.log(url)

    if(!channel) return interaction.reply("You are not connected to a voice channel. Connect to a voice channel and try the command agian.")

    try {
        const { track } = await player.play(channel,url,{
            nodeOptions:{
                metadata: interaction
            }
        })
        interaction.reply(`url passed :${url}\n.**${track.title}** enqueued!`)
    } catch (error) {
        interaction.followUp(`Something went wrong: ${error}`);
    }
}