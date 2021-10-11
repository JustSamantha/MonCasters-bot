const { Client, Intents } = require('discord.js');
const { token } = require('./config/secret.json').discordApi;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Ready!');
  const channel = client.channels.cache.get('838838622828232704');
  channel.send('MonCasters bot ready!');
  channel.send('Hello world!');
});

client.login(token);
