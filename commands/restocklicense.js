const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')
const {OWNERID} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("restocklicense")
        .setDescription('Restocking Product')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Add Code Product')
            .setRequired(true)
            )
        .addStringOption(option => option
                .setName("license")
                .setDescription('Add License')
                .setRequired(true)
                ),
            
            
        async execute(interaction){
            if (interaction.member.roles.cache.has(OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(OWNERID))
                return;
            }else{
                const TambahLicense = await Rdp.updateOne(
                    { 'type': interaction.options.getString("kode").toUpperCase()},
                        { $push: { 'data': {$each:[
                    {License:`${interaction.options.getString("license")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Sucssesful Added License`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`License : **${interaction.options.getString("license")}**\n`, true)
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
                
                TambahLicense;
                await interaction.reply({ 
                    embeds: [embed],
                    ephemeral: true
                });
            }
    }
}