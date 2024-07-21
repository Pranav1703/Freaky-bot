export function messageResponse(message) {
    if (!message.author.bot) {
        console.log(message);
        switch (message.author.globalName) {
            case "ImMoRtAl LoRd":
                message.reply({
                    content: "?No more W gaming?"
                });
                break;
            case "Abhi005":
                message.reply({
                    content: "8.7 years."
                });
                break;
            case "BetterCallBashu":
                message.reply({
                    content: `
                        Remainder!
                        u need to install finish elden ring dlc.
                    `
                });
                break;
            case "rahul":
                message.reply({
                    content: "total living creatures in your basement: 429"
                });
                break;
            default:
                break;
        }
    }
}
