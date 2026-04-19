import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";
import { AudioPlayerStatus } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
                        .setName("resume")
                        .setDescription("Resumes the current track in the queue if it is paused.")


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
    if(guildPlayer.queue.length===0){
        return interaction.reply("queue is empty. No audio resource to resume playing.")
    }
    if(guildPlayer.player.state.status === AudioPlayerStatus.Playing){
        return interaction.reply("player is already in 'playing' state.")
    }
    guildPlayer.player.unpause()
    interaction.reply("Resumed Playing")
}



 