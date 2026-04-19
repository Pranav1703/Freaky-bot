import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";
import { AudioPlayerStatus } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
                        .setName("pause")
                        .setDescription("Pause the currently playing Track.")

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
    if(guildPlayer.player.state.status === AudioPlayerStatus.Playing){
        return interaction.reply("player is already in 'paused' state.")
    }
    guildPlayer.player.pause()
    interaction.reply("player paused.")
}
