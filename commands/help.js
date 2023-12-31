const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription('See All Commands Here'),
        
        async execute(interaction){
            const embed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Help Command`)
            .addField('List Commands', '\n**/setuser | Set your GrowID to database\n/stock | Product list & stock\n/buy [KODE] | Buys product with code\n/buyrdp [KODE] | Buys rdp with code and get role rdp\n/balance | Check your user balance\n/deposit | Cek World Depo\n/checkuser | Check User In Growtopia**', true)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            })
        }
}