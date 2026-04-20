import { AudioPlayer, AudioResource, createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";

type PlayerHandler = {
    player: AudioPlayer;
    queue: string[]
}

class GuildQueueManager {

    private guildMap: Map<string, PlayerHandler>;

    constructor() {
        this.guildMap = new Map()
    }

    GetOrAddPlayerHandler(guildId: string) {
        let gq = this.guildMap.get(guildId)
        if(!gq){
            const newPlayer = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Stop,
                },
            });
            gq = {
                player: newPlayer,
                queue: []
            }
            this.guildMap.set(guildId,gq)
        }
        return gq
    }
}

const queueManager = new GuildQueueManager()

export default queueManager