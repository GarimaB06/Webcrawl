"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import "../globals.css";

const Form: React.FC = () => {
	const [url, setUrl] = useState<string>("");
	const [result, setResult] = useState<any | null>();

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
			setResult(data);
		} catch (error) {
			console.log(`Error ${error} occured while fetching the data`);
		}
	};

	const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
	};

	return (
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
				<pre>{JSON.stringify(result, null, 2)}</pre>
			</div>
		</>
	);
};

export default Form;
