import React, { useEffect, useRef, useState } from "react";
import { PlayerControls } from "./controls/PlayerControls";
import VideoInteractions from "./feedback/VideoInteractions";
import { useHLSPlayerContext } from "../context/HLSPlayerContext";

const FADE_TIMEOUT = 2000;

const PLAYER_RATIO = 750 / 1920;
const PLAYER_WIDTH = 1920 * PLAYER_RATIO;
const PLAYER_HEIGHT = 1080 * PLAYER_RATIO;

const HlsPlayerV2 = () => {
	const { attachMedia, isPlaying } = useHLSPlayerContext();
	const playerRef = useRef<HTMLVideoElement>(null);
	const [showControls, setShowControls] = useState(false);

	const updateLastInteractionTime = () => {
		setShowControls(true);
	};

	const hideControls = () => {
		setShowControls(false);
	};

	useEffect(() => {
		if (playerRef.current) {
			attachMedia(playerRef.current);
		}
	}, [attachMedia, playerRef]);

	useEffect(() => {
		if (showControls) {
			const t = setTimeout(hideControls, FADE_TIMEOUT);

			return () => clearTimeout(t);
		}

		return undefined;
	}, [showControls]);

	return (
		<div
			style={{
				backgroundColor: "lightblue",
				position: "relative",
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT,
			}}
			onMouseMove={updateLastInteractionTime}
		>
			<video
				width={PLAYER_WIDTH}
				height={PLAYER_HEIGHT}
				preload="meta"
				ref={playerRef}
			>
				<source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
			</video>
			<VideoInteractions />
			<PlayerControls show={showControls || !isPlaying} />
		</div>
	);
};

export default HlsPlayerV2;
