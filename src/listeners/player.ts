import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";


export const addAudioPlayerListeners= (player: AudioPlayer, conn: VoiceConnection) => {
    player.on('stateChange',(oldState, newState)=>{
        if(newState.status === AudioPlayerStatus.Idle){
            conn.disconnect()
        }
    })
}