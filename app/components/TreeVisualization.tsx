import Tree from "react-d3-tree";

const customNodeRenderer = ({
	nodeDatum,
	toggleNode,
}: {
	nodeDatum: any;
	toggleNode: any;
}) => (
	<g onClick={() => toggleNode()} style={{ margin: "100px" }}>
		<circle r={31} />
		<text
			textAnchor="left"
			dy="-55"
			style={{ fill: "black", fontSize: "25px" }}
		>
			{nodeDatum.name}
		</text>
	</g>
);

const TreeVisualization: React.FC<{
	treeData: any;
}> = ({ treeData }) => {
	return (
		<div
			style={{
				width: "80%",
				height: "200vh",
				overflow: "hidden", // Hide overflow to prevent scrollbars during animation
				backgroundColor: "#e4e4e4",
			}}
		>
			{treeData.length > 0 && (
				<>
					<Tree
						data={treeData}
						orientation="horizontal"
						pathFunc="diagonal"
						translate={{ x: 0, y: window.innerHeight / 2 }}
						separation={{ siblings: 1, nonSiblings: 3 }}
						nodeSize={{ x: 4000, y: 180 }}
						renderCustomNodeElement={customNodeRenderer}
						zoom={0.1}
						zoomable={true}
					/>
				</>
			)}
		</div>
	);
};

export default TreeVisualization;
