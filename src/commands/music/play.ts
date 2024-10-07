import { useMainPlayer } from "discord-player";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";



export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("plays the song")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
                            );

                            

export async function execute(interaction:ChatInputCommandInteraction){
    const player = useMainPlayer();
    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel
    
    const query = interaction.options.getString("query") as string;

    if(!channel){
        return interaction.reply("You are not connected to a voice channel. Connect to a voice channel and try the command agian.")
    }

    try {
        const { track } = await player.play(channel,query,{
            nodeOptions:{
                metadata: interaction.channel
            }
        })
        interaction.reply(`**${track.title}** enqueued!`)
    } catch (error) {
        interaction.reply(`Something went wrong: ${error}`);
        console.log("something went wrong: ",error)
    }
    
}