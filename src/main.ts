var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');
var userAuth = require('../auth.json');
var path = require('path');
var settings = require('../settings.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var nodeModulesBinPath = path.join(__dirname, '..')
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
    token: userAuth.token,
    autorun: true
});

var channelId: string = '373191844319854592';
var audioPath: string = 'sounds/radioxurume.mp3';

bot.on('ready', (evt) => {
    logger.info('Logged in as: ' + bot.username + ' - (' + bot.id + ')');

    bot.joinVoiceChannel(channelId, (error, events) => {
      if (!error) {
        bot.getAudioContext(channelId, (error, stream) => {
          if (!error) {
            setInterval(() => {
              var fi = fs.createReadStream(audioPath);

              logger.info('Playing audio...')
              fi.pipe(stream, {end: false});

              stream.on('done', () => {
                fi.close();
              });
            }, settings.loopInterval);
          }
        });
      }
    });
});
