export interface HLSMediaSource {
	source: string;
	label?: string;
}

const COOKPAD_SRC =
	"https://d3ukqbhrqb4xnt.cloudfront.net/share_videos/6e95f9a732a74664a4982adf4b808500/e8ffab99-e494-495d-8b21-787e95f9672d/211115200114.m3u8";
const HLS_DEMO_SRC = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

const KNOWN_SOURCE_NAMES = ["COOKPAD_DEMO", "HLS_JS_DEMO"] as const;
export type KnownMediaSource = (typeof KNOWN_SOURCE_NAMES)[number];

export const KNOWN_SOURCES: ReadonlyMap<KnownMediaSource, HLSMediaSource> =
	new Map([
		[
			"COOKPAD_DEMO",
			{
				label: "Cookpad Demo Video",
				source: COOKPAD_SRC,
			},
		],
		[
			"HLS_JS_DEMO",
			{
				label: "hls.js Demo Video",
				source: HLS_DEMO_SRC,
			},
		],
	]);
