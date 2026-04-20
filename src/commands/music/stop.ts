import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";
 
export const data = new SlashCommandBuilder()
                        .setName("stop")
                        .setDescription("Stops playing and clears the queue.")

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
    const player = guildPlayer.player

    const end = player.stop()
    if(!end) {
        console.log("failed to stop playing.")
    }

    guildPlayer.queue = []
    interaction.reply("Player stopped. Queue is cleared.")
}
