import { Command, Flag } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { errorEmbed } from '../../util/embed';
import { t, MESSAGES } from '../../constants';

export default class StopCommand extends Command {
  constructor() {
    super('stop', {
      aliases: ['stop'],
      description: {
        content: MESSAGES.HELP.STOP_DESCRIPTION,
        usage: MESSAGES.HELP.STOP_USAGE,
      },
      category: 'music',
      channel: 'guild',
      args: [
        {
          id: 'url',
          type: 'string'
        }
      ],
    });
  }

  async exec(message, args) {
    const queue = this.client.queue[message.guild.id];
    if (!queue || !queue.playing) {
        message.channel.send(MESSAGES.MUSIC_NOTHING_PLAYING);
        return;
    }
        
    let connection
    try {
      connection = message.guild.voice.connection;

      if (connection && connection.dispatcher) {
        await connection.dispatcher.destroy();
        if (queue) {
            queue.songs.shift();
            queue.playing = false;
        }
        message.channel.send(MESSAGES.MUSIC_STOPPED_PLAYBACK)
      }
    } catch (err) {
      console.error(err);
      return;
    }
  }
}