import Hls, { Level } from "hls.js";
import React, {
	MouseEvent,
	MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { MEDIA_SOURCE } from "./config";
import {
	clamp,
	getTimeRangesIndexContainingTime,
	secondsToTimeDisplayFormat,
} from "../utils";

interface HlsPlayerProps {
	hls: Hls;
}

const HlsPlayer = ({ hls }: HlsPlayerProps) => {
	const videoEl = useRef<HTMLVideoElement | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (videoEl.current) {
			// enableHlsEventLogging(hls);

			hls.attachMedia(videoEl.current);
			hls.loadSource(MEDIA_SOURCE);

			hls.on(Hls.Events.MEDIA_ATTACHED, () => {
				setIsReady(true);
			});
		}
	}, [hls]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<video ref={videoEl} width={1000} />
			<VideoControls
				isVideoReady={isReady}
				videoHandle={videoEl.current}
				hls={hls}
			/>
		</div>
	);
};

interface VideoControlsProps {
	isVideoReady: boolean;
	videoHandle: HTMLVideoElement | null;
	hls: Hls;
}

const VideoControls = ({
	isVideoReady,
	videoHandle,
	hls,
}: VideoControlsProps) => {
	return (
		<div>
			{!isVideoReady || !videoHandle ? (
				"Loading"
			) : (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<VideoProgressBar videoHandle={videoHandle} />
					<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
						<VideoRewindSeconds videoHandle={videoHandle} rewindSeconds={10} />
						<VideoPlayButton videoHandle={videoHandle} />
						<VideoFastForwardSeconds
							videoHandle={videoHandle}
							fastForwardSeconds={10}
						/>
						<VideoTimeDisplay videoHandle={videoHandle} />
						<VideoQualitySelect hls={hls} />
					</div>
				</div>
			)}
		</div>
	);
};

interface VideoPlayButtonProps {
	videoHandle: HTMLVideoElement;
}

const VideoPlayButton: React.FC<VideoPlayButtonProps> = ({ videoHandle }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const playButtonText = isPlaying ? "Pause" : "Play";

	const playHandler = () => {
		isPlaying ? videoHandle.pause() : videoHandle.play();
		setIsPlaying((prev) => !prev);
	};

	return <button onClick={playHandler}>{playButtonText}</button>;
};

interface VideoTimeDisplayProps {
	videoHandle: HTMLVideoElement;
}

const VideoTimeDisplay: React.FC<VideoTimeDisplayProps> = ({ videoHandle }) => {
	const [currentTime, setCurrentTime] = useState(videoHandle.currentTime);
	const [duration, setDuration] = useState(videoHandle.duration);

	useEffect(() => {
		videoHandle.addEventListener("timeupdate", () => {
			setCurrentTime(videoHandle.currentTime);
		});

		videoHandle.addEventListener("durationchange", () => {
			setDuration(videoHandle.duration);
		});
	}, []);

	return (
		<div>
			<p>
				<span>{secondsToTimeDisplayFormat(currentTime)}</span>/
				<span>{secondsToTimeDisplayFormat(duration)}</span>
			</p>
		</div>
	);
};

interface VideoRewindSecondsProps {
	videoHandle: HTMLVideoElement;
	rewindSeconds: number;
}

const VideoRewindSeconds: React.FC<VideoRewindSecondsProps> = ({
	videoHandle,
	rewindSeconds,
}) => {
	const onRewind = () => (videoHandle.currentTime -= rewindSeconds);

	return <button onClick={onRewind}>{`< ${rewindSeconds}`}</button>;
};

interface VideoFastForwardSecondsProps {
	videoHandle: HTMLVideoElement;
	fastForwardSeconds: number;
}

const VideoFastForwardSeconds: React.FC<VideoFastForwardSecondsProps> = ({
	videoHandle,
	fastForwardSeconds,
}) => {
	const onFastForward = () => (videoHandle.currentTime += fastForwardSeconds);

	return <button onClick={onFastForward}>{`> ${fastForwardSeconds}`}</button>;
};

interface VideoProgressBarProps {
	videoHandle: HTMLVideoElement;
}

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({ videoHandle }) => {
	const [currentTime, setCurrentTime] = useState(videoHandle.currentTime);
	const [duration, setDuration] = useState(videoHandle.duration);
	const [loadStart, setLoadStart] = useState(0);
	const [loadEnd, setLoadEnd] = useState(0);
	const progresRef = useRef<HTMLDivElement | null>(null);

	const playRatio = (currentTime / duration) * 100;
	const loadStartRatio = (loadStart / duration) * 100;
	const loadEndRatio = (loadEnd / duration) * 100;

	const [sliderRatio, setSliderRatio] = useState(playRatio);
	const [isSliding, setIsSliding] = useState(false);
	const [timeUntilSliderCanUpdate, setTimeUnilSliderCanUpdate] = useState(0);

	const handleProgress = () => {
		const range = getTimeRangesIndexContainingTime(
			videoHandle.currentTime,
			videoHandle.buffered
		);
		if (!isNaN(range)) {
			setLoadStart(videoHandle.buffered.start(range));
			setLoadEnd(videoHandle.buffered.end(range));
		}
	};

	const calculateSliderRatio = useCallback(
		(event: MouseEvent): number => {
			if (progresRef.current) {
				const rect = progresRef.current.getBoundingClientRect();

				const left = event.clientX - rect.left;
				const ratio = clamp((left / rect.width) * 100, 0, 100);
				return ratio;
			}

			return sliderRatio;
		},
		[progresRef, sliderRatio]
	);

	const startSlidingEventHandler: MouseEventHandler = (event) => {
		setIsSliding(true);
	};

	const slideEventHandler: MouseEventHandler = useCallback(
		(event) => {
			if (isSliding) {
				event.preventDefault();

				const ratio = calculateSliderRatio(event);

				setSliderRatio(ratio);
			}
		},
		[isSliding, calculateSliderRatio]
	);

	const stopSlidingEventHandler: MouseEventHandler = useCallback(
		(event) => {
			setTimeUnilSliderCanUpdate(200);
			setIsSliding(false);

			const ratio = calculateSliderRatio(event);
			setSliderRatio(ratio);
		},
		[calculateSliderRatio]
	);

	const attachGlobalEventHandlers = useCallback(() => {
		window.addEventListener(
			"mousemove",
			slideEventHandler as unknown as EventListener
		);
		window.addEventListener(
			"mouseup",
			stopSlidingEventHandler as unknown as EventListener
		);
	}, [stopSlidingEventHandler, slideEventHandler]);

	const removeGlobalEventHandlers = useCallback(() => {
		window.removeEventListener(
			"mousemove",
			slideEventHandler as unknown as EventListener
		);
		window.removeEventListener(
			"mouseup",
			stopSlidingEventHandler as unknown as EventListener
		);
	}, [stopSlidingEventHandler, slideEventHandler]);

	// Reflects video time/load/duration updates to React state so the component
	// can be rerendered with the updated value (necessary for triggering re-renders).
	useEffect(() => {
		videoHandle.addEventListener("timeupdate", () => {
			setCurrentTime(videoHandle.currentTime);
		});

		videoHandle.addEventListener("durationchange", () => {
			setDuration(videoHandle.duration);
		});

		videoHandle.addEventListener("progress", handleProgress);
	}, [videoHandle]);

	// Removes/Attaches sliding event handlers, namely, mousemove and mouseup events, to the global window.
	// Events are attached to window instead of the slider itself to provide greater range of motion.
	useEffect(() => {
		if (isSliding) {
			attachGlobalEventHandlers();
		} else {
			removeGlobalEventHandlers();
		}

		return () => removeGlobalEventHandlers();
	}, [isSliding, attachGlobalEventHandlers, removeGlobalEventHandlers]);

	// Sync video time to slider-indicated time when sliding stops. We only want to run this
	// isSliding is toggled so we are excluding other dependencies.
	useEffect(() => {
		if (!isSliding) {
			const playTime = (sliderRatio / 100) * duration;

			if (!isNaN(playTime)) {
				videoHandle.currentTime = playTime;
			}
		}
	}, [isSliding]);

	// Syncs slider back to play time. There is a delay added in order
	// not to create a race condition after a slide event:
	// i.e Does the slider slide back to play time or play time catch up to slide time first?
	// The latter is preferred so we add a short delay before we allow play time updates to reflect on the slider
	useEffect(() => {
		if (!isSliding && timeUntilSliderCanUpdate === 0) {
			setSliderRatio(playRatio);
		}
	}, [isSliding, playRatio, timeUntilSliderCanUpdate]);

	// Sets a timeout for added delay before syncing the slider back to the play ratio.
	// This is to smooth out slider updates shortly after a slide event (i.e. few frames/miliseconds).
	useEffect(() => {
		if (timeUntilSliderCanUpdate > 0) {
			const t = setTimeout(
				() => setTimeUnilSliderCanUpdate(0),
				timeUntilSliderCanUpdate
			);
			return () => clearTimeout(t);
		}
	});

	return (
		<div
			ref={progresRef}
			style={{
				display: "block",
				marginTop: "30px",
				width: "100%",
				height: "5px",
				backgroundColor: "black",
				position: "relative",
			}}
			onMouseDown={startSlidingEventHandler}
		>
			<div
				style={{
					display: "block",
					width: `${loadStartRatio}%`,
					height: "5px",
					backgroundColor: "black",
					position: "absolute",
				}}
			></div>
			<div
				style={{
					display: "block",
					width: `${loadEndRatio}%`,
					height: "5px",
					backgroundColor: "rgb(150,150,150)",
					position: "absolute",
				}}
			></div>

			<div
				style={{
					display: "block",
					width: `${playRatio}%`,
					height: "5px",
					backgroundColor: "white",
					position: "absolute",
				}}
			></div>
			<div
				style={{
					position: "absolute",
					backgroundColor: "white",
					borderRadius: "50%",
					height: "15px",
					width: "15px",
					left: `calc(${sliderRatio}% - 5px)`,
					top: `-5px`,
				}}
			></div>
		</div>
	);
};

interface VideoQualitySelectProps {
	hls: Hls;
}

const VideoQualitySelect: React.FC<VideoQualitySelectProps> = ({ hls }) => {
	const [quality, setQuality] = useState(hls.currentLevel);
	const [levels, setLevels] = useState<string[]>([]);

	useEffect(() => {
		hls.on(Hls.Events.LEVELS_UPDATED, (event, data) =>
			setLevels(data.levels.map((level) => `${level.height}p`))
		);

		hls.on(Hls.Events.MANIFEST_PARSED, (event, data) =>
			setLevels(data.levels.map((level) => `${level.height}p`))
		);
	}, [hls]);

	useEffect(() => {
		hls.currentLevel = quality;
	}, [quality, hls]);

	return (
		<select
			defaultValue={quality}
			onChange={(e) => setQuality(parseInt(e.target.value))}
		>
			<option value={-1}>Auto</option>
			{hls.levels.map((level, i) => (
				<option key={level.name} value={i}>{`${level.height}p`}</option>
			))}
		</select>
	);
};

export default HlsPlayer;
