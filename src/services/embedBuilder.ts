import { EmbedBuilder } from "discord.js";

export default function createSongEmbed(title: string, duration: string, queueLen: number, thumbnail: string){
    const embed = new EmbedBuilder()
        .setTitle(`Now Playing - ${title}`)
        .addFields(
          {
            name: "Duration",
            value: duration,
            inline: false
          },
            {
              name: `Queue Length: ${queueLen}`,
              value: "",
              inline: false
            },
        )
        .setImage(thumbnail)
        .setColor("#54e8e5")
        .setTimestamp();
    return embed
}