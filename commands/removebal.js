const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Datas = require('../model/playerSchema')
const {OWNERID,WL} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("removebal")
        .setDescription('remove balance')
        .addStringOption(option => 
            option.setName('user')
                    .setDescription('Mention user to remove the balance')
                    .setRequired(true))
                    .addStringOption(option => option
                        .setName("jumlah")
                        .setDescription('Total balance to remove')
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
                await Datas.findOneAndUpdate(
                  { discordid: interaction.options.getString("user") },
                  { $inc: { jumlah: -interaction.options.getString("jumlah") } }
                );
                const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(`Success to remove balance from <@${interaction.options.getString('user') }> for  ${interaction.options.getString('jumlah')} ${WL}`)
                .setTimestamp()
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: true});
            }
        }}