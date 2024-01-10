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
	const [error, setError] = useState<Error | null>(null);
	const [showTree, setShowTree] = useState<boolean>(false);

	if (error) return <p>{error.toString()}</p>;
	if (loading) return <p>...Loading</p>;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
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
		} catch (error) {
			console.log(`Error ${error} occured while fetching the data`);
		}
	};

	const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	};

	useEffect(() => {
		if (rawData) {
			const { data } = rawData;
			const formattedData: PageNode[] = formatIntoTreeData({
				data,
				root: url,
			});
			setTreeData(formattedData);
		}
	}, [rawData]);

	console.log("TREE DATA", treeData);

	return (
		<>
			<button onClick={() => setShowTree(!showTree)} style={{ margin: "20px" }}>
				{showTree
					? "Click to view site map JSON"
					: "Click to view site map TREE"}
			</button>
			{showTree ? (
				<TreeVisualization treeData={treeData} />
			) : (
				<>
					<form onSubmit={handleSubmit}>
						<input type="text" value={url} onChange={handleUrlChange} />
						<button type="submit">Submit</button>
					</form>
					<div
						style={{
							width: "50%",
							overflowX: "auto",
						}}
					>
						{rawData && <pre>{JSON.stringify(rawData, null, 2)}</pre>}
					</div>
				</>
			)}
		</>
	);
};

export default Form;
