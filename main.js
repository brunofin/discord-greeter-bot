var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');
var settings = require('./settings.json');
var path = require('path');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var nodeModulesBinPath = __dirname
  .concat(path.sep)
  .concat('node_modules')
  .concat(path.sep)
  .concat('ffmpeg-binaries')
  .concat(path.sep)
  .concat('bin');

if (!process.env.PATH.split(path.delimiter).includes(nodeModulesBinPath)) {
  process.env.PATH = nodeModulesBinPath
    .concat(path.delimiter)
    .concat(process.env.PATH);
}

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
        logger.info('Connected to Audio channel.')

        bot.getAudioContext('373191844319854592', function(error, stream) {
          if (!error) {
            logger.info('Got Audio Context.')

            setInterval(function() {
              var fi = fs.createReadStream('sounds/radioxurume.mp3');

              logger.info('Playing audio...')
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
