import { Player } from 'discord-player';

export default function playerEventHandlers(player:Player):void{
    
    player.events.on('playerStart', (queue, track) => {
        // Emitted when the player starts to play a song
        queue.metadata.send(`Started playing: **${track.title}**`);
    });
    
    
    // player.on('debug', async (message) => {
    //     // Emitted when the player sends debug info
    //     // Useful for seeing what dependencies, extractors, etc are loaded
    //     console.log(`\x1b[1m General player debug event: \x1b[0m${message}`);
    // });

    // player.events.on('debug', async (queue, message) => {
    //     // Emitted when the player queue sends debug info
    //     // Useful for seeing what state the current queue is at
    //     console.log(`\x1b[1m Player state change debug event: \x1b[0m ${message}.`);
    // });

    player.events.on('error', (queue, error) => {
        // Emitted when the player queue encounters error
        console.log(`\x1b[1m General player error event: \x1b[0m ${error.message}`);
        console.log(error);
    });

    player.events.on('playerError', (queue, error) => {
        // Emitted when the audio player errors while streaming audio track
        console.log(`Player error event: ${error.message}`);
        console.log(error);
    });

}