import { Events, Interaction } from "discord.js";
import { client } from "../index.js";

export const name = Events.InteractionCreate

export async function execute(interaction: Interaction){
        
    if(!interaction.isCommand()){return}
    const command = client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
}