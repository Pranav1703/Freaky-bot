import { Message } from "discord.js";

//currently not using.
export function messageResponse(message: Message<boolean>){
    if(!message.author.bot){
        
        console.log(message)

        switch (message.author.globalName) {
            case "ImMoRtAl LoRd":
                message.reply({
                    content:"?No more W gaming?"
                })
                break;
            
            case "Abhi005":
                message.reply({
                    content:"8.7 years."
                })
                break;
            
            case "73.53.2532.53.01":
                message.reply({
                    content:`
                        Remainder!
                        u need to install and finish elden ring dlc.
                    `
                })
                break;

            case "rahul":
                message.reply({
                    content:"total living creatures in your basement: 429"
                })
                break;    
            
            default:
                break;
        }
    }
}
