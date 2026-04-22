import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queueManager.js";
import { AudioPlayerStatus } from "@discordjs/voice";
import { Metadata } from "../../types/types.js";
 
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
    const player = playerHandler.player

    if(player.state.status !== AudioPlayerStatus.Idle){
        const currentResource = player.state.resource
        if(currentResource.metadata){
            const metadata = (currentResource.metadata as Metadata)
            metadata.process.kill('SIGKILL')
            console.log("Forcibly killed active yt-dlp process.");
        }
    }
    
    const end = player.stop()
    if(!end) {
        console.log("failed to stop playing.")
    }
    playerHandler.queue = []
    
    interaction.reply("Player stopped. Queue is cleared.")
}
