import { Request, Response } from "express";
import webcrawler from "../modules/webcrawler";

// export const getWebcrawler = async (
// 	req: Request,
// 	res: Response
// ): Promise<void> => {
// 	try {
// 		const data = await webcrawler("https://www.enki.com");
// 		if (!res.headersSent) {
// 			res.status(200).json({ data });
// 		}
// 	} catch (error) {
// 		console.error("Error in getWebcrawler middleware:", error);
// 		if (!res.headersSent) {
// 			res.status(500).json({ error: "Internal Server Error" });
// 		}
// 	}
// };

//double check this code as well
export const crawlController = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		// console.log(req);
		const { url } = req.body;
		const data = await webcrawler(url);
		if (!res.headersSent) {
			res.status(200).json({ data });
		}
	} catch (error) {
		console.log(`Error ${error} occured in crawlController`);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
