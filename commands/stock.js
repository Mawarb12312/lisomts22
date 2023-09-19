const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const {ARROW,WL,} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("stock")
        .setDescription('Shop Stock Here!'),
            
        async execute(interaction){
            const findalltypebarang = await Rdp.aggregate([{$group:{_id: "$typebarang",count: { $count : {} }}},{"$sort": {_id: 1}}])    
            async function jsonParsing(datas){
                const toJsons = await JSON.stringify(datas)
                const finals = await JSON.parse(toJsons)
                return finals
            }

            async function setFindByType(matchtipe){
                const datas = await Rdp.aggregate([{$match : { typebarang : matchtipe }},{$project:{_id: 0,sum: 1, typebarang:"$typebarang",namatipe:"$type",desc:"$nama",harga:"$harga",stok:{$size:"$data"}}},{"$sort": {namatipe: 1}}])
                const JsonRill = await jsonParsing(datas)
                return JsonRill
            }          
            
            const tipebarang = await jsonParsing(findalltypebarang)

            ///DATA SECTION
            const TCID = await setFindByType("PRODUCTS")
            // console.log(tipebarang) 
            
            const ShopRdp = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`**Farhan Store Product List**`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()});
            for (let i = 0; i < tipebarang[0].count; i++) {
                if(TCID[i].stok === 0) {
                    ShopRdp.addField('\u200b', `${ARROW} Kode : **${TCID[i].namatipe.toString()}**\n${ARROW} Nama: **${TCID[i].desc.toString()}**\n${ARROW} Stok: **No Stok**\n${ARROW} Harga: **${TCID[i].harga.toString()}** ${WL}`, true)
                }else
                ShopRdp.addField('\u200b', `${ARROW} Kode : **${TCID[i].namatipe.toString()}**\n${ARROW} Nama: **${TCID[i].desc.toString()}**\n${ARROW} Stok: **${TCID[i].stok.toString()}**\n${ARROW} Harga: **${TCID[i].harga.toString()}** ${WL}`, true)
            };
            await interaction.reply({ embeds: [ ShopRdp ] ,ephemeral: false});
    }
}