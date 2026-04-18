import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { searchAndGetAudioResource } from "../../services/yt/search.js";
import { createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";


export const data = new SlashCommandBuilder()
                        .setName("test")
                        .setDescription("testing command.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("...")
                            );

export async function execute(interaction:ChatInputCommandInteraction){

}