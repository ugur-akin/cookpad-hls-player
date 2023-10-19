import { Box, BoxProps } from "@mui/material";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { clamp, valOrDefaultIfNaN } from "../../utils";
import { useHLSPlayerContext } from "../../context/HLSPlayerContext";

const SLIDER_HOVER_DELAY = 150;

export const ProgressSlider: React.FC = () => {
	const { currentTime, duration, bufferedStart, bufferedEnd } =
		useHLSPlayerContext();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const loadBarRef = useRef<HTMLDivElement | null>(null);

	const [hovering, setHovering] = useState(false);
	const [lastStopHoverTimestamp, setLastStopHoverTimestamp] = useState(
		Date.now()
	);
	const [hoveringLoadEnd, setHoveringLoadEnd] = useState(NaN);

	const onHover = () => {
		setHovering(true);
	};
	const onStopHover = () => setLastStopHoverTimestamp(Date.now());
	const onMouseMoveWhileHovering: MouseEventHandler = (event) => {
		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();

			const hoverRight = event.clientX - containerRect.left;
			const containerWidth = containerRect.right - containerRect.left;

			const hoverEnd = (duration / containerWidth) * hoverRight;
			setHoveringLoadEnd(hoverEnd);
		}
	};

	useEffect(() => {
		const t = setTimeout(() => setHovering(false), SLIDER_HOVER_DELAY);
		return () => clearTimeout(t);
	}, [lastStopHoverTimestamp]);

	const loadBarLeftRatio = clamp((bufferedStart / duration) * 100, 0, 100);

	const loadBarWidthRatio = clamp(
		((bufferedEnd - bufferedStart) / duration) * 100,
		0,
		100
	);
	const loadBarHoverWidthRatio =
		((hoveringLoadEnd - bufferedStart) / duration) * 100;

	const loadBarWidthRatioToUse = hovering
		? clamp(loadBarHoverWidthRatio, loadBarWidthRatio, 100)
		: loadBarWidthRatio;

	const playedWidthRatio = clamp((currentTime / duration) * 100, 0, 100);

	const hoveredSx = {
		cursor: "pointer",
		transform: "scaleY(1.75)",
	};

	return (
		<Box
			id="progress-bar-controller"
			ref={containerRef}
			sx={{
				height: 3,
				width: "100%",
				background: "rgba(230,230,230,0.5)",
				position: "relative",
				...(hovering ? { ...hoveredSx } : {}),
			}}
			onMouseEnter={onHover}
			onMouseLeave={onStopHover}
			onMouseMove={onMouseMoveWhileHovering}
		>
			<Box
				id="progress-bar-loaded"
				ref={loadBarRef}
				sx={{
					height: "100%",
					width: `${valOrDefaultIfNaN(loadBarWidthRatioToUse)}%`,
					background: "rgba(230,230,230,0.75)",
					position: "absolute",
					left: `${valOrDefaultIfNaN(loadBarLeftRatio)}%`,
					top: 0,
				}}
			/>
			<Box
				id="progress-bar-played"
				sx={(theme) => ({
					height: "100%",
					width: `${valOrDefaultIfNaN(playedWidthRatio)}%`,
					background: theme.palette.secondary.main,
					position: "absolute",
					left: 0,
					top: 0,
				})}
			/>
			<Box
				id="progress-bar-slider"
				sx={(theme) => ({
					position: "absolute",
					left: `${valOrDefaultIfNaN(playedWidthRatio)}%`,
					top: 0,
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: theme.palette.secondary.main,
					visibility: hovering ? "visible" : "hidden",
					transform:
						"scaleX(1.75) translate(-50%, -50%) translate(1.5px, 1.5px)",
				})}
			/>
		</Box>
	);
};
