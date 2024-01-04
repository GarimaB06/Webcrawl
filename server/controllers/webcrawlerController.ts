import { Request, Response } from "express";
import webcrawler from "../modules/webcrawler";

export const getWebcrawler = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const data = await webcrawler("https://www.enki.com");
		if (!res.headersSent) {
			res.status(200).json({ data });
		}
	} catch (error) {
		console.error("Error in getWebcrawler middleware:", error);
		if (!res.headersSent) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	}
};
