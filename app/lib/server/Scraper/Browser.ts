import { Helper } from '@/app/lib/Helper';
import { Logger } from '@/app/lib/server/Logger';
import {
	DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
	HTTPRequest,
	Page,
	type Handler,
	type Browser as PuppeteerBrowser,
} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import AnonymizeUAPlugin from 'puppeteer-extra-plugin-anonymize-ua';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer
	.use(StealthPlugin())
	.use(
		AdblockerPlugin({
			// Optionally enable Cooperative Mode for several request interceptors
			interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
		}),
	)
	.use(AnonymizeUAPlugin());

export interface PageRequest {
	url: string;
	browser?: PuppeteerBrowser | undefined;
}

// eslint-disable-next-line
export class Browser {
	static async GetBrowser(headless = true): Promise<PuppeteerBrowser> {
		const args = [
			'--disable-gpu',
			'--disable-dev-shm-usage',
			'--disable-setuid-sandbox',
			'--no-first-run',
			'--no-sandbox',
			'--no-zygote',
			'--deterministic-fetch',
			'--disable-features=IsolateOrigins',
			'--disable-site-isolation-trials',
			// '--single-process',
		];
		return await puppeteer.launch({
			defaultViewport: {
				width: 1280,
				height: 1024,
				isLandscape: true,
			},
			acceptInsecureCerts: true,
			headless,
			args,
		});
	}

	static async CreatePage(browser: PuppeteerBrowser): Promise<Page> {
		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(120000);
		page.setDefaultTimeout(10000);

		await page.setRequestInterception(true);

		return page;
	}

	static async GetPage(params: PageRequest): Promise<Page | undefined> {
		const { browser, url } = params;
		try {
			if (!browser) {
				Logger.error('Browser not available');
				return undefined;
			}

			// Launch the browser and open a new blank page
			const page = await Browser.CreatePage(browser);
			const blockedDomains = ['https://www.gstatic.com'];

			// eslint-disable-next-line
			const requestHandler: Handler<HTTPRequest> = async (request) => {
				const url = request.url();
				let shouldAbort = false;

				if (blockedDomains.some((d) => url.startsWith(d))) {
					shouldAbort = true;
				}

				if (shouldAbort) {
					await request.abort();
				}
			};

			page.on('request', requestHandler);

			// Navigate the page to a URL
			await page.goto(url, { waitUntil: 'networkidle2' });
			await Helper.Wait(1000);

			page.off('request', requestHandler);
			return page;
		} catch (error) {
			Logger.error('Problem with GetPage', { error });
		}
		return undefined;
	}
}
