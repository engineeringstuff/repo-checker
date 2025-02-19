import type { CritiqueResponse } from '@/app/lib/dtos/CritiqueResponse';
import { Logger } from '@/app/lib/server/Logger';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		await request.json();

		const response: CritiqueResponse = {
			report: 'Not implemented yet',
			tracker: { tokensIn: 0, tokensOut: 0 },
		};
		return NextResponse.json(response);
	} catch (error) {
		Logger.error(`Failed with: ${JSON.stringify(error)}`, { error });
		return new NextResponse(`Failed with: ${JSON.stringify(error)}`, { status: 500 });
	}
}
