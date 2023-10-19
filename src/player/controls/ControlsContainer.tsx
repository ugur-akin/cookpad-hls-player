import { Box } from "@mui/material";
import React from "react";
import { ProgressSlider } from "./ProgressSlider";
import { ControlButtons } from "./ControlButtons";

export interface PlayerControls {
	show: boolean;
}

export const PlayerControls: React.FC<PlayerControls> = ({ show }) => {
	return (
		<Box
			id="controls-container"
			sx={{
				background:
					"linear-gradient(0deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 52%)",
				position: "absolute",
				bottom: "0",
				left: "0",
				height: "45%",
				width: "100%",
				padding: 0,
				visibility: show ? "visible" : "hidden",
				display: "flex",
				flexDirection: "column",
				justifyContent: "end",
			}}
		>
			<ProgressSlider />
			<ControlButtons />
		</Box>
	);
};
