const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {verif,world,DEPOWORLD,DEPOOWNER} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription('See Deposit Info Here!'),
        
        async execute(interaction){
            const embed = new MessageEmbed()
              .setColor("RANDOM")
            .setTitle(`${verif} World & Owner Deposit`)
            .addField('World Depo', `${world} World : **${DEPOWORLD}**\n${bot} Owner : **${DEPOOWNER}**`, true)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            await interaction.user.send({
                embeds: [embed],
                ephemeral: false
            });
            interaction.reply({ content: `Please check your DM!` ,ephemeral: true})
        }
}