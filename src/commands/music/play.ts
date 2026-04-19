import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction,  GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { searchAndGetAudioResource } from "../../services/yt/search.js";
import queueManager from "../../services/queue/queueManager.js";
import { addAudioPlayerListeners } from "../../listeners/player.js";

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

    const guildId = interaction.guildId!
    const query = interaction.options.getString("query") as string;
    
    try {
        const playerHandler = queueManager.GetOrAddPlayerHandler(guildId)

        const queryResource = await searchAndGetAudioResource(query)
        if(!queryResource){
            interaction.editReply("server error. Cant search or create audio resource for player.")
            return
        }
        playerHandler.queue.push(queryResource)

        if(playerHandler.player.state.status  === AudioPlayerStatus.Playing){
            interaction.editReply(`Song added to queue. Queue LENGTH: ${playerHandler.queue.length}`) // later add song name and additional info after fetching metadata

        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId!,
            adapterCreator: channel.guild.voiceAdapterCreator!
        })

        const resource = playerHandler.queue.shift()
        if(!resource) return interaction.editReply("queue emtpy.")

        connection.subscribe(playerHandler.player)
        playerHandler.player.play(resource)

        addAudioPlayerListeners(playerHandler.player, connection, guildId)
        interaction.editReply(`playing from queue(length: ${playerHandler.queue.length})`)
    } catch (error) {
        console.log("error while playing: ",error)
    } 
}