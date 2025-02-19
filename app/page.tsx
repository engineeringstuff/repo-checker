'use client';

import { Client } from '@/app/lib/client/Client';
import type { TokenTracker } from '@/app/lib/dtos/TokenTracker';
import { useState, type MouseEvent } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
	const DEFAULT_STYLE_GUIDE = 'https://google.github.io/styleguide/javaguide.html';
	const DEFAULT_REPOSITORY = 'https://github.com/hmcts/pcs-api';
	const [repositoryUrl, setRepositoryUrl] = useState<string>('');
	const [styleGuideUrl, setStyleGuideUrl] = useState<string>('');
	const [report, setReport] = useState<string>('');
	const [tracker, setTracker] = useState<TokenTracker>({ tokensIn: 0, tokensOut: 0 });

	const onButtonClicked = (_e: MouseEvent<HTMLButtonElement>) => {
		setReport('Working...');
		Client.Critique({
			styleGuideUrl: styleGuideUrl || DEFAULT_STYLE_GUIDE,
			repositoryUrl: repositoryUrl || DEFAULT_REPOSITORY,
		})
			.then((result) => {
				setReport(result.report);
				setTracker(result.tracker);
			})
			.catch((err: unknown) => {
				console.error(err);
				setReport('Failed to get report');
			});
	};

	return (
		<>
			<div className='flex flex-col p-4'>
				<div className='critique-row'>
					<label className='critique-label' htmlFor='style-guide'>
						Style Guide URL
					</label>
					<input
						className='w-96'
						type='url'
						id='style-guide'
						placeholder={DEFAULT_STYLE_GUIDE}
						value={styleGuideUrl}
						onChange={(e) => {
							setStyleGuideUrl(e.target.value);
						}}
					/>
				</div>
				<div className='critique-row'>
					<label className='critique-label' htmlFor='code-path'>
						Repository URL
					</label>
					<input
						className='w-96'
						type='url'
						id='code-path'
						placeholder={DEFAULT_REPOSITORY}
						value={repositoryUrl}
						onChange={(e) => {
							setRepositoryUrl(e.target.value);
						}}
					/>
				</div>
				<div className='critique-row'>
					<label className='critique-label' htmlFor='critique'></label>
					<button
						onClick={onButtonClicked}
						className='bg-blue-400 p-2 rounded-lg cursor-pointer text-white font-bold'
						id='critique'>
						Critique It!!
					</button>
				</div>
			</div>
			{tracker.tokensIn > 0 && (
				<div className='m-6'>
					<div>
						Tokens In: {tracker.tokensIn} - ${(0.0000011 * tracker.tokensIn).toFixed(2)}
					</div>
					<div>
						Tokens Out: {tracker.tokensOut} - ${(0.0000044 * tracker.tokensOut).toFixed(2)}
					</div>
					<div>
						For pricing data see{' '}
						<a href='https://platform.openai.com/docs/pricing#latest-models' target='_blank' rel='noreferrer'>
							OpenAI
						</a>
					</div>
				</div>
			)}
			<div className='m-6 max-w-6xl'>{Client.GetMarkdown(report)}</div>
		</>
	);
}
