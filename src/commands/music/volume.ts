import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceBasedChannel } from "discord.js";
import queueManager from "../../services/queue/queueManager.js";
import { AudioPlayerStatus } from "@discordjs/voice";

export const data = new SlashCommandBuilder()
                        .setName("volume")
                        .setDescription("Sets the volume of current track.")
                        .addNumberOption(option=>
                            option
                                .setName("value")
                                .setDescription("volume value. Range: 0 - 100 %")
                                .setMinValue(0)
                                .setMaxValue(100)
                                .setRequired(true)
                        )

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
        return interaction.reply(
          'I am already playing in a different voice channel!',
        );
    }

    const guildId = interaction.guildId!
    const Val = interaction.options.getNumber("value") as number
    const volumeVal = Val / 100

    const playerHandler = queueManager.GetOrAddPlayerHandler(guildId)
    const player = playerHandler.player

    if(player.state.status === AudioPlayerStatus.Idle){
        return interaction.reply("player is idle.  Cant set volume.")
    }

    const volumeConfig = player.state.resource.volume
    if(!volumeConfig){
        return interaction.reply("cant set volume. server error")
    }
    volumeConfig.setVolumeLogarithmic(volumeVal)

    playerHandler.volume = volumeVal

    interaction.reply(`Player volume is set to ${Val}%.`)
}
