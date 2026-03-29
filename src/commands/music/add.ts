import { ChatInputCommandInteraction, GuildMember, PermissionsBitField, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { useMainPlayer, useQueue } from "discord-player";

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

    if (!channel) {
        interaction.ephemeral = true
        return interaction.reply({
            content: "You must be in a voice channel to use this command!",
        });
    }

    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.reply(
          'I am already playing in a different voice channel!',
        );
    }

    const query = interaction.options.getString("query") as string;
    
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
                
                if(result.hasPlaylist()){
                    queue.addTrack(result.playlist!)
                    await interaction.editReply(`**${result.playlist?.title}** playlist enqueued!`)
                }else{
                    queue.addTrack(result.tracks[0])
                
                    await interaction.editReply(`${result.tracks[0].title} added to the queue!`)
                }
                console.log("queue size: ",queue.getSize()) 

            } catch (error) {
                console.log("Error while adding track to queue: ",error)
            }
        }

    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}

                            