
import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import { spawn } from "child_process";

export async function searchAndGetAudioResource(query: string): Promise<AudioResource<null> | undefined>{
    try {
        const target = query.startsWith('http') ? query : `ytsearch1:${query}`;

        const process = spawn('yt-dlp', [
            target,
            '-f', 'bestaudio/best', 
            '-o', '-',               // Output to stdout (dash)
            // '--quiet',               // Don't clutter logs
            '--no-playlist',         // Only first result
            // YouTube sometimes throttles; these help:
            '--limit-rate', '100K',   
            '--no-warnings'
        ]);
        process.stderr.on('data', (data) => {
            console.error(`[yt-dlp] stderr: ${data.toString()}`);
        });

        process.on('error', (err) => {
            console.error("[yt-dlp] Spawn error:", err);
        });

        process.on('close', (code) => {
            console.log(`[yt-dlp] Process exited with code ${code}`);
        });
        const resource = createAudioResource(process.stdout, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true 
        });

        resource.playStream.on('error', () => process.kill());
        resource.playStream.on('end', () => process.kill());

        return resource

    } catch (error) {
        console.log(error)
        return
    }
}