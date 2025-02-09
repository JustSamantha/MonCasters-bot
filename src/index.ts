import { Client, Collection, Events, MessageFlags, GatewayIntentBits } from 'discord.js';

const fs = require('node:fs');
const path = require('node:path');
const { token } = require('../config.json');

// interface DiscordClient<T> extends Client {
// 	commands
// }

const client:any = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildPresences,
] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log('[DEBUG] folderPath: ', foldersPath);

for (const folder of commandFolders) {
	console.log('[DEBUG] folder: ', folder);
	const commandsPath = path.join(foldersPath, folder);
	console.log('[DEBUG] commandsPath: ', commandsPath);
	const commandFiles = fs.readdirSync(commandsPath).filter((file:string) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		console.log('[DEBUG] command: ', command);
		if ('data' in command && 'execute' in command) {
			console.log('[DEBUG] Setting command: ', command.data.name);
			console.log('[DEBUG] Client set response: ', client.commands.set(command.data.name, command));
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, (readyClient:any) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	const channel: any = client.channels.cache.get('1239320263108329514');
  if (channel) {
    channel.send('MonCasters bot ready!');
  }
});

client.on(Events.InteractionCreate, async (interaction:any) => {
	console.log('[INFO] Receiving interaction: ', interaction.commandName);
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);