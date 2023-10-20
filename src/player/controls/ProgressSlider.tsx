import { Box } from "@mui/material";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { clamp, valOrDefaultIfNaN } from "../../utils";
import { useHLSPlayerContext } from "../../context/HLSPlayerContext";

const SLIDER_STOP_HOVER_DELAY = 150;

export const ProgressSlider: React.FC = () => {
	const { currentTime, duration, bufferedStart, bufferedEnd, seekToPos } =
		useHLSPlayerContext();

	const containerRef = useRef<HTMLDivElement | null>(null);
	const loadBarRef = useRef<HTMLDivElement | null>(null);

	const [isDragging, setIsDragging] = useState(false);
	const [dragEnd, setDragEnd] = useState(NaN);
	const [isSliderSyncing, setIsSliderSyncing] = useState(true);

	const [isHovering, setHovering] = useState(false);
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

	// Effect to add a delay before "un-hover"ing progress bar (de-scales back to original size)
	useEffect(() => {
		const t = setTimeout(() => setHovering(false), SLIDER_STOP_HOVER_DELAY);
		return () => clearTimeout(t);
	}, [lastStopHoverTimestamp]);

	const startDragging: MouseEventHandler = (event) => {
		event.preventDefault();
		setIsDragging(true);
		setIsSliderSyncing(false);

		if (containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect();

			const dragRight = event.clientX - containerRect.left;
			const containerWidth = containerRect.right - containerRect.left;

			const dragEnd = (duration / containerWidth) * dragRight;
			setDragEnd(dragEnd);
		}
	};

	// Effect to attach listeners to window while dragging:
	//	Listening to mouse move all over the page provides smoother dragging experience
	useEffect(() => {
		const onMouseMoveWhileDragging = (event: MouseEvent) => {
			if (isDragging && containerRef.current) {
				const containerRect = containerRef.current.getBoundingClientRect();

				const dragRight = event.clientX - containerRect.left;
				const containerWidth = containerRect.right - containerRect.left;

				const dragEnd = (duration / containerWidth) * dragRight;
				setDragEnd(dragEnd);
			}
		};

		const stopDragging = () => {
			seekToPos(dragEnd);
			setIsDragging(false);
		};

		if (isDragging) {
			window.addEventListener("mousemove", onMouseMoveWhileDragging);
			window.addEventListener("mouseup", stopDragging);

			return () => {
				window.removeEventListener("mousemove", onMouseMoveWhileDragging);
				window.removeEventListener("mouseup", stopDragging);
			};
		}
	}, [isDragging, containerRef, dragEnd, duration, seekToPos]);

	// Effect to end dragging and start syncing progress to playtime
	useEffect(() => {
		if (!isDragging && !isSliderSyncing) {
			setIsSliderSyncing(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTime]);

	// -- Width/left ratios --

	const loadBarLeftRatio = clamp((bufferedStart / duration) * 100, 0, 100);

	const loadBarWidthRatio = clamp(
		((bufferedEnd - bufferedStart) / duration) * 100,
		0,
		100
	);

	const loadBarHoverWidthRatio =
		((hoveringLoadEnd - bufferedStart) / duration) * 100;

	const loadBarWidthRatioToUse = isHovering
		? clamp(loadBarHoverWidthRatio, loadBarWidthRatio, 100)
		: loadBarWidthRatio;

	const playedWidthRatio = clamp((currentTime / duration) * 100, 0, 100);
	const dragWidthRatio = clamp((dragEnd / duration) * 100, 0, 100);
	const playedWidthRatioToUse = isSliderSyncing
		? playedWidthRatio
		: dragWidthRatio;

	const isActive = isHovering || isDragging;

	return (
		<Box
			id="progress-bar-controller"
			ref={containerRef}
			sx={{
				height: 3,
				width: "100%",
				background: "rgba(230,230,230,0.5)",
				position: "relative",
				transform: isActive ? "scaleY(1.75)" : "none",
				cursor: "pointer",
				"*": {
					cursor: "pointer",
				},
			}}
			onMouseEnter={onHover}
			onMouseLeave={onStopHover}
			onMouseMove={onMouseMoveWhileHovering}
			onMouseDown={startDragging}
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
					width: `${valOrDefaultIfNaN(playedWidthRatioToUse)}%`,
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
					top: 0,
					left: `${valOrDefaultIfNaN(playedWidthRatioToUse)}%`,
					width: 8,
					height: 8,
					borderRadius: "50%",
					background: theme.palette.secondary.main,
					visibility: isActive ? "visible" : "hidden",
					transform:
						"scaleX(1.75) translate(-50%, -50%) translate(1.5px, 1.5px)",
				})}
			/>
		</Box>
	);
};
