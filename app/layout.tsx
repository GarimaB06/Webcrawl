import type { Metadata } from "next";

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
			</body>
		</html>
	);
}
