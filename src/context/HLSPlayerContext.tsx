import Hls from "hls.js";
import React, {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useHLSConfigurationContext } from "./HLSConfigurationContext";
import { clamp, getTimeRangesIndexContainingTime } from "../utils";

/**
 * Default HLS Config for reference (subject to change in future releases):
 const config = {
	autoStartLoad: true,
	startPosition: -1,
	debug: false,
	capLevelOnFPSDrop: false,
	capLevelToPlayerSize: false,
	defaultAudioCodec: undefined,
	initialLiveManifestSize: 1,
	maxBufferLength: 30,
	maxMaxBufferLength: 600,
	backBufferLength: Infinity,
	frontBufferFlushThreshold: Infinity,
	maxBufferSize: 60 * 1000 * 1000,
	maxBufferHole: 0.5,
	highBufferWatchdogPeriod: 2,
	nudgeOffset: 0.1,
	nudgeMaxRetry: 3,
	maxFragLookUpTolerance: 0.25,
	liveSyncDurationCount: 3,
	liveMaxLatencyDurationCount: Infinity,
	liveDurationInfinity: false,
	preferManagedMediaSource: false,
	enableWorker: true,
	enableSoftwareAES: true,
	manifestLoadingTimeOut: 10000,
	manifestLoadingMaxRetry: 1,
	manifestLoadingRetryDelay: 1000,
	manifestLoadingMaxRetryTimeout: 64000,
	startLevel: undefined,
	levelLoadingTimeOut: 10000,
	levelLoadingMaxRetry: 4,
	levelLoadingRetryDelay: 1000,
	levelLoadingMaxRetryTimeout: 64000,
	fragLoadingTimeOut: 20000,
	fragLoadingMaxRetry: 6,
	fragLoadingRetryDelay: 1000,
	fragLoadingMaxRetryTimeout: 64000,
	startFragPrefetch: false,
	testBandwidth: true,
	progressive: false,
	lowLatencyMode: true,
	fpsDroppedMonitoringPeriod: 5000,
	fpsDroppedMonitoringThreshold: 0.2,
	appendErrorMaxRetry: 3,
	enableDateRangeMetadataCues: true,
	enableEmsgMetadataCues: true,
	enableID3MetadataCues: true,
	enableWebVTT: true,
	enableIMSC1: true,
	enableCEA708Captions: true,
	stretchShortVideoTrack: false,
	maxAudioFramesDrift: 1,
	forceKeyFrameOnDiscontinuity: true,
	abrEwmaFastLive: 3.0,
	abrEwmaSlowLive: 9.0,
	abrEwmaFastVoD: 3.0,
	abrEwmaSlowVoD: 9.0,
	abrEwmaDefaultEstimate: 500000,
	abrEwmaDefaultEstimateMax: 5000000,
	abrBandWidthFactor: 0.95,
	abrBandWidthUpFactor: 0.7,
	abrMaxWithRealBitrate: false,
	maxStarvationDelay: 4,
	maxLoadingDelay: 4,
	minAutoBitrate: 0,
	emeEnabled: false,
	licenseXhrSetup: undefined,
	drmSystems: {},
	drmSystemOptions: {},
	cmcd: undefined,
};
 */

const hls = new Hls({
	maxBufferHole: 0.1,
	maxBufferSize: 225 * 1000 * 1000, // 225 MB, roughly the size of the cookpad video
	highBufferWatchdogPeriod: 1, // TODO: Experiment
});

const RECENT_INTERACTION_THRESHOLD_SECONDS = 2000;

interface HLSPlayerContext {
	hls: Hls;
	mediaEl?: HTMLVideoElement;
	attachMedia: (el: HTMLVideoElement) => void;
	isPlaying: boolean;
	duration: number;
	currentTime: number;
	bufferedStart: number;
	bufferedEnd: number;
	recentlyInteracted: boolean;
	qualityLevels: [number, string][];
	selectedLevel: number;
	playVideo: () => void;
	pauseVideo: () => void;
	rw10: () => void;
	ff10: () => void;
	seekToPos: (pos: number) => void;
	triggerInteraction: () => void;
	switchLevels: (l: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const HLSPlayerContext = createContext<HLSPlayerContext | null>(null);

export const HLSPlayerContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { source: mediaSource } = useHLSConfigurationContext();
	const [mediaEl, setMediaEl] = useState<HTMLVideoElement>();
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(NaN);
	const [currentTime, setCurrentTime] = useState(0);
	const [bufferedStart, setBufferedStart] = useState(0);
	const [bufferedEnd, setBufferedEnd] = useState(0);
	const [qualityLevels, setQualityLevels] = useState<[number, string][]>([]);
	const [selectedLevel, setSelectedLevel] = useState(-1);

	const [recentlyInteracted, setRecentlyInteracted] = useState(false);
	const [latestInteractionDate, setLatestInteractionDate] = useState(0);

	const triggerInteraction = () => setLatestInteractionDate(Date.now());

	// Effect to update recentlyInteracted flag whenever an interaction is fired.
	useEffect(() => {
		const unsetRecentlyInteracted = () => setRecentlyInteracted(false);

		setRecentlyInteracted(true);
		const t = setTimeout(
			unsetRecentlyInteracted,
			RECENT_INTERACTION_THRESHOLD_SECONDS
		);
		return () => clearTimeout(t);
	}, [latestInteractionDate]);

	const attachMedia = (el: HTMLVideoElement) => setMediaEl(el);

	const playVideo = () => {
		triggerInteraction();
		mediaEl?.play();
	};

	const pauseVideo = () => {
		triggerInteraction();
		mediaEl?.pause();
	};

	const seekToPos = (pos: number) => {
		triggerInteraction();

		if (isNaN(pos) || !mediaEl) {
			return;
		}

		mediaEl.currentTime = clamp(pos, 0, duration);
	};

	const seekToRelativePos = (delta: number) => {
		triggerInteraction();

		if (isNaN(delta) || !mediaEl) {
			return;
		}

		mediaEl.currentTime = clamp(mediaEl.currentTime + delta, 0, duration);
	};

	const ff10 = () => seekToRelativePos(10);
	const rw10 = () => seekToRelativePos(-10);

	const switchLevels = (level: number) => {
		const isValidLevel = Boolean(
			qualityLevels.find(([code, _]) => code === level)
		);
		if (isValidLevel) {
			hls.currentLevel = level;

			// We eagerly update level here too (it's also updated by listening to hls events)
			//	as in some cases hls level won't be changed for a long time (i.e. when paused)
			setSelectedLevel(level);
		}
	};

	const contextValue = {
		hls,
		mediaEl,
		attachMedia,
		isPlaying,
		currentTime,
		duration,
		bufferedStart,
		bufferedEnd,
		recentlyInteracted,
		qualityLevels,
		selectedLevel,
		playVideo,
		pauseVideo,
		ff10,
		rw10,
		seekToPos,
		triggerInteraction,
		switchLevels,
	};

	// Attaches media whenever a new mediaElement is mounted
	useEffect(() => {
		if (mediaEl) {
			hls.attachMedia(mediaEl);
			return () => hls.detachMedia();
		}

		return undefined;
	}, [mediaEl]);

	// Attach media listeners whenever a new mediaElement is mounted
	useEffect(() => {
		const updateReactStateToPlaying = () => setIsPlaying(true);
		const updateReactStateToPaused = () => setIsPlaying(false);
		const updateCurrentTime = () =>
			setCurrentTime((prev) => (mediaEl && mediaEl.currentTime) || prev);
		const updateDuration = () =>
			setDuration((prev) => (mediaEl && mediaEl.duration) || prev);

		const updateBufferTimes = () => {
			if (mediaEl) {
				const range = getTimeRangesIndexContainingTime(
					mediaEl.currentTime,
					mediaEl.buffered
				);

				if (!isNaN(range)) {
					setBufferedStart(mediaEl.buffered.start(range));
					setBufferedEnd(mediaEl.buffered.end(range));
				}
			}
		};

		if (mediaEl) {
			mediaEl.addEventListener("play", updateReactStateToPlaying);
			mediaEl.addEventListener("pause", updateReactStateToPaused);
			mediaEl.addEventListener("timeupdate", updateCurrentTime);
			mediaEl.addEventListener("durationchange", updateDuration);
			mediaEl.addEventListener("progress", updateBufferTimes);

			return () => {
				mediaEl.removeEventListener("play", updateReactStateToPlaying);
				mediaEl.removeEventListener("pause", updateReactStateToPaused);
				mediaEl.removeEventListener("timeupdate", updateCurrentTime);
				mediaEl.removeEventListener("durationchange", updateDuration);
				mediaEl.removeEventListener("progress", updateBufferTimes);
			};
		}
	}, [mediaEl]);

	// Loads HLS media source whenever source is updated
	useEffect(() => {
		const resetPlayer = () => {
			setIsPlaying(false);
			setCurrentTime(0);
			setBufferedStart(0);
			setBufferedEnd(0);
			setQualityLevels([]);
			setSelectedLevel(-1);
			triggerInteraction();
		};

		hls.loadSource(mediaSource.source);
		hls.on(Hls.Events.MANIFEST_LOADED, (_, { levels }) => {
			const auto = [-1, "Auto"] as [number, string];

			const detected = levels
				.map((level, i) => [i, `${level.height}p`] as [number, string])
				.sort(([_a, a], [_b, b]) => {
					const aAsHeight = parseInt(a.substring(0, a.length - 1));
					const bAsHeight = parseInt(b.substring(0, b.length - 1));

					return bAsHeight - aAsHeight;
				});

			setQualityLevels([auto, ...detected]);
			setSelectedLevel(hls.currentLevel);
		});

		hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
			setSelectedLevel(data.level);
		});
		resetPlayer();
	}, [mediaSource]);

	return (
		<HLSPlayerContext.Provider value={contextValue}>
			{children}
		</HLSPlayerContext.Provider>
	);
};

export const useHLSPlayerContext = (): HLSPlayerContext => {
	const hlsContext = useContext(HLSPlayerContext);

	if (!hlsContext) {
		throw new Error(
			"HLS Player context is null. Please ensure the context is accessed within a provider."
		);
	}

	return hlsContext;
};
