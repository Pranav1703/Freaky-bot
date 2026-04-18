class QueueManager {

    private queueMap: Map<String, Array<any>>;

    constructor() {
        this.queueMap = new Map()
    }

    addOrGetQueue(guildId: String) {
        if(!this.queueMap.has(guildId)){
            this.queueMap.set(guildId,[])
        }

        return this.queueMap.get(guildId) as any[]
    }
}

const queueManager = new QueueManager()

export default queueManager