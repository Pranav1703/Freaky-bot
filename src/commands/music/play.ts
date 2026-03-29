import { ChatInputCommandInteraction,  GuildMember, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
                        .setName("play")
                        .setDescription("Plays the song by searching the track using query.")
                        .addStringOption(option=>
                            option.setName("query")
                            .setDescription("url or name of the song")
                            .setRequired(true)
                            );

                            

export async function execute(interaction:ChatInputCommandInteraction){

    if (!interaction.inGuild() || !interaction.guild) {
        return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    }

    const member = interaction.member as GuildMember
    const channel = member.voice.channel 

    if(!channel){
        interaction.ephemeral = true
        return interaction.reply({
            content:"You are not connected to a voice channel. Connect to a voice channel and try the command agian.",
        })

    }
    const query = interaction.options.getString("query") as string;


    

    try {
    } catch (error) {
        await interaction.editReply(`Something went wrong: ${error}`);
        console.log("something went wrong: ",error)
    }   
}