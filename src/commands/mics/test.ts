import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import {yt} from "../../services/yt.js"


export const data = new SlashCommandBuilder()
                        .setName("test")
                        .setDescription("testing command.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("...")
                            );

export async function execute(interaction:ChatInputCommandInteraction){

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.reply(
          'I am already playing in a different voice channel!',
        );
    }

    const query = interaction.options.getString("query") as string;
    
    try {
        interaction.reply("testing command called. query: " + query)
        const resp = await yt.search(query)
        const res = resp.results
        console.log("--- logs --- \n")
        console.log("playlists:" ,resp.playlists[0])
        // console.log("videos: ", resp.videos)
        // console.log("results: ",res)
    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}