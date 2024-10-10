import { usePlayer } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("stop")
                        .setDescription("Stops the currently playing track.")

export async function execute(interaction:ChatInputCommandInteraction) {
    
    const guildNode = usePlayer(interaction.guild?.id as string);
    if(guildNode===null){
        await interaction.reply("Player is idle.")
        return
    }
    guildNode.stop(true)
    await interaction.reply("Player stopped.")

}
