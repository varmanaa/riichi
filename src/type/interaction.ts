import type {
	APIActionRowComponent,
	APIEmbed,
	APIMessageActionRowComponent,
	MessageFlags,
} from 'discord-api-types/v10'
import type { RequireAtLeastOne } from 'type-fest'

export enum InteractionResponseType {
	Invalid = 0,
	Pong = 1,
	ChannelMessageWithSource = 4,
	DeferredChannelMessageWithSource = 5,
}

interface InvalidInteractionResponse {
	status: number
	type: InteractionResponseType.Invalid
}

interface PongInteractionResponse {
	type: InteractionResponseType.Pong
}

export type ResponseData = RequireAtLeastOne<
	{
		attachments?: {
			data: Buffer | string
			name: string
		}[]
		components?: APIActionRowComponent<APIMessageActionRowComponent>[]
		content?: string
		embeds?: APIEmbed[]
		flags?: MessageFlags
	},
	'attachments' | 'components' | 'content' | 'embeds'
>

interface ChannelMessageWithSourceInteractionResponse {
	data: ResponseData
	type: InteractionResponseType.ChannelMessageWithSource
}

interface DeferredChannelMessageWithSourceInteractionResponse {
	data: {
		flags?: MessageFlags
	}
	type: InteractionResponseType.DeferredChannelMessageWithSource
}

export type InteractionResponse =
	| InvalidInteractionResponse
	| PongInteractionResponse
	| ChannelMessageWithSourceInteractionResponse
	| DeferredChannelMessageWithSourceInteractionResponse
