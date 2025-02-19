import type { TokenTracker } from '@/app/lib/dtos/TokenTracker';

export interface CritiqueResponse {
	report: string;
	tracker: TokenTracker;
}
