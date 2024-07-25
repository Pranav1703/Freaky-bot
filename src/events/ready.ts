import { Events,Client } from "discord.js";

export const name = Events.ClientReady
export const once = true

export async function execute(client: Client){
    console.log(`BOT ready. logged in as ${client.user?.username}`)
}