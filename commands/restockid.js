const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');
const Datas = require('../model/playerSchema');
const {OWNERID,} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("restockcid")
        .setDescription('Restocking Product')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Add Code Product')
            .setRequired(true)
            )
        .addStringOption(option => option
                .setName("username")
                .setDescription('Add Username Bot')
                .setRequired(true)
                )
        .addStringOption(option => option
                .setName("password")
                .setDescription('Add Password Bot')
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
                    {Username:`${interaction.options.getString("username")}`, Password:`${interaction.options.getString("password")}`},
                ],$slice: -100} } },
                );

                const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Sucssesful Added CID`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .addField('\u200b',`Username : **${interaction.options.getString("username")}**\nPassword : **${interaction.options.getString("password")}**`, true)
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