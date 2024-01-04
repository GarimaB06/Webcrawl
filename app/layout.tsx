import type { Metadata } from "next";
import Form from "./components/Form";
import "./globals.css";
export const metadata: Metadata = {
	title: "Webcrawl",
	description: "Visualize your web crawled data",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<body>
				<h1>Welcome to Webcrawl</h1>
				<p>Enter your website URL</p>
				<p>Required Format: https://www.example.com</p>
				<Form />
			</body>
		</html>
	);
}
