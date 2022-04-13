import Discord from "discord.js";

interface PollOptions {
    client: Discord.Client;
    message?: string;
    title: string;
    description?: string;
    color?: Discord.ColorResolvable;
    itemlist: Array<string>;
    emojilist?: Array<string>;
    checkInterval?: number | "onChange";
    endDate: Date;
    anonymous?: boolean;
    allowMultiple?: boolean;
}

class Poll {
    client: Discord.Client;
    message: string;
    title: string;
    description: string;
    color: Discord.ColorResolvable;
    itemlist: Array<string>;
    emojilist: Array<string>;
    checkInterval: number | "onChange";
    endDate: Date;
    anonymous: boolean;
    allowMultiple: boolean;

    constructor(options: PollOptions) {
        this.client = options.client;
        this.message = options.message || null;
        this.title = options.title;
        this.description = options.description || "";
        this.color = options.color || "GOLD";
        this.itemlist = options.itemlist;
        this.emojilist = options.emojilist || [
            "0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟",
            "🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿",
        ];
        this.checkInterval = options.checkInterval || "onChange";
        this.endDate = options.endDate;
        this.anonymous = options.anonymous || false;
        this.allowMultiple = options.allowMultiple || false;

    }
    

    async start(channel: Discord.TextBasedChannel) {

        
        var voters = new Set();
        var totalVotes = 0;

        if (this.endDate.getTime() - Date.now() > 1209600000) {
            throw new Error("End date is more than 2 weeks away");
        }

        const embed = new Discord.MessageEmbed();
        embed.setTitle(this.title);
        embed.setDescription(this.anonymous ? "This poll is anonymous. You cannot take back your vote once casted.\n" + this.description : this.description);

        if (this.itemlist.length > this.emojilist.length) {
            throw new Error("Emojilist is not long enough to support all items");
        }
        
        for (let i = 0; i < this.itemlist.length; i++) {
            embed.addField(`${this.emojilist[i]} ${this.itemlist[i]}`, "`                    ` | 0% (0)");
        }

        embed.setColor(this.color);
        embed.setFooter({text: `Ends ${this.endDate.toLocaleString()}`});

        channel.send({content: this.message, embeds: [embed]})
            .then(async (msg: Discord.Message) => {
                for (let i = 0; i < this.itemlist.length; i++) {
                    await msg.react(this.emojilist[i]);
                }
                let filter = (reaction: Discord.MessageReaction, user: Discord.User) => {return true;}
                const collector = msg.createReactionCollector({ filter, time: this.endDate.getTime() - Date.now() })
                collector.on("collect", async (reaction: Discord.MessageReaction, user: Discord.User) => {
                    if (!this.allowMultiple && voters.has(user.id)) {
                        return reaction.users.remove(user);
                    }

                    if (!voters.has(user.id)) {
                        voters.add(user.id);
                    }

                    if (this.anonymous) {
                        reaction.users.remove(user);
                    }

                    let index = this.emojilist.indexOf(reaction.emoji.name);
                    if (index !== -1) {
                        let field = msg.embeds[0].fields[index];
                        let votes = parseInt(field.value.split(" ").join("").slice(6, 7));
                        votes++;
                        totalVotes++;
                        var arr = "                    ".split("");
                        field.value = `\`${arr.fill("█", 0, Math.round((votes / totalVotes) / 5) * 5).join("")}\` | ${Math.round((votes / totalVotes) * 100)}% (${votes})`;
                        await msg.edit({embeds: [msg.embeds[0]]});
                    }
                })
                collector.on("remove", async (reaction: Discord.MessageReaction, user: Discord.User) => {
                    if (this.anonymous) {
                        return;
                    }

                    let index = this.emojilist.indexOf(reaction.emoji.name);
                    if (index !== -1) {
                        let field = msg.embeds[0].fields[index];
                        let votes = parseInt(field.value.split(" ").join("").slice(6, 7));
                        votes--;
                        totalVotes--;
                        var arr = "                    ".split("");
                        field.value = `\`${arr.fill("█", 0, Math.round((votes / totalVotes) / 5) * 5).join("")}\` | ${Math.round((votes / totalVotes) * 100)}% (${votes})`;
                        await msg.edit({embeds: [msg.embeds[0]]});
                    }
                })
            });
            // TODO
            /*
            * redo percentage bars so that they all update when a vote is casted (or removed)
            * when the collector ends, update the footer, remove the reactions, and set the final results
            */

    }
}
