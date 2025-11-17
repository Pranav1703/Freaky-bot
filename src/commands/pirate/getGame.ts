import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder,
    AttachmentBuilder
} from "discord.js";
import { GetGameFromFg } from "../../pirate/fitgirl";
import { FgRes } from "../../types/types";
import * as fs from 'fs';
import * as path from 'path';

export const data = new SlashCommandBuilder()
                        .setName("FetchTorrent")
                        .setDescription("Retrieves Torrent file and Magnet link to download the game.")
                        .addStringOption(option=>
                            option.setName("title")
                            .setDescription("Game title to search")
                            .setRequired(true)
                            );


export async function execute(interaction:ChatInputCommandInteraction) {
    const gameTitle = interaction.options.getString("title") as string
    const result:FgRes = await GetGameFromFg(gameTitle)

    await interaction.reply(`Searching for ${gameTitle} Torrent links...`)

    const files = fs.readdirSync('./downloads');
    const torrentFilePath = path.join("./downloads",files[0])
    const TorrentFile = new AttachmentBuilder(torrentFilePath);

    const resultEmbed = new EmbedBuilder()
            .setTitle(`**${result.Title}**`)
            .setDescription(`**Magnet Link** -> [Link](${result.MagnetLink})\n*or*\n**Download Torrent File**`)
            // .addFields(
            //   {
            //     name: "The first inline field.",
            //     value: "This field is inline.",
            //     inline: true
            //   },
            // )
            .setColor("#0083a3")
            .setTimestamp();
    await interaction.editReply({embeds: [resultEmbed],files: [TorrentFile]})    
    fs.rmSync(torrentFilePath)

}   