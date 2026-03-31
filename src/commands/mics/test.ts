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

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    if (!channel) {
        interaction.ephemeral = true
        return interaction.reply({
            content: "You must be in a voice channel to use this command!",
        });
    }
    await interaction.deferReply();
    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.editReply(
          'I am already playing in a different voice channel!',
        );
    }
    
    const query = interaction.options.getString("query") as string;
    
    try {
        interaction.editReply("testing command called. query: " + query)

        const resource = await searchAndGetAudioResource(query)
        if(!resource){
            interaction.editReply("server error. Cant search or create audio resource for player.")
            return
        }
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId!,
            adapterCreator: channel.guild.voiceAdapterCreator!
        })
        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Stop
            }
        })

        connection.subscribe(player)
        player.play(resource)
    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}