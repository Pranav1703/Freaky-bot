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
    // const queue = useQueue(interaction.guild?.id as string);

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    const query = interaction.options.getString("query") as string;
    
    const guildNode = usePlayer(interaction.guild?.id as string); //queue.node = guildNode ??
    console.log("\nqueue:  ",guildNode?.queue.tracks.toString())

    try {
        
        if(guildNode === null){
            try {
                const {track} = await player.play(channel,query,{
                    nodeOptions:{
                        metadata: interaction.channel
                    }
                })
                await interaction.reply(`Playing **${track.title}**.`)
                
            } catch (error) {
                console.log("error while playing: ",error)
            }
            return;
            
        }else{
            const track = await player.search(query);

            // console.log(track.tracks[0])
            // queue?.insertTrack(track.tracks[0])  // test this
            //guildNode?.insert(track.tracks[0]) // test this
            guildNode.queue.addTrack(track.tracks[0])
            
            console.log("queue size: ",guildNode?.queue.getSize())  //guildNode.queue = queue ??
            await interaction.reply(`${track.tracks[0].title} added to the queue!`)
    
        }

    } catch (error) {
        console.log("search failed: ",error)
    }
    
}

                            