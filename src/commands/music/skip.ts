import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";
import { searchAndCreateAudioStream } from "../../services/yt/search.js";

export const data = new SlashCommandBuilder()
                        .setName("skip")
                        .setDescription("Skips the current song.")

export async function execute(interaction:ChatInputCommandInteraction) {

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    if (!channel) {
        interaction.ephemeral = true
        return interaction.reply({
            content: "You must be in a voice channel to use this command!",
        });
    }
    
    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.editReply(
          'I am already playing in a different voice channel!',
        );
    }

    const guildId = interaction.guildId!
    
    const playerHandler = queueManager.GetOrAddPlayerHandler(guildId)
    const queue = playerHandler.queue
    const player = playerHandler.player

    const nextSongQuery = queue.shift()
    if(!nextSongQuery) return interaction.reply("queue is empty.")
    
    const audioStream = await searchAndCreateAudioStream(nextSongQuery)
    if(!audioStream){
        interaction.reply("server error. Cant search or create audio resource for player.")
        return
    }
    player.play(audioStream)
    interaction.reply("Skipped Current song. Playing next song in the queue")
}
