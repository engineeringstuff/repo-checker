import type { CritiqueRequest } from '@/app/lib/dtos/CritiqueRequest';
import type { CritiqueResponse } from '@/app/lib/dtos/CritiqueResponse';
import { marked } from 'marked';
import type React from 'react';

// eslint-disable-next-line
export class Client {
	private static async MakeCall<TOut>(
		url: string,
		message?: object,
		abortController?: AbortController | undefined,
	): Promise<TOut> {
		const response = await fetch(url, {
			method: 'POST',
			body: message ? JSON.stringify(message) : '{}',
			signal: abortController?.signal ?? null,
		});
		return JSON.parse(await response.text()) as TOut;
	}

	static async Critique(input: CritiqueRequest): Promise<CritiqueResponse> {
		return await this.MakeCall<CritiqueResponse>('/api/critique', input);
	}

	static GetMarkdown(markdown: string): React.JSX.Element {
		return (
			<div
				className='text-sm whitespace-pre-line marked-down'
				dangerouslySetInnerHTML={{
					__html: marked
						.parse(markdown, { async: false })
						.replace(/(<\/.?>)\n</gi, '$1<')
						.replace(/>\n</gi, '><')
						.replace(/>\n</gi, '><')
						.trim(),
				}}
			/>
		);
	}
}
