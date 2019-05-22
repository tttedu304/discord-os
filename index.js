var discord = require("discord.js");
var fs = require("fs");
var client = new discord.Client();
var config = require("./config.json");
var request = require('request');
global.userLibrary = {}
global.userCWD = {}
args = process.argv
require("./preloadedPrograms")
function loadProgramJS(name, library, message, callback) {
  require(`./${name}`)(library, message, callback)
}
loadProgram = require('./loader')
function censor(censor) {
    var i = 0;
  
    return function(key, value) {
      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
        return '[Circular]'; 
  
      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
        return '[Unknown]';
  
      ++i; // so we know we aren't using the original object anymore
  
      return value;  
    }
  }
client.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type != "dm") {
    everyone = message.guild.roles.find(r => r.name == "@" + "everyone");
    }
    if (message.channel.name != `discord-os-session-${message.author.id}` && message.channel.type != "dm") {
      if(message.content != "discordos!channel" && message.mentions.users.first() && message.mentions.users.first().id == client.user.id) {
        message.channel.send("You can start a session either by dm (That starts whenever you send a message) or by a server channel (To start this type of session send the command \`discordos!channel\` here)")
      } else if (message.content == "discordos!channel") {
        message.guild.createChannel(`discord-os-session-${message.author.id}`, "text").then(chnl => {
          chnl.overwritePermissions(everyone, {VIEW_CHANNEL: false})
          chnl.overwritePermissions(message.author.id, {VIEW_CHANNEL: true})
          chnl.overwritePermissions(client.user.id, {VIEW_CHANNEL: true})
          chnl.send("Session started, send \`disconnect\` to end session")
        })
      }    
    } else {
      if (!global.userLibrary[message.author.tag]) {
        message.channel.send("No data library available, `load` a library or create a `new` one?")
        if (message.content == "new") {
          message.channel.send("Creating data library...")
          global.userLibrary[message.author.tag] = {}
          global.userCWD[message.author.tag] = "/"
          loadProgramJS("setupWizard", global.userLibrary[message.author.tag], message, (library) => {
            global.userLibrary[message.author.tag] = library
          })
          message.channel.send(new discord.Attachment(Buffer.from(
            JSON.stringify(global.userLibrary[message.author.tag])
          ), `${message.author.id}.library`))
          message.channel.send("Library loaded succesfully, don't forget to save the library before disconnecting with `library save`")
        }
        if (message.content == "load") {
            message.channel.send("Please, send a message with the library data attached")
            const filter = m => m.author.id == message.author.id && m.attachments.first() && m.attachments.first().filename.endsWith(".library");
            var collector = message.channel.createMessageCollector(filter)
            collector.on("collect", (message) => {
                request(message.attachments.first().url, (err, res, body) => {
                    message.delete()
                    collector.stop()
                    var data = JSON.parse(body)
                    global.userLibrary[message.author.tag] = data
                    global.userCWD[message.author.tag] = "/"
                    message.channel.send("Library loaded succesfully, don't forget to save the library before disconnecting with `library save`")
                })
            })
            
        }
      } else {
        if (message.content == "disconnect") {
          if (message.channel.type == "dm") {
            message.channel.send("Removing library from server...")
            delete global.userLibrary[message.author.tag]
          } else {
            message.channel.send("Removing library from server...")
            delete global.userLibrary[message.author.tag]
            message.channel.send("Disconnecting...")
            message.channel.delete()
          }
          return
        }
        if (message.content == "library save") {
          message.channel.send(new discord.Attachment(Buffer.from(
            JSON.stringify(global.userLibrary[message.author.tag])
          ), `${message.author.id}.library`))
        }
        loadProgram(message.content.split(" ")[0], global.userLibrary[message.author.tag], message, global.userCWD[message.author.tag])
        
      }
    }
});
/*
          permissionOverwrites: [{
            role: everyone,
            deny: ["VIEW_CHANNEL"]
          },
          {
            id: message.author.id,
            allow: ["VIEW_CHANNEL"]
          }]
*/
if (process.env.TOKEN) {
  client.login(args[2]);
} else {
  client.login(config.token);
}
