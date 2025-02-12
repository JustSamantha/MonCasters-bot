import fs from 'node:fs';
import path from 'node:path';
import { CacheType, ChatInputCommandInteraction, Client, Collection, CommandInteraction, Events, GatewayIntentBits, Interaction, MessageFlags, SlashCommandBuilder, TextChannel } from 'discord.js';
import { token } from '../config.json';

interface Command {
	data: SlashCommandBuilder;
	execute(interaction: ChatInputCommandInteraction): ChatInputCommandInteraction;
}

let client:Client = new Client({ intents: [
  GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildPresences,
] });

const commandsCollection:Collection<string, Command> = new Collection();
const foldersPath:string = path.join(__dirname, 'commands');
const commandFolders:string[] = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath:string = path.join(foldersPath, folder);
	const commandFiles:string[] = fs.readdirSync(commandsPath).filter((file:string) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath:string = path.join(commandsPath, file);
		const command:Command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commandsCollection.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, (readyClient:Client) => {
	if (!readyClient || !readyClient.user) throw 'Client is ready but object is not defined';
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const channel:TextChannel = client.channels.cache.get('1239320263108329514') as TextChannel;
  if (channel) {
    channel.send('MonCasters bot ready!');
  } else {
		console.error('Channel is not defined, can not send welcome message.');
	}
});

client.on(Events.InteractionCreate, async (interaction:Interaction<CacheType>) => {
	console.info('Receiving interaction: ', interaction);
	if (!interaction.isChatInputCommand()) return;
	const command:Command | undefined = commandsCollection.get(interaction.commandName);

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