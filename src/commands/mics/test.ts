import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { searchAndGetAudioResource } from "../../services/yt/search.js";


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

        // const resource = await searchAndGetAudioResource(query)
        // if(!resource){
        //     interaction.editReply("server error. Cant search or create audio resource for player.")
        //     return
        // }
        // const player = createAudioPlayer({
        //     behaviors: {
        //         noSubscriber: NoSubscriberBehavior.Stop
        //     }
        // })
        // player.play(resource)
    } catch (error) {
        console.log("error while playing: ",error)
    }
    
}