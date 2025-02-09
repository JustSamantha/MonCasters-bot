import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping2')
    .setDescription('Replies with Pong!'),
  async execute(interaction:any) {
    await interaction.reply('Pong!');
  },
};