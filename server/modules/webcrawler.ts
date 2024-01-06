import { url } from "inspector";
import { SiteMap } from "../../types";
const puppeteer = require("puppeteer");

const webcrawler = async (userInputedUrl: string): Promise<SiteMap> => {
	const browser = await puppeteer.launch({
		headless: false,
		protocolTimeout: 60000,
		timeout: 120000,
	});
	try {
		const page = await browser.newPage();
		page.setDefaultNavigationTimeout(120000);
		const navigate = async (_url: string) => {
			await page.goto(_url, {
				waitUntil: "domcontentloaded",
				timeout: 60000,
			});
		};
		const webSiteDotCom: string = exactWebsiteNameWithDotCom(userInputedUrl);
		const scrapeLinks = async () => {
			const links = await page.evaluate(() => {
				const listOfLinks = document.body.querySelectorAll("a");
				const arrayOfLinks = Array.from(listOfLinks);
				const arrayOfHrefs = arrayOfLinks.map((link) =>
					link.getAttribute("href")
				);
				return arrayOfHrefs;
			});
			const filteredLinks = filterLinks(links, webSiteDotCom);
			return formatLinks(filteredLinks, webSiteDotCom);
		};
		const scrapeStaticAssets = async () => {
			const assets = await page.evaluate(() => {
				const listOfImages = document.body.querySelectorAll("img");
				const listOfVideos = document.body.querySelectorAll("video");
				const arrayOfImages = Array.from(listOfImages);
				const arrayOfVideos = Array.from(listOfVideos);
				const arrayOfAssets = [...arrayOfImages, ...arrayOfVideos].map(
					(element) => element.getAttribute("src")
				);
				return arrayOfAssets;
			});

			return assets;
		};

		const visited: Set<string> = new Set();

		const _siteMap: SiteMap = await traverse(
			userInputedUrl,
			visited,
			navigate,
			scrapeLinks,
			scrapeStaticAssets
		);
		return _siteMap;
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await browser.close();
	}
};

/**
 * SHORTEN THE USER INPUTTED URL SO WE CAN DO CONDITIONAL CHECKS WITH THE RESULTING STRING
 * @param - Takes the user inputted url - https://www.example.com
 * @returns - Returns example.com
 */

const exactWebsiteNameWithDotCom = (url: string): string => {
	const pattern = new RegExp("https?://(?:www\\.)?([\\w-]+)\\.com");
	const match = url.match(pattern);
	return match ? `${match[1]}.com` : "";
};

/**
 * FILTER LINKS FUNCTION
 * Filter the links  - Only push the link to the queue if it's valid.
 * If the link doesn't include "enki.com" or isn't a sub-url (begins with a /), filter it out
 * Also exclude "mailto:" links
 */

const subUrlRegex = /^\//;
export const filterLinks = (arrayOfLinks: string[], webSiteDotCom: string) => {
	return arrayOfLinks.filter((link) => {
		if (
			(!link?.includes(webSiteDotCom) && !subUrlRegex.test(link)) ||
			link.includes("mailto:") ||
			link.includes("tel:")
		) {
			return false;
		}
		return true;
	});
};

/**
 * FORMAT LINKS FUNCTION
 * This function is meant to normalize scraped links to be a standardized format with "https://www." prepended
 * If a link does not have enki.com, we will prepend 'https://enki.com'
 * If a link does not have 'https:' prefix we will prepend or replace with 'https:'
 *  */

export const formatLinks = (arrayOfLinks: string[], webSiteDotCom: string) => {
	return arrayOfLinks.map((link) => {
		if (link.includes(webSiteDotCom)) {
			let _link = link.replace("http:", "https:");
			if (_link.includes("www.")) {
				return (_link = link.replace("www.", ""));
			} else {
				return _link;
			}
		} else {
			return `https://${webSiteDotCom}${link}`;
		}
	});
};

function isValidURL(url: string) {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
}

const removeDuplicates = (arr: string[]): string[] => {
	return Array.from(new Set(arr));
};

/**
 * TRAVERSAL FUNCTION
 * After the links are filtered and formatted we push them to a traversal queue
 * and keep track of visited links in a visited set.
 * On every iteration we resurcively call the traversal function if it hasn't been added to the visited set.
 */
export const traverse = async (
	userInputedUrl: string,
	visited: Set<string>,
	navigate: (urlToNavigateTo: string) => Promise<void>,
	scrapeLinks: () => Promise<string[]>,
	scrapeStaticAssets: () => Promise<string[]>
): Promise<SiteMap> => {
	const siteMap: SiteMap = {};
	const queue: string[] = [userInputedUrl];

	while (queue.length) {
		const currentUrl: string | any = queue.shift();
		if (!visited.has(currentUrl) && isValidURL(currentUrl)) {
			visited.add(currentUrl);
			try {
				await navigate(currentUrl);

				const links = await scrapeLinks();
				const assets = await scrapeStaticAssets();
				siteMap[currentUrl] = {
					staticFilesUrls: assets,
					connectedUrls: removeDuplicates(links),
				};
				queue.push(...links);
			} catch (error) {
				console.log(`Error ${error} occured in navigate method`);
			}
		}
	}
	return siteMap;
};

export default webcrawler;
