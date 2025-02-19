// eslint-disable-next-line
export class Helper {
	static Wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	static ToString(candidate: unknown, defaultValue = ''): string {
		if (candidate == undefined) {
			return defaultValue;
		}

		if (typeof candidate == 'string') {
			return candidate;
		} else if (candidate?.constructor?.name == 'Date') {
			return (candidate as Date).toISOString();
		} else if (typeof candidate == 'object') {
			return JSON.stringify(candidate);
		}

		// eslint-disable-next-line
		return String(candidate);
	}

	static Truncate(candidate: unknown) {
		const input = Helper.ToString(candidate);

		if (input.length > 150) {
			return input.substring(0, 150) + '...';
		}
		return input;
	}

	static Extract(message: string) {
		if (message?.includes('```')) {
			return Helper.ExtractGeneral(message, '```', '```', true, false, true);
		}
		return Helper.ExtractGeneral(message, '`', '`', false, false, false);
	}

	static ExtractGeneral(
		message: string,
		start: string,
		end: string,
		shouldRemoveFirstLine: boolean,
		shouldCaptureTags: boolean,
		isGreedy: boolean,
	) {
		try {
			let firstBracketIndex = (message || '').indexOf(start);
			if (firstBracketIndex >= 0) {
				let lastBracketIndex = isGreedy
					? (message || '').lastIndexOf(end)
					: (message || '').indexOf(end, firstBracketIndex + start.length);
				if (lastBracketIndex > firstBracketIndex) {
					if (shouldCaptureTags) {
						lastBracketIndex += end.length;
					} else {
						firstBracketIndex += start.length;
					}

					let result = message?.substring(firstBracketIndex, lastBracketIndex);

					if (shouldRemoveFirstLine) {
						const newLineIndex = result.indexOf('\n');
						if (newLineIndex >= 0) {
							result = result.substring(newLineIndex + 1);
						}
					}

					return (result ?? '').trim();
				}
			}
		} catch (error) {
			console.error(error);
		}
		return undefined;
	}
}
