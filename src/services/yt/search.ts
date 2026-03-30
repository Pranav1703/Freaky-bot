import { createReadStream, createWriteStream } from "fs";
import { yt } from "./yt";
import { createAudioResource, StreamType } from "@discordjs/voice";
import { Readable } from "stream";

export async function searchAndGetAudioResource(query: string){
    const resp = await yt.search(query)
    console.log("--- logs --- \n")
    // console.log("videos: ", resp.results[0])
    const firstNode = resp.results[0];
    const videoId = firstNode.key("video_id").string()
    // console.log(videoId)
    const audioStream = await yt.download(videoId,{
        type: 'audio',
        codec: 'opus',
        quality: 'bestefficiency'
    })

    //converting web readableStream to node readableStream
    const nodeStream = Readable.fromWeb(audioStream as any)

    const audioResource = createAudioResource(nodeStream, {
        inputType: StreamType.OggOpus
    })
    return audioResource
}