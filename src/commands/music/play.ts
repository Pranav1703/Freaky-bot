import { createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior } from "@discordjs/voice";
import { ChatInputCommandInteraction,  GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { searchAndGetAudioResource } from "../../services/yt/search.js";
import queueManager from "../../services/queue/queueManager.js";

export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("Plays the song by searching the track using query.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
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
        const queue = queueManager.addOrGetQueue(interaction.guildId!)

        const queryResource = await searchAndGetAudioResource(query)
        if(!queryResource){
            interaction.editReply("server error. Cant search or create audio resource for player.")
            return
        }
        queue.push(queryResource)
        
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
        
        const resource = queue.shift()
        console.log("resource info:",resource.metadata)
        connection.subscribe(player)
        player.play(resource)
        interaction.editReply(`playing from queue(length: ${queue.length})`)

    } catch (error) {
        console.log("error while playing: ",error)
    } 
}