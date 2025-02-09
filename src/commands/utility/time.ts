import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with the current time'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply(Date());
	},
};
