import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";

export const data = new SlashCommandBuilder()
                        .setName("skip")
                        .setDescription("Skips the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {

    const member = interaction.member as GuildMember
    const channel = member.voice.channel as VoiceBasedChannel

    if (!channel) {
        interaction.ephemeral = true
        return interaction.reply({
            content: "You must be in a voice channel to use this command!",
        });
    }
    await interaction.deferReply();
    if (
    interaction.guild!.members.me!.voice.channel &&
    interaction.guild!.members.me!.voice.channel !== channel
    ) {
        return interaction.editReply(
          'I am already playing in a different voice channel!',
        );
    }

    const guildId = interaction.guildId!
    
    const guildPlayer = queueManager.GetOrAddPlayerHandler(guildId)
    const queue = guildPlayer.queue
    const player = guildPlayer.player

    const nextSong = queue.shift()
    if(!nextSong) return interaction.reply("queue is empty.")
    interaction.reply("Skipped Current song. Playing next song in the queue")
    player.play(nextSong)

}
