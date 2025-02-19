import { Helper } from '@/app/lib/Helper';
import { Logger } from '@/app/lib/server/Logger';
import { Browser } from '@/app/lib/server/Scraper/Browser';
import { Page } from 'puppeteer';
import TurndownService from 'turndown';

// eslint-disable-next-line
export class Scraper {
	static HtmlToMarkdown(html: string): string {
		const turndownService = new TurndownService();
		turndownService.addRule('img', {
			filter: 'img',
			replacement: () => '',
		});
		turndownService.remove('script').remove('style').remove('meta').remove('link').remove('img').remove('picture');
		return turndownService.turndown(html);
	}

	// eslint-disable-next-line
	static async Get(url: string): Promise<string | undefined> {
		let page: Page | undefined = undefined;
		const browser = await Browser.GetBrowser();
		try {
			page = await Browser.GetPage({ url, browser });

			if (!page) {
				return undefined;
			}

			const bodyHTML = await page.evaluate(() => {
				const main =
					document.querySelector('#discussion_bucket .Layout-main') ??
					document.querySelector('.application-main') ??
					document.getElementById('content') ??
					document.getElementById('center_col') ??
					document.querySelector('div[role="main"]') ??
					document.querySelector('main article') ??
					document.querySelector('main') ??
					document.body;

				main.querySelector('#post-form')?.remove();
				main.querySelector('.discussion-timeline-actions')?.remove();
				main.querySelector('#sidebar')?.remove();

				return main.innerHTML;
			});

			if (!bodyHTML) {
				Logger.error('Could not get page');
				return undefined;
			}

			return Scraper.HtmlToMarkdown(bodyHTML);
		} catch (error) {
			Logger.error('Problem with Scrape', { error });
		} finally {
			if (page) {
				await Helper.Wait(1000);
				await page.close();
			}

			if (browser) {
				await browser.close();
			}
		}
		return undefined;
	}
}
