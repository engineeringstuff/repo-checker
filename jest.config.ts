import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

const config: Config = {
	preset: 'ts-jest/presets/default-esm',

	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	moduleNameMapper: {
		'^@/(.*)$': ['<rootDir>/src/$1'],
	},
	moduleDirectories: ['js', __dirname, 'node_modules'],

	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

	// The test environment that will be used for testing
	testEnvironment: 'node',

	transform: {
		'node_modules/strip-ansi/.+\\.(j|t)sx?$': 'ts-jest',
	},

	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},

	transformIgnorePatterns: ['node_modules/(?!strip-ansi/.*)'],
};

export default createJestConfig(config);
