import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { useMainPlayer, usePlayer, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
                        .setName("add")
                        .setDescription("adds a new song to the queue")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
                            );

export async function execute(interaction:ChatInputCommandInteraction){
    
    const player = useMainPlayer();
    const queue = useQueue(interaction.guild?.id as string);
    
    const query = interaction.options.getString("query") as string;
    

    const guildNode = usePlayer(interaction.guild?.id as string);
    console.log("guild NODE ",guildNode)


    const track = await player.search(query);
    console.log(track.tracks[0])
    queue?.addTrack(track.tracks[0])

    console.log("queue size: ",queue?.getSize())
    await interaction.reply(`track data: ${track}`)
}

                            