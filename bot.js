var Discord = require('discord.io');
var logger = require('winston');
var fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: 'MzczMjI4NDUxOTUzNjM5NDM0.DNProA.Hamg0vR8MZ9DpdHbmF3U_uPAkrg',
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');

    bot.joinVoiceChannel('Radio-XURUME', function(error, events) {
      if (!error) {
        bot.getAudioContext('Radio-XURUME', function(error, stream) {
          if (!error) {
            soundloop(stream, 'radioxurume.mp3', 2 * 60 * 1000);
          }
        });
      }

    });
});

var soundloop = function(stream, audio, interval) {
  setTimeout(function() {
    fs.createReadStream('radioxurume.mp3').pipe(stream, {end: false});

    stream.on('done', function() {
       soundloop(stream, audio);
    });
  }, interval);
};
