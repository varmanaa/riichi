import type { ExecutionContext } from '@cloudflare/workers-types'
import {
	type APIInteraction,
	InteractionType,
	MessageFlags,
} from 'discord-api-types/v10'
import { isValidRequest } from 'discord-verify'
import { latency } from '#interaction'
import {
	type Bindings,
	type InteractionResponse,
	InteractionResponseType,
} from '#type'
import { createResponse } from '#utility'

async function fetch(
	request: Request,
	env: Bindings,
	ctx: ExecutionContext,
): Promise<Response> {
	if (request.method !== 'POST')
		return createResponse({
			status: 400,
			type: InteractionResponseType.Invalid,
		})
	if (!(await isValidRequest(request, env.DISCORD_PUBLIC_KEY)))
		return createResponse({
			status: 401,
			type: InteractionResponseType.Invalid,
		})

	const interaction: APIInteraction = await request.json()

	switch (interaction.type) {
		case InteractionType.ApplicationCommand: {
			let response: InteractionResponse
			switch (interaction.data.name) {
				case 'latency': {
					response = latency(ctx, interaction)

					break
				}
				default: {
					response = {
						data: {
							embeds: [
								{ color: 0xf8f8ff, description: 'Unsupported interaction' },
							],
							flags: MessageFlags.Ephemeral,
						},
						type: InteractionResponseType.ChannelMessageWithSource,
					}

					break
				}
			}

			return createResponse(response)
		}
		case InteractionType.Ping: {
			return createResponse({ type: InteractionResponseType.Pong })
		}
		default: {
			return createResponse({
				data: {
					embeds: [{ color: 0xf8f8ff, description: 'Unsupported interaction' }],
					flags: MessageFlags.Ephemeral,
				},
				type: InteractionResponseType.ChannelMessageWithSource,
			})
		}
	}
}

export default { fetch }
