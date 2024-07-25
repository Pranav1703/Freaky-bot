// import { Client, ClientOptions, Collection } from 'discord.js';
// export class ExtendedClient extends Client {
    
//     commands: Collection<string, Command>;

//     constructor(options: ClientOptions) {
//         super(options);
//         this.commands = new Collection();
//     }
// }

import { Command } from './command.js';
import { Collection } from "discord.js";
declare module "discord.js" {
    export interface Client{
        commands: Collection<string,Command>
    }
}