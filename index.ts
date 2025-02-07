import { Interaction, Client, Collection, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import * as fs from "fs";
import * as path from "path";
import config from './modules/configuration';

const client:any = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file:any) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
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
    channel.send('Hello world!');
  }
});

client.on(Events.InteractionCreate, async (interaction:any) => {
  console.log('Receivin an interaction: ', interaction);
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

client.login(config.discordApi.token);