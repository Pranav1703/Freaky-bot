import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import { spawn } from "child_process";
import { Metadata } from "../types/types.js";


export async function searchAndCreateAudioStream(query: string): Promise<AudioResource<Metadata> | undefined>{
    try {
        const target = query.startsWith('http') ? query : `ytsearch1:${query}`;

        const metadataProcess = spawn('yt-dlp', [target, '--dump-json', '--no-playlist']);
        
        let outputData = '';
        let errorData = '';

        metadataProcess.stdout.on('data', (data) => {
            outputData += data.toString();
        });

        metadataProcess.stderr.on('data', (data) => {
            errorData += data.toString();
        });

        metadataProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    const songMetadata = JSON.parse(outputData);
                    console.log('Song Title:', songMetadata.title);
                    console.log('Duration:', songMetadata.duration);
                    console.log("thumbnail", songMetadata.thumbnail)
                    const minutes = Math.floor(songMetadata.duration / 60);
                    const seconds = songMetadata.duration % 60;

                    const duration = `${minutes}:${seconds}`
                    const process = spawn('yt-dlp', [
                        target,
                        '-f', 'bestaudio/best', 
                        '-o', '-',               // Output to stdout (dash)
                        // '--quiet',               // Don't clutter logs
                        '--no-playlist',         // Only first result
                    ]);
                    process.stderr.on('data', (data) => {  // using stderr for status updates, and warnings, not just fatal errors.
                        console.error(`[yt-dlp] data event: ${data.toString()}`);
                    });
                
                    process.on('error', (err) => {
                        console.error("[yt-dlp] Spawn error:", err);
                    });
                
                    process.on('close', (code) => {
                        console.log(`[yt-dlp] Process exited with code ${code}`);
                    });
                    const resource = createAudioResource(process.stdout, {
                        inputType: StreamType.Arbitrary,
                        inlineVolume: true,
                        metadata: { 
                            process,
                            title: songMetadata.title,
                            duration: duration,
                            thumbnail: songMetadata.thumbnail,
                        }
                    });
                    resource.playStream.on('error', (err) => { console.log("Killing process due to ERROR:",err); process.kill('SIGKILL') });
                    resource.playStream.on('end', () => { console.log("Killing process. Playing ended."); process.kill('SIGKILL') });
                
                    return resource

                } catch (e) {
                    console.error('Failed to parse JSON:', e);
                }

            } else {
                console.error(`Process exited with code ${code}: ${errorData}`);
            }
        });

    } catch (error) {
        console.log("cant create a active audio stream: ",error)
        return
    }
}