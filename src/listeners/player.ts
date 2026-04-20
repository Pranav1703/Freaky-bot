import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import queueManager from "../services/queue/queueManager.js";
import { searchAndCreateAudioStream } from "../services/yt/search.js";


export const addAudioPlayerListeners= async(player: AudioPlayer, conn: VoiceConnection, guildId: string) => {
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
                player.play(nextSongStream)
            }else{
                conn.disconnect()
                
            }
    
        }
    })
}