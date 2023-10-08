import Hls from "hls.js";

export const hls = new Hls();

export const enableHlsEventLogging = (hls: Hls) => {
	for (const [key, val] of Object.entries(Hls.Events)) {
		hls.on(val, () => console.log(key));
	}
};
