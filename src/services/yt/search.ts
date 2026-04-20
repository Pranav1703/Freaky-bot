import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import { spawn } from "child_process";

export async function searchAndCreateAudioStream(query: string): Promise<AudioResource<null> | undefined>{
    try {
        const target = query.startsWith('http') ? query : `ytsearch1:${query}`;

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
        });
        resource.playStream.on('error', (err) => { console.log("Killing process due to ERROR:",err); process.kill() });
        resource.playStream.on('end', () => { console.log("Killing process. Playing ended."); process.kill() });

        return resource

    } catch (error) {
        console.log("cant create a active audio stream: ",error)
        return
    }
}