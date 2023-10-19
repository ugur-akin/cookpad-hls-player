import { Box, BoxProps } from "@mui/material";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { clamp, valOrDefaultIfNaN } from "../../utils";

const SLIDER_HOVER_DELAY = 150;

export interface ProgressSliderProps extends BoxProps {
	loadStart: number;
	loadEnd: number;
	played: number;
	total: number;
}

export const ProgressSlider: React.FC<ProgressSliderProps> = ({
	loadStart,
	loadEnd,
	played,
	total,
}) => {
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
		if (containerRef.current && loadBarRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();
			const loadBarRect = loadBarRef.current.getBoundingClientRect();

			const hoverRight = event.clientX - loadBarRect.left;
			const containerWidth = containerRect.right - containerRect.left;

			const hoverEnd = (total / containerWidth) * hoverRight;
			setHoveringLoadEnd(hoverEnd);
		}
	};

	useEffect(() => {
		const t = setTimeout(() => setHovering(false), SLIDER_HOVER_DELAY);
		return () => clearTimeout(t);
	}, [lastStopHoverTimestamp]);

	const loadBarLeftRatio = clamp((loadStart / total) * 100, 0, 100);

	const loadBarWidthRatio = clamp(
		((loadEnd - loadStart) / total) * 100,
		0,
		100
	);
	const loadBarHoverWidthRatio = ((hoveringLoadEnd - loadStart) / total) * 100;

	const loadBarWidthRatioToUse = hovering
		? clamp(loadBarHoverWidthRatio, loadBarWidthRatio, 100)
		: loadBarWidthRatio;

	const playedWidthRatio = clamp((played / total) * 100, 0, 100);

	const hoveredSx = {
		cursor: "pointer",
		transform: "scaleY(1.5)",
	};

	return (
		<Box
			id="progress-bar-controller"
			ref={containerRef}
			sx={{
				height: 3.5,
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
					transform: "translate(-50%,-50%)",
					width: 15,
					height: 15,
					borderRadius: "50%",
					background: theme.palette.secondary.main,
					...(hovering ? { transform: "scaleX(1.5) translateY(-50%)" } : {}),
				})}
			/>
		</Box>
	);
};
