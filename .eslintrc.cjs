module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'next/core-web-vitals',
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'prettier',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
	],
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: ['tsconfig.json'],
	},
	plugins: ['@typescript-eslint', 'react-refresh', 'react'],
	ignorePatterns: ['node_modules/', '*.cjs', 'dist', '.eslintrc.cjs'],

	rules: {
		'@next/next/no-img-element': 'off',
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		indent: ['error', 'tab', { ignoredNodes: ['PropertyDefinition'] }],
		'linebreak-style': 0,
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		curly: ['error', 'all'],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-misused-spread': 'off',
		'@typescript-eslint/no-duplicate-type-constituents': 'off',
		'@typescript-eslint/no-floating-promises': ['warn'],
		'@typescript-eslint/no-misused-promises': ['warn'],
		'@typescript-eslint/no-unnecessary-condition': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				args: 'none',
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
	},
};
