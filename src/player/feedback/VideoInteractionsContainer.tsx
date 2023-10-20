import { Box } from "@mui/material";
import React, { KeyboardEventHandler, MouseEventHandler } from "react";
import { useHLSPlayerContext } from "../../context/HLSPlayerContext";

export interface VideoInteractionsContainerProps {
	hideCursor: boolean;
}

export const VideoInteractionsContainer: React.FC<
	VideoInteractionsContainerProps
> = ({ hideCursor }) => {
	//TODO: Use hooks to determine and show interaction feedback

	const { isPlaying, playVideo, pauseVideo, rw10, ff10 } =
		useHLSPlayerContext();

	const handleOnClick: MouseEventHandler = (event) => {
		event.stopPropagation();
		isPlaying ? pauseVideo() : playVideo();
	};

	const handleKeyDown: KeyboardEventHandler = (event) => {
		switch (event.key) {
			case "ArrowLeft":
				rw10();
				break;
			case "ArrowRight":
				ff10();
				break;
			case "Spacebar":
				isPlaying ? pauseVideo() : playVideo();
				break;
		}
	};

	return (
		<Box
			id="interations-container"
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "transparent",
				cursor: hideCursor ? "none" : "default",
			}}
			onKeyDown={handleKeyDown}
			onClick={handleOnClick}
		/>
	);
};

// <Box
// 	id="interations-container"
// 	sx={{
// 		display: "inline-block",
// 		position: "absolute",
// 		top: "50%",
// 		left: "50%",
// 		transform: "translate(-50%, -50%)",
// 		visibility: "hidden",
// 	}}
// >
// 	<CircularProgress color="inherit" size={50} />
// </Box>
