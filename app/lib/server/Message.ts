import { Helper } from '@/app/lib/Helper';
import { File } from '@/app/lib/server/File';
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

// eslint-disable-next-line
export class Message {
	static AsFile(fileName: string, content: string): ChatCompletionUserMessageParam {
		return {
			role: 'user',
			content: `Below are the contents of the file \`${fileName}\`
\`\`\`
${content}
\`\`\``,
		};
	}

	static async FromFile(fileName: string) {
		return Message.AsFile(fileName, await File.ReadFile(fileName));
	}

	static From(content: string): ChatCompletionUserMessageParam {
		return {
			role: 'user',
			content,
		};
	}

	static ExtractContent(message: ChatCompletionMessageParam) {
		if (message?.role != 'assistant') {
			return undefined;
		}

		if (typeof message?.content != 'string') {
			return undefined;
		}

		return Helper.Extract(message.content);
	}
}
