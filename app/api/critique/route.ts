
import type { CritiqueRequest } from '@/app/lib/dtos/CritiqueRequest';
import type { CritiqueResponse } from '@/app/lib/dtos/CritiqueResponse';
import type { TokenTracker } from '@/app/lib/dtos/TokenTracker';
import { File } from '@/app/lib/server/File';
import { Git } from '@/app/lib/server/Git';
import { InteractionLoop } from '@/app/lib/server/InteractionLoop';
import { Logger } from '@/app/lib/server/Logger';
import { Message } from '@/app/lib/server/Message';
import { Scraper } from '@/app/lib/server/Scraper/Scraper';
import { NextRequest, NextResponse } from 'next/server';
import type { ChatCompletionMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';
import pLimit from 'p-limit';
import path from 'path';

const limit = pLimit(5);
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const { repositoryUrl, styleGuideUrl } = (await request.json()) as CritiqueRequest;

		const styleGuide = await fetchStyleGuide(styleGuideUrl);
		const repoPath = await Git.Clone(repositoryUrl);
		const tracker: TokenTracker = { tokensIn: 0, tokensOut: 0 };

		const sourceCodeFiles = await getSourcePathsFromRepo(repoPath);
		const promises = sourceCodeFiles.map((f) => limit(() => critiqueFile(f, repoPath, styleGuide, tracker)));

		Logger.debug(`Critiquing ${String(sourceCodeFiles.length)} files`);

		const allCritiques = await Promise.all(promises);
		const critiques = allCritiques.filter((c) => !!c).join('\n');

		const response = await InteractionLoop.Ask(
			`# Task
Below is a compilation of critiques for the files in a code repository, please can you compile them into a report?

# Instructions
- Compile the critiques into a single report.
- The report must start with an Executive Summary.
- The report must end with a conclusion.
- Ensure the report is well structured and easy to read.
- Ensure the report is easy to understand.

# Data
${critiques}

# Your Response
- Please return the report within a markdown-block.
`,
			tracker,
		);

		return report(response, tracker);
	} catch (error) {
		Logger.error(`Failed with: ${JSON.stringify(error)}`, { error });
		return new NextResponse(`Failed with: ${JSON.stringify(error)}`, { status: 500 });
	}
}

const critiqueFile = async (
	sourceCodePath: string,
	repoPath: string,
	styleGuide: ChatCompletionUserMessageParam,
	tracker: TokenTracker,
) => {
	const sourceCode = await Message.FromFile(sourceCodePath);
	const relativePath = path.relative(repoPath, sourceCodePath);
	const critique = await InteractionLoop.Run(
		[
			styleGuide,
			sourceCode,
			Message.From(`# Task
Critique the file \`${relativePath}\` and provide feedback on the code quality.

# Instructions
- Provide feedback on the code quality.
- Provide feedback on the code structure.
- Provide feedback on the code readability.
- YOU MUST CONSIDER THE STYLE GUIDE PROVIDED.
- YOU MUST MAKE OBSERVATIONS BASED ON THE STYLE GUIDE.

# Your Response
- Please return the report within a markdown-block.
- Your response must not exceed 1000 characters`),
		],
		tracker,
	);

	const extractedCritique = Message.ExtractContent(critique);
	if (!extractedCritique) {
		return undefined;
	}

	return `
-----
The following is a critique of the file \`${relativePath}\`:

\`\`\`
${extractedCritique}
\`\`\`
-----`;
};

const fetchStyleGuide = async (styleGuideUrl: string) => {
	return Message.AsFile('style-guide.md', (await Scraper.Get(styleGuideUrl)) ?? '');
};

const getSourcePathsFromRepo = async (repoPath: string, ext = '.java') => {
	return (await File.GetDirectoryTree(repoPath)).filter((f) => f.endsWith(ext));
};

const report = (report: ChatCompletionMessageParam, tracker: TokenTracker) => {
	const response: CritiqueResponse = {
		report: Message.ExtractContent(report) ?? '',
		tracker,
	};
	return NextResponse.json(response);
};
