import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import {yt} from "../../services/yt/yt.js"
import { verify } from "crypto";
import { Video } from "youtubei.js/dist/src/parser/nodes.js";
import { AudioResource } from "@discordjs/voice";


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



    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}