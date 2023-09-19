const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {TOKEN,ENV,GUILD_ID} = require("../config.json");
module.exports= {
    name: "ready",
    execute (client,commands){
    client.user.setPresence({activities: [{name: "/help",type:"PLAYING"}]})
    console.log(`Logged in as ${client.user.tag}!`)

    const CLIEND_ID = client.user.id
    const rest = new REST({
      version: "9"
    }).setToken(TOKEN);

    (async ()=>{
      try {
          if (ENV === "production"){
          await rest.put(Routes.applicationCommands(CLIEND_ID),{ body: commands})
          console.log("Sucess Regist Global commands")
        }else{
          await rest.put(Routes.applicationGuildCommands(CLIEND_ID, GUILD_ID),{ body: commands});
          console.log("Sucess Regist Local commands")  
        }
      } catch (err) {
          if (err) console.error(err)
      }
    })()
    }
}