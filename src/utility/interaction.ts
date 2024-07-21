import type {
	APIApplicationCommandInteraction,
	APIInteractionResponseCallbackData,
	APIMessage,
} from 'discord-api-types/v10'
import {
	type InteractionResponse,
	InteractionResponseType,
	type ResponseData,
} from '#type'

export function createResponse(response: InteractionResponse): Response {
	switch (response.type) {
		case InteractionResponseType.ChannelMessageWithSource: {
			const formattedResponseData = formatResponseData(response.data)

			if (formattedResponseData instanceof FormData)
				return new Response(formattedResponseData)

			return Response.json({
				data: formattedResponseData,
				type: InteractionResponseType.ChannelMessageWithSource,
			})
		}
		case InteractionResponseType.DeferredChannelMessageWithSource:
		case InteractionResponseType.Pong: {
			return Response.json(response)
		}
		case InteractionResponseType.Invalid: {
			return Response.json(null, { status: response.status })
		}
	}
}

function formatResponseData(responseData: ResponseData): FormData | string {
	const data: APIInteractionResponseCallbackData = {
		...(responseData.components && { components: responseData.components }),
		...(responseData.content && { content: responseData.content }),
		...(responseData.embeds && { embeds: responseData.embeds }),
		...(responseData.flags && { flags: responseData.flags }),
	}

	if (!responseData.attachments) return JSON.stringify(data)

	const formData = new FormData()

	data.attachments = []

	for (const [index, attachment] of responseData.attachments.entries()) {
		formData.append(`files[${index}]`, new Blob([attachment.data]))
		data.attachments.push({ id: index, filename: attachment.name })
	}

	formData.append('payload_json', JSON.stringify({ data }))

	return formData
}

export async function getResponse(
	interaction: APIApplicationCommandInteraction,
): Promise<APIMessage> {
	const response = await fetch(
		`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		},
	)
	const message = await response.json()

	return message
}

export async function editResponse(
	interaction: APIApplicationCommandInteraction,
	responseData: ResponseData,
) {
	const formattedResponseData = formatResponseData(responseData)

	await fetch(
		`https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}/messages/@original`,
		{
			body: formattedResponseData,
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'PATCH',
		},
	)
}
