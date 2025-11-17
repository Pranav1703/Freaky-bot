import { Collection } from 'discord.js';
import { Interaction, SlashCommandBuilder } from 'discord.js';

interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: Interaction) => Promise<void>;
}


declare module "discord.js" {
    export interface Client{
        commands: Collection<string,Command>
    }
}

export type FgRes = {
    Title: string,
    MagnetLink: string,
}