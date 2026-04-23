import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import queueManager from "../services/queueManager.js";
import { searchAndCreateAudioStream } from "../services/search.js";
import { CacheType, ChatInputCommandInteraction, VoiceBasedChannel } from "discord.js";
import createSongEmbed from "../services/embedBuilder.js";


export const addAudioPlayerListeners= async(player: AudioPlayer, conn: VoiceConnection, channel: VoiceBasedChannel,guildId: string) => {
    const guildPlayer = queueManager.GetOrAddPlayerHandler(guildId)
    if (player.listeners('stateChange').length > 0) return;
    player.on('stateChange',async(oldState, newState)=>{
        if(newState.status === AudioPlayerStatus.Idle){
            if(guildPlayer.queue.length > 0){
                const nextSongQuery = guildPlayer.queue.shift()!
                const nextSongStream = await searchAndCreateAudioStream(nextSongQuery)
                if(!nextSongStream) {
                    console.log("cant find song or unable to create a active stream.")
                    return
                }
                const metadata = nextSongStream.metadata
                const songEmbed = createSongEmbed(metadata.title, metadata.duration, guildPlayer.queue.length, metadata.thumbnail)
                player.play(nextSongStream)

                channel.send({embeds: [songEmbed]})
            }else{
                conn.disconnect()
            }
        }
    })
}