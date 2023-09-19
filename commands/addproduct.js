const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Rdp = require('../model/rdpSchema');
const {OWNERID,ADMINID,ARROW,WL} = require("../config.json");
module.exports= {
    data: new SlashCommandBuilder()
        .setName("addproduct")
        .setDescription('Add product to database!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Code Product')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("desc")
            .setDescription('Description Product')
            .setRequired(true)
            )
        .addStringOption(option => option
            .setName("harga")
            .setDescription('Price Product')
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
                //CreateDB
                if (!rdps) {
                        await Rdp.create({
                        typebarang: "PRODUCTS",
                        type: interaction.options.getString('kode').toUpperCase(),
                        nama: interaction.options.getString('desc'),
                        harga: interaction.options.getString('harga')
                    })
                    const embede = new MessageEmbed()
                    .setColor(`RANDOM`)
                    .setTitle(`Added new product!`)
                    embede.addField('\u200b', `${ARROW} Kode : **${interaction.options.getString('kode').toUpperCase()}**\n${ARROW} Deskripsi : **${interaction.options.getString('desc')}**\n${ARROW} Harga : **${interaction.options.getString('harga')}** ${WL}`, false)
                    interaction.reply({ embeds: [ embede ] ,ephemeral: false});
                    return
                }
                //Embed
                const embed = new MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(`Try different product code!`)
        
                await interaction.reply({ embeds: [ embed ] ,ephemeral: false});
            }
        }
}

