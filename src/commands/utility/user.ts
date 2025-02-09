import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction:any) {
		const guildMember:GuildMember = interaction.member;
		if (guildMember) {
			await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${guildMember.joinedAt}.`);
		}
	},
};
