import { AudioPlayerStatus, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction,  GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import { searchAndCreateAudioStream } from "../../services/yt/search.js";
import queueManager from "../../services/queue/queueManager.js";
import { addAudioPlayerListeners } from "../../listeners/player.js";

export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("Plays the music by searching the track using query.")
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
    
    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.reply(
          'I am already playing in a different voice channel!',
        );
    }

    const guildId = interaction.guildId!
    const query = interaction.options.getString("query") as string;

    await interaction.deferReply();
    try {
        const guildPlayer = queueManager.GetOrAddPlayerHandler(guildId)
        guildPlayer.queue.push(query)

        if(guildPlayer.player.state.status  === AudioPlayerStatus.Playing || guildPlayer.player.state.status  === AudioPlayerStatus.Paused){
            return interaction.editReply(`Song added to queue. queue LENGTH: ${guildPlayer.queue.length}`) // later add song name and additional info after fetching metadata
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId!,
            adapterCreator: channel.guild.voiceAdapterCreator!
        })

        const nextQuery = guildPlayer.queue.shift()
        if(!nextQuery) return interaction.editReply("queue emtpy.")
        
        const audioStream = await searchAndCreateAudioStream(nextQuery)
        if(!audioStream){
            interaction.editReply("server error. Cant search or create audio resource for player.")
            return
        }
        
        connection.subscribe(guildPlayer.player)
        guildPlayer.player.play(audioStream)

        addAudioPlayerListeners(guildPlayer.player, connection, guildId)
        interaction.editReply(`playing from queue(LENGTH: ${guildPlayer.queue.length})`)
    } catch (error) {
        console.log("error while playing: ",error)
    } 
}