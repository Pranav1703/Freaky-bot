import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder,
    AttachmentBuilder
} from "discord.js";

import { FgRes } from "../../types/types";
import * as fs from 'fs';
import * as path from 'path';
import { GetGameFromFg } from "../../utils/fitgirl.js";

export const data = new SlashCommandBuilder()
                        .setName("fetchtorrent")
                        .setDescription("Retrieves Torrent file and Magnet link to download the game.")
                        .addStringOption(option=>
                            option.setName("title")
                            .setDescription("Game title to search")
                            .setRequired(true)
                            );


export async function execute(interaction:ChatInputCommandInteraction) {
    await interaction.deferReply()
    try{
        const gameTitle = interaction.options.getString("title") as string
        const result:FgRes = await GetGameFromFg(gameTitle)

        const files = fs.readdirSync('./downloads');
        const magnetFilePath = path.join("./downloads", "magnet.txt");
        fs.writeFileSync(magnetFilePath, result.MagnetLink);
        const magnetFileAttachment = new AttachmentBuilder(magnetFilePath);

        const resultEmbed = new EmbedBuilder()
                .setTitle(`**${result.Title}**`)
                .setDescription(`Copy the Magnet Link from the attached 'magnet.txt' *or* Download Torrent File attached above`)
                .setColor("#0083a3")
                .setTimestamp();

        if (files.length === 0) {
            let description = `Copy the Magnet Link`
            resultEmbed.setDescription(description)
            await interaction.editReply({embeds: [resultEmbed], files: [magnetFileAttachment]})
            return
        }

        const torrentFilePath = path.join("./downloads",files[0])
        const TorrentFile = new AttachmentBuilder(torrentFilePath);
        await interaction.editReply({embeds: [resultEmbed],files: [TorrentFile,magnetFileAttachment]}) 

        fs.rmSync(torrentFilePath)
        fs.rmSync(magnetFilePath);
    }catch(err){
        console.error(err);
        await interaction.editReply({ 
            content: "An error occurred. The game could not be found or the scraper failed.",
            embeds: [],
            files: []
        });
    }
}   