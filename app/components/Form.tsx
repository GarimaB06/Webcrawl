"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import "../globals.scss";
import { PageNode } from "@/types";
import { useEffect } from "react";
import formatIntoTreeData from "../sitemapUtils";
import TreeVisualization from "./TreeVisualization";

const Form: React.FC = () => {
	const [url, setUrl] = useState<string>("");
	const [rawData, setRawData] = useState<any | null>(null);
	const [treeData, setTreeData] = useState<PageNode[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [showTree, setShowTree] = useState<boolean>(false);

	const fetchData = async () => {
		try {
			const response = await fetch("http://localhost:3001/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ url }),
			});
			const data = await response.json();
			setRawData(data);
			setTreeData(formatIntoTreeData({ data: data.data, root: url }));
			setLoading(false);
		} catch (error: any) {
			setError(error.toString());
			setLoading(false);
			console.log(`Error ${error} occurred while fetching the data`);
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		fetchData();
	};

	const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	};

	const toggleView = () => {
		setShowTree((prevShowTree) => !prevShowTree);
	};

	const resetDisplay = () => {
		setRawData(null);
		setUrl("");
		setLoading(false);
	};

	useEffect(() => {
		if (rawData) {
			setTreeData(formatIntoTreeData({ data: rawData.data, root: url }));
		}
	}, [rawData, url]);

	return (
		<>
			{loading && <p>...Loading</p>}
			{error && <p>Error: {error}</p>}
			{rawData ? (
				<div className="data-display-container">
					<button onClick={toggleView} style={{ margin: "20px" }}>
						{showTree
							? "Click to view site map JSON"
							: "Click to view site map TREE"}
					</button>
					<button onClick={resetDisplay}>Crawl a different website</button>

					{showTree ? (
						<div className="tree-display-container">
							<TreeVisualization treeData={treeData} />
						</div>
					) : (
						<div className="json-div">
							<pre>{JSON.stringify(rawData, null, 2)}</pre>
						</div>
					)}
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={url}
						onChange={handleUrlChange}
						disabled={loading}
						style={{
							backgroundColor: loading ? "#eee" : "white",
							color: loading ? "lightGrey" : "black",
						}}
					/>
					<button
						type="submit"
						disabled={loading}
						style={{
							backgroundColor: loading ? "darkgrey" : "lightgrey",
							color: loading ? "#888" : "black",
						}}
					>
						Submit
					</button>
				</form>
			)}
		</>
	);
};

export default Form;
