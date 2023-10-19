import { Box, ButtonBase, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import QualityLevelIcon from "@mui/icons-material/Tune";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const FADE_TIMEOUT = 2000;

const PLAYER_RATIO = 750 / 1920;
const PLAYER_WIDTH = 1920 * PLAYER_RATIO;
const PLAYER_HEIGHT = 1080 * PLAYER_RATIO;

const HlsPlayerV2 = () => {
	const playerRef = useRef<HTMLDivElement>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isPlaying, setIsPlaying] = useState(false);
	const [displayControls, setDisplayControls] = useState(!isPlaying);

	useEffect(() => {
		const indicateReadyToPlay = () => setIsLoading(false);
		const currentRef = playerRef.current;

		currentRef?.addEventListener("loadeddata", indicateReadyToPlay);
		return () =>
			currentRef?.removeEventListener("loadeddata", indicateReadyToPlay);
	}, [playerRef]);

	useEffect(() => {
		const showControls = () => setDisplayControls(true);
		const currentRef = playerRef.current;

		currentRef?.addEventListener("mousemove", showControls);
		return () => currentRef?.removeEventListener("mousemove", showControls);
	}, [playerRef]);

	useEffect(() => {
		const fadeControls = () => setDisplayControls(false);

		if (displayControls && isPlaying) {
			const t = setTimeout(fadeControls, FADE_TIMEOUT);
			return () => clearTimeout(t);
		}
	}, [displayControls, isPlaying]);

	const PlayButtonIconComponent = isPlaying ? PauseIcon : PlayIcon;
	const onTogglePlayingState = () => setIsPlaying((prev) => !prev);

	return (
		<div
			style={{
				backgroundColor: "lightblue",
				position: "relative",
				width: PLAYER_WIDTH,
				height: PLAYER_HEIGHT,
			}}
			ref={playerRef}
		>
			<video width={PLAYER_WIDTH} height={PLAYER_HEIGHT} preload="meta">
				<source src="https://placehold.co/1920x1080.mp4" type="video/mp4" />
			</video>
			<Box
				id="loading-indicator"
				sx={{
					display: "inline-block",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					visibility: isLoading ? "visible" : "hidden",
				}}
			>
				<CircularProgress color="inherit" size={50} />
			</Box>
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
					visibility: displayControls ? "visible" : "hidden",
					display: "flex",
					flexDirection: "column",
					justifyContent: "end",
				}}
			>
				<Box
					id="progress-bar-controller"
					sx={{ height: 5, width: "100%", background: "rgba(0,0,0,0.3)" }}
				/>
				<Box
					id="control-buttons-container"
					sx={{
						height: "40px",
						background: "transparent",
						width: "100%",
						display: "flex",
						flexDirection: "row",
						justifyContents: "start",
						alignItems: "stretch",
					}}
				>
					<ButtonBase
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							width: 45,
							color: "#fff",
						}}
						onClick={onTogglePlayingState}
					>
						<PlayButtonIconComponent color="inherit" fontSize="medium" />
					</ButtonBase>
					<ButtonBase
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							width: 45,
							color: "#fff",
						}}
					>
						<Replay10Icon color="inherit" fontSize="medium" />
					</ButtonBase>
					<ButtonBase
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							width: 45,
							color: "#fff",
						}}
					>
						<Forward10Icon color="inherit" fontSize="medium" />
					</ButtonBase>
					<ButtonBase
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: 45,
							padding: 0,
							color: "#fff",
							marginLeft: "auto",
						}}
					>
						<QualityLevelIcon color="inherit" fontSize="medium" />
					</ButtonBase>
				</Box>
			</Box>
		</div>
	);
};

export default HlsPlayerV2;
