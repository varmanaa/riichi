import {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	type RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10'

const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
	{
		contexts: [InteractionContextType.Guild],
		description: 'Check Discord API latency',
		integration_types: [ApplicationIntegrationType.UserInstall],
		name: 'latency',
		type: ApplicationCommandType.ChatInput,
	},
]

async function register() {
	const APPLICATION_ID = process.env.APPLICATION_ID
	const DISCORD_TOKEN = process.env.DISCORD_TOKEN

	if (!APPLICATION_ID)
		throw new Error('Environment variable "APPLICATION_ID" not found')
	if (!DISCORD_TOKEN)
		throw new Error('Environment variable "DISCORD_TOKEN" not found')

	const response = await fetch(
		`https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bot ${DISCORD_TOKEN}`,
			},
			method: 'PUT',
			body: JSON.stringify(commands),
		},
	)

	if (response.ok) console.log(`Registed ${commands.length} command(s)`)
	else {
		console.error('Error registering commands')

		const text = await response.text()

		console.error(text)
	}
}

await register()
