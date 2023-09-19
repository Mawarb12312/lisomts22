const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')
const {verif,bot,WL,ARROW} = require("../config.json");
module.exports={
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription('Check Balance!'),
            
        async execute(interaction){
            //FromDB
            const datas = await Datas.findOne({ discordid: { $eq: interaction.user.id }})

            if (!datas) {
                interaction.reply({ content: `Set Growid /setuser <namabot>` ,ephemeral: true});
                return
            }

            let JsonStringfy = await JSON.stringify(datas)
            let JsonRill = await JSON.parse(JsonStringfy)

            //Embed
            const embed = new MessageEmbed()
             .setColor(`RANDOM`)
            .setTitle(`${verif} Account Info in ${interaction.guild.name}`)
            .addField(`${bot} GrowID`, `**${ARROW} ${JsonRill.namaplayer.toString()}**`, true)
             .addField(`${WL} Balance`, `**${ARROW} ${JsonRill.jumlah.toString()}**`, true)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            await interaction.user.send({
                embeds: [embed],
                ephemeral: false
            });
            
            const jokomo = new MessageEmbed()
            .setColor(`RANDOM`)
            .setDescription(`Please check your DM!`);
            await interaction.reply({ embeds: [ jokomo ] ,ephemeral: true})
        }
}