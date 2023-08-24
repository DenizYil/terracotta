import * as React from "react";
import { Box, TextField } from "@mui/material";
import { makeStyles } from "@mui/material/styles";

const styles = {
	inputBox: {
		width: 50,
	},
};

const colorbarStyle = {
	width: "100%",
	height: 6,
	borderRadius: 4,
};

export type LegendProps = {
	src: string;
	/**
	 * *Only relevant when `range` is present. Represents the amount of ticks distributed between min/max values(including them).
	 */
	length?: number | undefined;
	/**
	 * Min/Max range for the Legend ticks.
	 */
	range?: number[] | undefined;
	/**
	 * Append a unit at the end of the values. (%, °C, £, $)
	 */
	unit?: string | undefined;
	onGetRange: (val: number[]) => void;
};

const Legend: React.FC<LegendProps> = ({ src, range, onGetRange }) => {
	return (
		<Box style={{ width: "100%" }}>
			<Box component="img" src={src} alt="" sx={colorbarStyle} />
			{range?.[0] !== undefined && range?.[1] !== undefined && (
				<Box display="flex" justifyContent="space-between">
					<Box sx={styles.inputBox}>
						<TextField
							fullWidth
							type={"number"}
							variant={"standard"}
							value={Number(range[0].toFixed(3))}
							onChange={(e) =>
								onGetRange([Number(e.target.value), Number(range[1])])
							}
						/>
					</Box>
					<Box sx={styles.inputBox}>
						<TextField
							fullWidth
							type={"number"}
							variant={"standard"}
							value={Number(range[1].toFixed(3))}
							onChange={(e) =>
								onGetRange([Number(range[0]), Number(e.target.value)])
							}
						/>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default Legend;
