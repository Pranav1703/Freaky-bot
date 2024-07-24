import { Events } from "discord.js";
import { ExtendedClient } from "../types/extendedClient.js";

export const name = Events.ClientReady
export const once = true

export async function execute(client: ExtendedClient){
    console.log(`BOT ready. logged in as ${client.user?.username}`)
}