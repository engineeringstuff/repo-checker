import type { TokenTracker } from '@/app/lib/dtos/TokenTracker';
import { Helper } from '@/app/lib/Helper';
import { Configuration } from '@/app/lib/server/Configuration';
import { Logger } from '@/app/lib/server/Logger';
import { Message } from '@/app/lib/server/Message';
import OpenAI, { type ClientOptions } from 'openai';
import type { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openAI = (() => {
	const clientOptions: ClientOptions = {};
	clientOptions.apiKey = Configuration.LLM_API_KEY_OPENAI();
	clientOptions.baseURL = Configuration.LLM_API_URL_OPENAI();
	return new OpenAI(clientOptions);
})();

// eslint-disable-next-line
export class InteractionLoop {
	static async Run(messages: ChatCompletionMessageParam[], tracker: TokenTracker): Promise<ChatCompletionMessageParam> {
		const request: ChatCompletionCreateParamsNonStreaming = {
			model: Configuration.LLM_MODEL() ?? 'o3-mini',
			messages,
		};

		Logger.debug('Request to LLM API:', {
			request: request.messages.map((m) => ({ ...m, content: Helper.Truncate(m.content) })),
		});

		const askResponse = await openAI.chat.completions.create(request);
		const response = askResponse?.choices?.[0]?.message;

		if (askResponse.usage) {
			tracker.tokensIn += askResponse.usage?.prompt_tokens;
			tracker.tokensOut += askResponse.usage?.completion_tokens;
		}

		Logger.debug('Response from LLM API:', {
			response: { ...response, content: Helper.Truncate(response.content) },
		});

		return response;
	}

	static async Ask(content: string, tracker: TokenTracker): Promise<ChatCompletionMessageParam> {
		return await InteractionLoop.Run([Message.From(content)], tracker);
	}
}
