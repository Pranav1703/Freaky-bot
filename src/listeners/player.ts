import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";
import queueManager from "../services/queue/queueManager.js";


export const addAudioPlayerListeners= (player: AudioPlayer, conn: VoiceConnection, guildId: string) => {
    const guildPlayer = queueManager.GetOrAddPlayerHandler(guildId)
    if (player.listeners('stateChange').length > 0) return;
    player.on('stateChange',(oldState, newState)=>{
        if(newState.status === AudioPlayerStatus.Idle){

            if(guildPlayer.queue.length > 0){
                const nextSong = guildPlayer.queue.shift()!
                player.play(nextSong)
            }else{
                conn.disconnect()
            }
    
        }
    })
}