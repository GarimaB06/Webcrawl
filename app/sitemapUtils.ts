import { SiteMap, Map, PageNode, ScrapedData } from "../types";

const exactWebsiteNameWithDotCom = (url: string): string => {
	const pattern = new RegExp("https?://(?:www\\.)?([\\w-]+)\\.com");
	const match = url.match(pattern);
	return match ? `${match[1]}.com` : "";
};

const formatIntoTreeData = ({ data, root }: ScrapedData) => {
	const formattedRootUrl = exactWebsiteNameWithDotCom(root);
	const processedSet: Set<string> = new Set();
	const firstPage: string | undefined = Object.keys(data)[0];
	if (!firstPage) return [];
	const queue: PageNode[] = [{ name: firstPage }];
	const map: Map = {};
	while (queue.length) {
		const currentPage: PageNode | undefined = queue.shift();
		if (!currentPage) continue;

		const pageUrl: string = currentPage.name;

		if (!processedSet.has(pageUrl)) {
			processedSet.add(pageUrl);

			const obj: PageNode = processPage(pageUrl, data);

			if (obj?.children?.length) {
				queue.push(...obj.children);
			}
			map[pageUrl] = obj;
		}
	}
	const _formattedRootUrl = `https://${formattedRootUrl}`;
	processChildren(map[_formattedRootUrl], map);
	return [map[_formattedRootUrl]];
};

// This is meant to recursively go into the tree structure and children to children recursively
const processChildren = (rootNode: PageNode, map: Map) => {
	const processed: Set<string> = new Set();
	const queue: PageNode[] = [rootNode];
	while (queue.length) {
		const currentPage: PageNode | undefined = queue.shift();
		if (!currentPage) continue;

		const { children, name } = currentPage;
		processed.add(name);

		children?.forEach((child) => {
			processed.add(child.name);
		});
		children?.forEach((child) => {
			child.children = map[child.name].children?.filter((_child: PageNode) => {
				return !processed.has(_child.name);
			});
			if (!processed.has(child.name)) {
				queue.push(child);
			}
		});
	}
};

const processPage = (url: string, siteMapData: SiteMap): PageNode => {
	const obj: PageNode = { name: url };
	if (siteMapData[url]) {
		const { staticFilesUrls, connectedUrls } = siteMapData[url];
		obj.attributes = { staticFilesUrls };
		obj.children =
			connectedUrls?.map((child) => {
				return { name: child };
			}) || [];
	}
	return obj;
};

export default formatIntoTreeData;
