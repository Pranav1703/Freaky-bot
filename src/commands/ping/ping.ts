import { 
    ChatInputCommandInteraction, 
    SlashCommandBuilder,
    EmbedBuilder 
} from "discord.js";

const statusString = (wsPing: number,commandPing: number): string=> {
    return `
            \nWebSocket ping: ${wsPing}ms\nCommand latency: ${commandPing}ms
           `    
}

const calcTimeSince = (): string =>{

    const startDate = new Date("2016-01-01");
    const endDate = new Date();

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += previousMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return `its been ${years} years, ${months} months, ${days}days since u started league.`
}

export const data = new SlashCommandBuilder()
                        .setName("ping")
                        .setDescription("pinging the bot to check if the bot connection is alive")

export async function execute(interaction:ChatInputCommandInteraction){

    switch (interaction.member?.user.username) {

        case "immortal_lord_":
            interaction.reply({
                content:"?No more W gaming?"
            })
            break;
        
        case "abhinivesh5":
            interaction.reply({
                content: calcTimeSince()
            })
            break;
        
        case "73.53.2532.53.01":
            interaction.reply({
                content:`Remainder!\nu need to install and finish elden ring dlc.`
            })
            break;
        case "rahult":
            interaction.reply({
                content:"total living creatures in your basement: 429"
            })
            break;

        default:
            const resp = await interaction.reply({
                content: `pinging...`,
                fetchReply: true
                
            })

            const pingEmbed = new EmbedBuilder()
                                    .setTitle("Pong!")
                                    .setDescription(statusString(interaction.client.ws.ping,(resp.createdTimestamp - interaction.createdTimestamp)))
                                    .setTimestamp();

            interaction.editReply({
                content: "",
                embeds:[pingEmbed]
            })
            
            break;
    }
}