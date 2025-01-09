import { Player } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export default function playerEventHandlers(player:Player):void{
    
    player.events.on('playerStart', (queue, track) => {        
        
        const songEmbed = new EmbedBuilder()
            .setTitle(`Playing **${track.title}**`)
            .setDescription(`${track.description}`)
            .setImage(`${track.thumbnail}`)
            .addFields(
                { name: 'Duration', value: `${track.duration}`, inline: true },
            )
            .setTimestamp()
        queue.metadata.send({ embeds: [songEmbed] });
    });

    player.events.on('emptyQueue', (queue) => {
        queue.metadata.send('Queue finished!');
    });

    player.events.on('emptyChannel', (queue) => {
        queue.metadata.send(`Leaving because no VC activity for the past 5 minutes`);
    });
    

    player.events.on('disconnect', (queue) => {
        queue.metadata.send('Nothing to play, disconnecting..');
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