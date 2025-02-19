import os from 'node:os';

/** @type {import('next').NextConfig} */
const nextConfig = {
	productionBrowserSourceMaps: true,
	async headers() {
		return [
			{
				// matching all API routes
				source: '/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
					{ key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
					{ key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
					{ key: 'Referrer-Policy', value: 'unsafe-url' },
				],
			},
		];
	},
	webpack: (config, { isServer, buildId, dev, webpack }) => {
		config.externals = config.externals || [];
		config.externals.push(
			'puppeteer-extra',
			'puppeteer-extra-plugin-adblocker',
			'puppeteer-extra-plugin-anonymize-ua',
			'puppeteer-extra-plugin-stealth',
			'turndown',
		);
		if (isServer) {
			config.plugins.push(
				new webpack.NormalModuleReplacementPlugin(/node:crypto/, (resource) => {
					resource.request = resource.request.replace(/^node:/, '');
				}),
			);

			config.module.rules.push({
				test: /\.node$/,
				use: [
					{
						loader: 'nextjs-node-loader',
						options: {
							flags: os.constants.dlopen.RTLD_NOW,
							outputPath: config.output.path,
						},
					},
				],
			});
			return config;
		} else {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				path: false,
				stream: false,
				child_process: false,
				http: false,
				https: false,
				crypto: false,
				dns: false,
				zlib: false,
			};
		}

		return config;
	},
};

export default nextConfig;
