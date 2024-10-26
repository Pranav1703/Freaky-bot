import { useMainPlayer, usePlayer } from "discord-player";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";



export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("Plays the song by searching the track using query.")
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

    const guildNode = usePlayer(interaction.guild?.id as string);

    if(!channel){
        return interaction.reply("You are not connected to a voice channel. Connect to a voice channel and try the command agian.")
    }

    // console.log("guild node: ",guildNode?.isPlaying())
    await interaction.deferReply()
    try {
        if(guildNode?.isPlaying()){
            const track = await player.search(query);
    
            guildNode.queue.addTrack(track.tracks[0])
            
            console.log("queue size: ",guildNode?.queue.getSize())  
            await interaction.editReply(`${track.tracks[0].title} added to the queue!`)
            
        }else{
            const { track } = await player.play(channel,query,{
                nodeOptions:{
                    leaveOnStop:true,
                    leaveOnEmpty:true,
                    metadata: interaction.channel,
                    bufferingTimeout: 15000
                }
            })
            await interaction.editReply(`**${track.title}** enqueued!`)
        }
    } catch (error) {
        await interaction.editReply(`Something went wrong: ${error}`);
        console.log("something went wrong: ",error)
    }

    
}