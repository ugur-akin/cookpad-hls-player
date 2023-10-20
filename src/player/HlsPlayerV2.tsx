import React, { useEffect, useRef } from "react";
import { PlayerControls } from "./controls/PlayerControls";
import { VideoInteractionsContainer } from "./feedback/VideoInteractionsContainer";
import { useHLSPlayerContext } from "../context/HLSPlayerContext";
import { Box } from "@mui/material";

const PLAYER_RATIO = 750 / 1920;
const PLAYER_WIDTH = 1920 * PLAYER_RATIO;
const PLAYER_HEIGHT = 1080 * PLAYER_RATIO;

const HlsPlayerV2 = () => {
	const { attachMedia, isPlaying, recentlyInteracted, triggerInteraction } =
		useHLSPlayerContext();
	const playerRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (playerRef.current) {
			attachMedia(playerRef.current);
		}
	}, [attachMedia, playerRef]);

	const showControls = recentlyInteracted || !isPlaying;

	return (
		<Box
			sx={{
				position: "relative",
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT,
				cursor: showControls ? "default" : "none",
				"*": {
					cursor: showControls ? "default" : "none",
				},
			}}
			onMouseMove={triggerInteraction}
		>
			<video
				width={PLAYER_WIDTH}
				height={PLAYER_HEIGHT}
				preload="meta"
				ref={playerRef}
			>
				<source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
			</video>
			<VideoInteractionsContainer />
			<PlayerControls show={showControls} />
		</Box>
	);
};

export default HlsPlayerV2;
