const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');
const {OWNERID,ADMINID,WL,ARROW} = require("../config.json");
module.exports= {
    data: new SlashCommandBuilder()
        .setName("changeproduct")
        .setDescription('Change product info from database!')
        .addStringOption(option => option
            .setName("kode1")
            .setDescription('Kode Produk yang mau diganti')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("kode2")
            .setDescription('Kode Produk yang mau diganti')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("desc")
            .setDescription('Deskripsi Produk')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("harga")
            .setDescription('Harga Produk')
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
                const rdps = await Rdp.findOne({ type: { $eq: interaction.options.getString('kode1').toUpperCase() }})
                //CreateDB
                if (rdps) {
                    await Rdp.updateOne(
                        { type: interaction.options.getString("kode1").toUpperCase() },
                        { nama: interaction.options.getString('desc') }
                    );
                    await Rdp.updateOne(
                        { type: interaction.options.getString("kode1").toUpperCase() },
                        { harga: interaction.options.getString('harga') }
                    );
                    await Rdp.updateOne(
                        { type: interaction.options.getString("kode1").toUpperCase() },
                        { type: interaction.options.getString("kode2").toUpperCase() }
                    );
                    const embede = new MessageEmbed()
                    .setColor(`RANDOM`)
                    .setTitle(`Changed product with code ${interaction.options.getString('kode1').toUpperCase()}!`)
                    embede.addField('\u200b', `${ARROW} Kode : **${interaction.options.getString('kode2').toUpperCase()}**\n${ARROW} Deskripsi : **${interaction.options.getString('desc')}**\n${ARROW} Harga : **${interaction.options.getString('harga')}** ${WL}`, false)
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