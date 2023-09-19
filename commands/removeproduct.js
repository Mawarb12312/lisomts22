const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');
const {OWNERID,ADMINID} = require("../config.json");
module.exports= {
    data: new SlashCommandBuilder()
        .setName("removeproduct")
        .setDescription('Remove product from database!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Code Product')
            .setRequired(true)
            ),
        async execute(interaction){
            if (interaction.member.roles.cache.has(OWNERID) === false ) {
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
		        console.log(interaction.user.username + " : Role Owner :" +interaction.member.roles.cache.has(OWNERID))
		        console.log(interaction.user.username + " : Role CO Owner :" +interaction.member.roles.cache.has(ADMINID))
                return;
            }
            else{
                //FromDB
                const rdps = await Rdp.findOne({ type: { $eq: interaction.options.getString('kode').toUpperCase() }})
                //RemoveDB
                if (rdps) {
                        await Rdp.findOneAndDelete({
                        type: interaction.options.getString('kode').toUpperCase()
                    })
                    const embede = new MessageEmbed()
                    .setColor(`RANDOM`)
                    .setDescription(`Deleted the product!`)
                    interaction.reply({ embeds: [ embede ] ,ephemeral: false});
                    return
                }
                //Embed
                else {
                    const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(`Try different product code!`)
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
                }
            }
        }
}