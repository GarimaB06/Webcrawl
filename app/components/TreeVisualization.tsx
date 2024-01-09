import { ScrapedData } from "@/types";
import React, { useState, useEffect } from "react";
import Tree from "react-d3-tree";

const customNodeRenderer = ({ nodeDatum, toggleNode }) => (
	<g onClick={() => toggleNode()}>
		<circle r={31} />
		<text
			textAnchor="middle"
			dy="-55"
			style={{ fill: "black", fontSize: "25px" }}
		>
			{nodeDatum.name}
		</text>
	</g>
);

const TreeVisualization = ({ treeData }) => {
	const [zoomedOut, setZoomedOut] = useState(false);

	useEffect(() => {
		setZoomedOut(true);
	}, []); // Only run this effect once on mount

	return (
		<div
			style={{
				width: "100%",
				height: "200vh",
				overflow: "hidden", // Hide overflow to prevent scrollbars during animation
			}}
		>
			{treeData.length > 0 && (
				<Tree
					data={treeData}
					orientation="horizontal"
					pathFunc="diagonal"
					translate={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
					separation={{ siblings: 1, nonSiblings: 3 }}
					nodeSize={{ x: 2500, y: 180 }}
					renderCustomNodeElement={customNodeRenderer}
					zoom={zoomedOut ? 0.02 : 1} // Adjust the zoom level as needed
					zoomable={true}
				/>
			)}
		</div>
	);
};

export default TreeVisualization;
