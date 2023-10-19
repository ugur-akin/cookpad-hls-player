import React, { useEffect, useRef, useState } from "react";
import { PlayerControls } from "./controls/ControlsContainer";
import VideoInteractions from "./feedback/VideoInteractions";
import { useHLSPlayerContext } from "../context/HLSPlayerContext";

const FADE_TIMEOUT = 2000;

const PLAYER_RATIO = 750 / 1920;
const PLAYER_WIDTH = 1920 * PLAYER_RATIO;
const PLAYER_HEIGHT = 1080 * PLAYER_RATIO;

const HlsPlayerV2 = () => {
	const playerRef = useRef<HTMLVideoElement>(null);
	const { attachMedia } = useHLSPlayerContext();
	// const [isLoading, setIsLoading] = useState(true);
	// const [isPlaying, setIsPlaying] = useState(false);
	// const [displayControls, setDisplayControls] = useState(!isPlaying);

	useEffect(() => {
		if (playerRef.current) {
			attachMedia(playerRef.current);
		}
	}, [attachMedia, playerRef]);

	// useEffect(() => {
	// 	const indicateReadyToPlay = () => setIsLoading(false);
	// 	const currentRef = playerRef.current;

	// 	currentRef?.addEventListener("loadeddata", indicateReadyToPlay);
	// 	return () =>
	// 		currentRef?.removeEventListener("loadeddata", indicateReadyToPlay);
	// }, [playerRef]);

	// useEffect(() => {
	// 	const showControls = () => setDisplayControls(true);
	// 	const currentRef = playerRef.current;

	// 	currentRef?.addEventListener("mousemove", showControls);
	// 	return () => currentRef?.removeEventListener("mousemove", showControls);
	// }, [playerRef]);

	// useEffect(() => {
	// 	const fadeControls = () => setDisplayControls(false);

	// 	if (displayControls && isPlaying) {
	// 		const t = setTimeout(fadeControls, FADE_TIMEOUT);
	// 		return () => clearTimeout(t);
	// 	}
	// }, [displayControls, isPlaying]);

	// const PlayButtonIconComponent = isPlaying ? PauseIcon : PlayIcon;
	// const onTogglePlayingState = () => setIsPlaying((prev) => !prev);

	return (
		<div
			style={{
				backgroundColor: "lightblue",
				position: "relative",
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT,
			}}
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
			<PlayerControls show={true} />
		</div>
	);
};

export default HlsPlayerV2;
