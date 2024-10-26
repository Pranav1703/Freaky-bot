import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { useMainPlayer, usePlayer, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
                        .setName("add")
                        .setDescription("Adds a new song to the queue.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
                            );

export async function execute(interaction:ChatInputCommandInteraction){
    
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild?.id as string);

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    const query = interaction.options.getString("query") as string;
    
    // const guildNode = usePlayer(interaction.guild?.id as string); //queue.node = guildNode ??

    await interaction.deferReply()

    try {
        
        if(!queue?.isPlaying()){
            const result = await player.search(query)
            const { track } = await player.play(channel,result,{
                nodeOptions:{
                    leaveOnStop:true,
                    leaveOnEmpty:true,
                    metadata: interaction.channel,
                    bufferingTimeout: 15000
                }
            })

            if(result.hasPlaylist()){
                await interaction.editReply(`**${result.playlist?.title}** playlist enqueued!`)
                return;
            }
            await interaction.editReply(`**${track.title}** enqueued!`)
  
        }else{
            try {
                const result = await player.search(query);
                
                // console.log(track.tracks[0])
                // queue?.insertTrack(track.tracks[0])  // test this
                //guildNode?.insert(track.tracks[0]) // test this
                if(result.hasPlaylist()){
                    queue.addTrack(result.playlist!)
                    await interaction.editReply(`**${result.playlist?.title}** playlist enqueued!`)
                }else{
                    queue.addTrack(result.tracks[0])
                
                    await interaction.editReply(`${result.tracks[0].title} added to the queue!`)
                }
                console.log("queue size: ",queue.getSize())  //guildNode.queue = queue ??

            } catch (error) {
                console.log("Error while adding track to queue: ",error)
            }
        }

    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}

                            