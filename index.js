//
//imports of required utils
require("dotenv").config();
const {MessageEmbed,Client,Intents, CategoryChannel}=require("discord.js");
const extractUrls = require("extract-urls");

const _PREFIX = "-";

///
///Discord Client
const client = new Client({
    intents:[
        Intents.FLAGS.GUILDS, //adds server functionality
        Intents.FLAGS.GUILD_MESSAGES //gets messages from our bot.
    ]
});

//
//Discord Message Handler
client.on('messageCreate', (message) => 
{
    //
    //Binding message listener to a channel
    //if(message.channel.id != '887680447155429376') return;
    //if(message.author.id == "975672156098789386") message.channel.send('hello madam');
    
    //
    //if the message is sent by bot , then nothing will happen
    if(message.author.bot) return;

    //
    //Checking for prefix to confirm the message is command
    if (message.content.startsWith(_PREFIX))
    {
        const [CMD_NAME, ...args] = message.content
          .trim()
          .substring(_PREFIX.length)
          .split(/\s+/);

        //
        //Help Command
        if(CMD_NAME === 'help')
        {
          const _title = '__Commands Supported__';
          const cmdList = '***'+_PREFIX+'new [channelName_1] [channelName_2] ...*** \n Command to create a text channel(input Parameters are channel names with spaces) \n \n'+
                          '***'+_PREFIX+'newc [categoryName] [channelName_1] [channelName_2] ...*** \n Command to create a text channel under a category(input Parameters are category and channel names with spaces) \n \n'+
                          '***'+_PREFIX+'delete [channelName_1] [channelName_3] ...*** \n Command to delete a text channel(input Parameters are channel names with spaces) \n \n'+
                          '***'+_PREFIX+'rename [name of the oldChannel] [name of the newChannel]*** \n Command to rename the channel given \n \n'+
                          '***'+_PREFIX+'moveto [name of the channel] [name of the category (with spaces if contains)] *** \n Command to move the channel to given category \n \n'+
                         '***'+_PREFIX+'find [name of the channel]*** \n Command to find the channel given \n \n'+
                         '***'+_PREFIX+'trim [text of links]*** \n Command to get links from the given text \n \n';
          
          const exampleEmbed = new MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle(_title).setDescription(cmdList);
          
          message.channel.send({embeds: [exampleEmbed]});
        }

        //
        //Creating new text Channel
        else if(CMD_NAME === 'new')
        {
          try
          {
            if(args.length >= 1)
            {
              args.forEach(_channels);
              function _channels(channelName)
              {
                message.guild.channels.create(channelName,{type:'text'})
                    .then( data =>{
                        message.channel.send('channel created : '+ message.guild.channels.cache.find(channel => channel.name === channelName).toString());
                    });
              }
            }
          }
          catch(err)
          {
            console.log('err : ',err);
            message.channel.send('please enter valid details \n typein "-help" for commands list');
          }

        }

        //
        //Creating new text Channel under a category
        else if(CMD_NAME === 'newc')
        {
          try
          {
            if(args.length >= 1)
            {
              const cID = message.guild.channels.cache.find(channel => channel.name === args[0]);

              args.shift();
              args.forEach(_channels);
              function _channels(channelName)
              {
                message.guild.channels.create(channelName,{type:'text',parent:cID})
                    .then( data =>{
                        message.channel.send('channel created : '+ message.guild.channels.cache.find(channel => channel.name === channelName).toString());
                    });
              }
            }
          }
          catch(err)
          {
            console.log('err : ',err);
            message.channel.send('please enter valid details \n typein "-help" for commands list');
          }

        }

        //
        //Deleting new text Channel
        else if(CMD_NAME === 'delete')
        {
          try
          {
            args.forEach(channels);
            function channels(channelName)
            {
              if(args.length >= 1)
              {
                const cID = message.guild.channels.cache.find(channel => channel.name === channelName).id;
                const fetchedChannel = message.guild.channels.cache.get(cID);

                fetchedChannel.delete().then( data =>{
                    message.channel.send('channel deleted : '+channelName);
                });
              }
            }
          }
          catch(err)
          {
            message.channel.send('please enter valid details \n typein "-help" for commands list');
          }
        }

        //
        //Extracting URLs from given text
        else if(CMD_NAME === 'trim')
        {
            var URLs = extractUrls(JSON.stringify(args));
            var _links = "";
            URLs.forEach(
                link =>
                {
                    client.channels.cache.get('923432475869466716').send(JSON.stringify(link).replace('"','').replace('"',''));
                }
            );
        }

        //
        //Finding the given channel
        else if(CMD_NAME === 'find')
        {
            try
            {
              message.channel.send("Channel found : "+ message.guild.channels.cache.find(channel => find(channel.name)).toString());
            }
            catch(err)
            {
              message.channel.send("Channel not found");
            }

            function find(channel)
            {
              const _object = channel.match(args[0]);
              if(_object != null)
                return _object.input;
            }

        }

        //
        //Rename the given channel
        else if(CMD_NAME === 'rename')
        {
            try
            {
                var ChannelName = message.guild.channels.cache.find(channel => channel.name === args[0]);
                ChannelName.setName(args[1]);
            }
            catch(err)
            {
                message.channel.send("Unable to rename");
            }

        }

        //
        //change the category of given channel
        else if(CMD_NAME === 'moveto')
        {
          const categoryChannels = message.guild.channels.cache.filter(channel => channel.type === "category");

          categoryChannels.forEach(channel => {
              console.log(`Category ${channel.name} has ${channel.children.size} channels`);
          });

            try
            {
              if(args[0].includes(','))
              {
                const _ChannelList = args[0].split(',');
                args.shift();

                _ChannelList.forEach(_channels);
                function _channels(_channelName)
                {
                  var ChannelName = message.guild.channels.cache.find(channel => channel.name === _channelName);
                  ChannelName.setParent(message.guild.channels.cache.find(channel => channel.name === args.join(' ')));
                }
              }
              else
              {
                var ChannelName = message.guild.channels.cache.find(channel => channel.name === args[0]);
                var cat = message.guild.channels.cache.find(channel => channel.name === args.join(' '));

                args.shift();
                ChannelName.setParent(message.guild.channels.cache.find(channel => channel.name === args.join(' ')));
              }
                
            }
            catch(err)
            {
              message.channel.send("Unable to move");
            }
          }

        else
        {
          message.channel.send('please enter valid details \n typein "-help" for commands list');
        }
    }

});

//
//Bot Login
client.login(process.env.BOT_TOKEN);