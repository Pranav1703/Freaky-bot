import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queueManager.js";
import { searchAndCreateAudioStream } from "../../services/search.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Metadata } from "../../types/types.js";

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

    if (player.state.status === AudioPlayerStatus.Idle) {
        return await interaction.reply("no song to skip. Player is idle.");
    }
    
    const currentResource = player.state.resource;
    if (currentResource?.metadata) {
        const metadata = (currentResource.metadata as Metadata);
        metadata.process.kill('SIGKILL');
        console.log("Forcibly killed active yt-dlp process for skip.");
    }

    player.stop();

    interaction.reply("Skipped Current song. Playing next song in the queue")
}
