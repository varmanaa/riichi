import { type InteractionResponse, InteractionResponseType } from '#type'

export function formatResponse(response: InteractionResponse): Response {
	switch (response.type) {
		case InteractionResponseType.Invalid: {
			return Response.json(null, { status: response.status })
		}
		case InteractionResponseType.Pong: {
			return Response.json(response)
		}
	}
}
