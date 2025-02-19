// eslint-disable-next-line
export class Configuration {
	private static cached: Record<string, string | undefined> = {};

	private static Get(key: string): string | undefined {
		if (this.cached[key]) {
			return this.cached[key];
		}

		const value = process.env[key];
		this.cached[key] = value;
		return value;
	}

	static LLM_API_KEY_OPENAI() {
		return Configuration.Get('OPENAI_API_KEY');
	}

	static LLM_API_URL_OPENAI() {
		return Configuration.Get('OPENAI_API_URL');
	}

	static LLM_MODEL() {
		return Configuration.Get('LLM_MODEL');
	}
}
