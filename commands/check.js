const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')
const {verif,bot,ARROW,WL} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription('Check Account Info!').addUserOption(option => option
            .setName("user")
            .setDescription('Mention user to check')
            .setRequired(true)
            ),
            
        async execute(interaction){
            //FromDB
            const datas = await Datas.findOne({ discordid: { $eq: interaction.options.getUser('user').id }})

            if (!datas) {
                interaction.reply({ content: `User not found!` ,ephemeral: true});
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
        
            await interaction.reply({ embeds: [ embed ] ,ephemeral: true});
    }
}