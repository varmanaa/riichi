import type { ExecutionContext } from '@cloudflare/workers-types'
import {
	type APIInteraction,
	InteractionType,
	MessageFlags,
} from 'discord-api-types/v10'
import { isValidRequest } from 'discord-verify'
import { type Bindings, InteractionResponseType } from '#type'
import { formatResponse } from '#utility'

async function fetch(
	request: Request,
	env: Bindings,
	ctx: ExecutionContext,
): Promise<Response> {
	if (request.method !== 'POST')
		return formatResponse({
			status: 400,
			type: InteractionResponseType.Invalid,
		})
	if (!(await isValidRequest(request, env.DISCORD_PUBLIC_KEY)))
		return formatResponse({
			status: 401,
			type: InteractionResponseType.Invalid,
		})

	const interaction: APIInteraction = await request.json()

	switch (interaction.type) {
		case InteractionType.Ping: {
			return formatResponse({ type: InteractionResponseType.Pong })
		}
		default: {
			return formatResponse({
				descriptions: ['Unsupported interaction'],
				ephemeral: true,
				status: 501,
				type: InteractionResponseType.ChannelMessageWithSource,
			})
		}
	}
}

export default { fetch }
