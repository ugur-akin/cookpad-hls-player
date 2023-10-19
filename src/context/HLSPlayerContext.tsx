import Hls from "hls.js";
import React, {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useHLSConfigurationContext } from "./HLSConfigurationContext";

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

interface HLSPlayerContext {
	hls: Hls;
	mediaEl?: HTMLVideoElement;
	attachMedia: (el: HTMLVideoElement) => void;
	isPlaying: boolean;
	playVideo: () => void;
	pauseVideo: () => void;
}

const HLSPlayerContext = createContext<HLSPlayerContext | null>(null);

export const HLSPlayerContextProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const { source: mediaSource } = useHLSConfigurationContext();
	const [mediaEl, setMediaEl] = useState<HTMLVideoElement>();
	const [isPlaying, setIsPlaying] = useState(false);

	const attachMedia = (el: HTMLVideoElement) => setMediaEl(el);

	const playVideo = () => mediaEl?.play();
	const pauseVideo = () => mediaEl?.pause();

	const updateReactStateToPlaying = () => setIsPlaying(true);
	// const updateReactStateToPlaying = () => console.log("play fired");
	const updateReactStateToPaused = () => setIsPlaying(false);
	// const updateReactStateToPaused = () => console.log("pause fired");

	const contextValue = {
		hls,
		mediaEl,
		attachMedia,
		isPlaying,
		playVideo,
		pauseVideo,
	};

	// Attaches media whenever a new mediaElement is mounted
	useEffect(() => {
		if (mediaEl) {
			hls.attachMedia(mediaEl);
			return () => hls.detachMedia();
		}

		return undefined;
	}, [mediaEl]);

	// Attach listeners whenever a new mediaElement is mounted
	useEffect(() => {
		if (mediaEl) {
			mediaEl.addEventListener("play", updateReactStateToPlaying);
			mediaEl.addEventListener("pause", updateReactStateToPaused);

			return () => {
				mediaEl.removeEventListener("play", updateReactStateToPlaying);
				mediaEl.removeEventListener("pause", updateReactStateToPaused);
			};
		}
	}, [mediaEl]);

	// Loads HLS media source whenever source is updated
	useEffect(() => {
		hls.loadSource(mediaSource.source);
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
