export interface SiteMap {
	[url: string]: {
		staticFilesUrls: string[];
		connectedUrls: string[];
	};
}

export interface ScrapedData {
	data: SiteMap;
	root: string;
}

interface Attributes {
	staticFilesUrls?: string[];
}

export interface PageNode {
	name: string;
	attributes?: Attributes;
	children?: PageNode[];
}

export interface Map {
	[url: string]: PageNode;
}

// export interface MyTreeNode {
// 	name?: string;
// }
