import Tree from "react-d3-tree";
import "../globals.scss";
const customNodeRenderer = ({
	nodeDatum,
	toggleNode,
}: {
	nodeDatum: any;
	toggleNode: any;
}) => (
	<g onClick={() => toggleNode()} className="toggle-node">
		<circle r={31} />
		<text textAnchor="left" dy="-55" className="circle-label">
			{nodeDatum.name}
		</text>
	</g>
);

const TreeVisualization: React.FC<{
	treeData: any;
}> = ({ treeData }) => {
	return (
		<>
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
		</>
	);
};

export default TreeVisualization;
