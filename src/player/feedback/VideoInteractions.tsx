import { Box, CircularProgress } from "@mui/material";
import React from "react";

const VideoInteractions = () => {
	//TODO: Use hooks to determine and show interaction feedback
	return (
		<Box
			id="interations-container"
			sx={{
				display: "inline-block",
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				visibility: "hidden",
			}}
		>
			<CircularProgress color="inherit" size={50} />
		</Box>
	);
};

export default VideoInteractions;
