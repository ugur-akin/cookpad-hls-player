import Hls from "hls.js";

export const hlsSupportCheck = (): string =>
	Hls.isSupported() ? "HLS is supported" : "HLS is not supported";

export const secondsToTimeDisplayFormat = (inputSeconds: number): string => {
	const minutes = Math.trunc(inputSeconds / 60);
	const seconds = Math.trunc(inputSeconds % 60);

	const minutesStr = String(minutes).padStart(2, "0");
	const secondsStr = String(seconds).padStart(2, "0");

	const output = `${minutesStr}:${secondsStr}`;
	return output;
};

export const clamp = (val: number, min: number, max: number) => {
	return Math.min(max, Math.max(val, min));
};

export const getTimeRangesIndexContainingTime = (
	time: number,
	range: TimeRanges
): number => {
	let i = 0;
	while (
		i < range.length &&
		!(range.start(i) <= time && time <= range.end(i))
	) {
		i++;
	}

	return i < range.length ? i : NaN;
};
