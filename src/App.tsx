import React from "react";
import "./App.css";
import { hls } from "./player/hlsClient";
import HlsPlayer from "./player/hlsPlayer";
import Doc from "./Doc";

function App() {
	return (
		<div className="App">
			<div className="App-header">
				<HlsPlayer hls={hls} />
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Doc />
				</div>
			</div>
		</div>
	);
}

export default App;
