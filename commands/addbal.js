const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')
const {WL,OWNERID} = require("../config.json");
module.exports={
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription('Give balance to userID [Owner Only]')
        .addStringOption(option => 
            option.setName('user')
                    .setDescription('Add [DiscorID] user to give balance')
                    .setRequired(true))
                    .addStringOption(option => option
                        .setName("jumlah")
                        .setDescription('How much balance to add [Number]')
                        .setRequired(true)
                        ),
            
        async execute(interaction){
            
            if (interaction.member.roles.cache.has(OWNERID) === false ){
                await interaction.reply({ content: "No Admin Role" ,ephemeral: true});
                return;
            }else{
                const IsHave = await Datas.findOne({
                  discordid: { $eq: interaction.options.getString("user") },
                });
                if (!IsHave) {
                  interaction.reply({
                    content: `Sorry the user need to set growid [/setuser (GrowID)]`,
                    ephemeral: true,
                  });
                  return;
                }
                if(interaction.options.getString("jumlah") < 0) {
                  interaction.reply({ content: `You can't use negative number!` ,ephemeral: true});
                  return
              }
                await Datas.findOneAndUpdate(
                  { discordid: interaction.options.getString("user") },
                  { $inc: { jumlah: +interaction.options.getString("jumlah") } }
                );
                const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(`Success added balance to <@${interaction.options.getString('user') }> for ${interaction.options.getString('jumlah')} ${WL}`)
                .setTimestamp()
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
            }
        }}