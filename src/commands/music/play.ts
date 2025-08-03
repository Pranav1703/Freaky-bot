import { useMainPlayer, useQueue } from "discord-player";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";



export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("Plays the song by searching the track using query.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
                            );

                            

export async function execute(interaction:ChatInputCommandInteraction){

    if (!interaction.inGuild() || !interaction.guild) {
        return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    const player = useMainPlayer();
    const member = interaction.member as GuildMember
    const channel = member.voice.channel 

    if(!channel){
        return interaction.reply("You are not connected to a voice channel. Connect to a voice channel and try the command agian.")
    }
    const query = interaction.options.getString("query") as string;

    const queue = useQueue(interaction.guild?.id as string);

    // const songEmbed = new EmbedBuilder()
    //     .setTitle(`Playing **${track.title}**`)
    //     .setImage(`${track.thumbnail}`)
    //     .setTimestamp()



    // console.log("guild node: ",guildNode?.isPlaying())
    
    await interaction.deferReply()
    try {
        if(queue?.isPlaying()){
            const result = await player.search(query);
            
            if(result.hasPlaylist()){
                queue.addTrack(result.playlist!)
                await interaction.editReply(`**${result.playlist?.title}** playlist enqueued!`)
            }else{
                queue.addTrack(result.tracks[0])
            
                await interaction.editReply(`${result.tracks[0].title} added to the queue!`)
            }

            console.log("queue size: ",queue.getSize()) 

        }else{
            const result = await player.search(query)
            const { track } = await player.play(channel,result,{  // automatically selects and plays the first tracks
                nodeOptions:{
                    leaveOnStop:true,
                    leaveOnEmpty:true,
                    metadata: interaction.channel,
                    bufferingTimeout: 15000,
                }
            })

            console.log("no of tracks:",result.tracks.length)
            console.log("first track in search results: ",result.tracks[0].toJSON())
            if(result.hasPlaylist()){
                await interaction.editReply(`**${result.playlist?.title}** playlist enqueued!`)
                
            }else{
                await interaction.editReply(`**${track.title}** enqueued!`)
                console.log("current track:",track)
            }
        }
    } catch (error) {
        await interaction.editReply(`Something went wrong: ${error}`);
        console.log("something went wrong: ",error)
    }   
}