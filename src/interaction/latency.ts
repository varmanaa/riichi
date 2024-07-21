import type { ExecutionContext } from '@cloudflare/workers-types'
import {
	type APIApplicationCommandInteraction,
	MessageFlags,
} from 'discord-api-types/v10'
import { type InteractionResponse, InteractionResponseType } from '#type'
import { editResponse, getResponse } from '#utility'

async function updateMessage(interaction: APIApplicationCommandInteraction) {
	const response = await getResponse(interaction)
	const responseMs = Number((BigInt(response.id) >> 22n) + 1_420_070_400_000n)
	const interactionMs = Number(
		(BigInt(interaction.id) >> 22n) + 1_420_070_400_000n,
	)
	const rttMs = responseMs - interactionMs
	const rttString = String(rttMs).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	const description = `🔂 **RTT**: ${rttString} ms`

	await editResponse(interaction, {
		embeds: [{ color: 0xf8f8ff, description }],
	})
}

export function latency(
	ctx: ExecutionContext,
	interaction: APIApplicationCommandInteraction,
): InteractionResponse {
	ctx.waitUntil(updateMessage(interaction))

	return {
		data: { flags: MessageFlags.Ephemeral },
		type: InteractionResponseType.DeferredChannelMessageWithSource,
	}
}
