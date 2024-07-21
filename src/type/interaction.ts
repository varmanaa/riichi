export enum InteractionResponseType {
	Invalid = 0,
	Pong = 1,
	ChannelMessageWithSource = 4,
}

interface InvalidInteractionResponse {
	status: number
	type: InteractionResponseType.Invalid
}

interface PongInteractionResponse {
	type: InteractionResponseType.Pong
}

interface ChannelMessageWithSourceInteractionResponse {
	descriptions: string[]
	ephemeral: boolean
	status?: number
	type: InteractionResponseType.ChannelMessageWithSource
}

export type InteractionResponse =
	| InvalidInteractionResponse
	| PongInteractionResponse
	| ChannelMessageWithSourceInteractionResponse
