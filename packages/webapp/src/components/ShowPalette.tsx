export default function ShowPalette({ palette }: { palette: [] }) {
	if (!palette || palette.length < 1) return null;

	return (
		<div style={{ display: "flex", flexWrap: "wrap", margin: "10px 0" }}>
			{palette?.map((p: string, i: number) => (
				<div
					key={`${p}-${i}`}
					style={{
						width: 8,
						height: 8,
						margin: 2,
						borderRadius: 10,
						backgroundColor: p,
					}}
				></div>
			))}
		</div>
	);
}
