const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const Rdp = require('../model/rdpSchema')
const Datas = require('../model/playerSchema')
const History = require('../model/HistorySchema');
const {WL,NAME_ROLE_TOBUYER,ARROW,HISTORY_CHANNEL} = require("../config.json");

module.exports={
    data: new SlashCommandBuilder()
        .setName("buy")
        .setDescription('Buy Here!')
        .addStringOption(option => option
            .setName("kode")
            .setDescription('Tipe Produk')
            .setRequired(true)
            ).addStringOption(option => option
                .setName("jumlah")
                .setDescription('Howmuch To Buy')
                .setRequired(true)
                ),
            
        async execute(interaction){
            const IsHave = await Datas.findOne({ discordid: { $eq: interaction.user.id }})

            if(!IsHave){
                interaction.reply({ content: `Maaf Kamu Belum Setuser Growid /setuser (GrowID)` ,ephemeral: true});
                return
            }
            const datas = await Rdp.findOne(
            {type: interaction.options.getString("kode").toUpperCase()}
            )
            const datas2 = await Rdp.findOne(
                {type: interaction.options.getString("kode").toUpperCase()},{data:1 ,_id:0}
            )

            const bal = await Datas.findOne({ discordid: { $eq: interaction.user.id }})
            if (!datas) {
                interaction.reply({ content: `Kode Tidak ditemukan cari di /stock` ,ephemeral: true});
                return
            }
            let JsonStringfy = await JSON.stringify(datas)
            let JsonRill = await JSON.parse(JsonStringfy)

            let JsonStringfy1 = await JSON.stringify(datas2)
            let JsonRill1 = await JSON.parse(JsonStringfy1)

            if(interaction.options.getString("jumlah") < 0) {
                interaction.reply({ content: `You can't use negative number!` ,ephemeral: true});
                return
            }
            if(JsonRill.data.length === 0 ){
                interaction.reply({ content: `Stock **${JsonRill.nama}** Habis` ,ephemeral: true});
                return
            }
            else if(JsonRill.data.length < interaction.options.getString("jumlah") ){
                interaction.reply({ content: `Stock **${JsonRill.nama}** Tidak cukup!` ,ephemeral: true});
                return
            }
            
            let JsonBalance = await JSON.stringify(bal)
            let JsonRill2 = await JSON.parse(JsonBalance)
            const totalwl = await JsonRill2.jumlah.toString()
            
            if(totalwl < JsonRill.harga*interaction.options.getString("jumlah")){
                interaction.reply({ content: `${WL} Kurang ${totalwl-JsonRill.harga} ` ,ephemeral: true});
                return
            }
            const stinkypoopoo = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${WL} Balance Now : ${totalwl-JsonRill.harga}`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
            .setDescription(`**Please check your DM!\nThank you for buying!\nDon't forget to reps at**\n\n<#1153240726897958932> **\n**<#1083724542373003334>\n<#1108290953644625991>\n<#1140437767084576918>`)

            await interaction.reply({ embeds: [ stinkypoopoo ] ,ephemeral: false});
            for (let i = 1; i <= interaction.options.getString("jumlah"); i++) {
                await Rdp.updateOne(
                    { type: interaction.options.getString("kode").toUpperCase() },
                    { $pop: { data: -1 } }
                )};
            
            await Datas.findOneAndUpdate({discordid: interaction.user.id},{ $inc: { jumlah: -JsonRill.harga*interaction.options.getString("jumlah")} })
            const embed = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${WL} Balance Now : ${totalwl-JsonRill.harga}`)
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`,iconURL: interaction.user.displayAvatarURL()})
            .addField(`Berhasil Membeli **${interaction.options.getString("jumlah")} ${JsonRill.nama}**\nDengan Harga : **${JsonRill.harga*interaction.options.getString("jumlah")}** ${WL}\n`, `\u200b`, true)
             for (let i = 0; i < interaction.options.getString("jumlah"); i++) {
                for (var key in JsonRill1.data[i]) {
                    
                    embed.addField(`**${key}** : ||${JsonRill1.data[i][key]}||`,`\u200b`, false)
                }}

                        
            await interaction.user.send({ embeds: [ embed ] ,ephemeral: true});
            if (interaction.member.roles.cache.has(NAME_ROLE_TOBUYER) === false ){
            await interaction.member.roles.add(NAME_ROLE_TOBUYER);
            }
        
              IsCount = await History.findOne({ no: { $eq: 0 }})
              if (!IsCount){
                await History.create({
                    no: 0,
                    discordid: 1,
                    namaplayer: "null",
                    typebarang: "null",
                    namabarang: "null",
                    hargabarang: 1,
                    data: "null",
                    jumlah: 1
                })
              }
            countsz = await History.aggregate([
                {
                  $group : 
                  {
                    _id : "",
                    last : 
                    {
                      $max : "$no"
                    }
                  }
                }]
            )
            const dogshit = new MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${ARROW} **#Order Number** : ${countsz[0].last+1}`)
            .setTimestamp()
            .setFooter({text: "Time"})
            .addField('\u200b', `${ARROW} Member : **${"<@" + interaction.user.id + ">"}**\n${ARROW} Kode Produk : **${interaction.options.getString("kode").toUpperCase()}** \n${ARROW} Berhasil Membeli : **${JsonRill.nama}**\n${ARROW} Jumlah : **${interaction.options.getString("jumlah")}**\n${ARROW} Dengan Harga : **${JsonRill.harga*interaction.options.getString("jumlah")}** ${WL}\n`, true)
            await interaction.guild.channels.cache.get(HISTORY_CHANNEL).send({embeds: [dogshit],ephemeral: false})
            dataz = await Datas.findOne({ discordid: { $eq: interaction.user.id }});
            
            for (let i = 0; i < interaction.options.getString("jumlah"); i++) {
                const ToHistory = JSON.stringify(JsonRill1.data[i]);
                await History.create({
                    no: countsz[0].last+1,
                    discordid: interaction.user.id,
                    namaplayer: dataz.namaplayer,
                    typebarang: interaction.options.getString("kode").toUpperCase(),
                    namabarang: JsonRill.nama,
                    hargabarang: JsonRill.harga*interaction.options.getString("jumlah"),
                    data: ToHistory,
                    jumlah: interaction.options.getString("jumlah")
                })};

    }
}