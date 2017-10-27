var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');
var settings = require('./settings.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: settings.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');

    bot.joinVoiceChannel('373191844319854592', function(error, events) {
      if (!error) {
        bot.getAudioContext('373191844319854592', function(error, stream) {
          if (!error) {
            setInterval(function() {
              var fi = fs.createReadStream('sounds/radioxurume.mp3');
              fi.pipe(stream, {end: false});

              stream.on('done', function() {
                fi.close();
              });
            }, 2 * 60 * 1000);
          } else {
            logger.info(error);
          }
        });
      } else {
        logger.info(error);
      }
    });
});
