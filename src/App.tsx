import React from "react";
import "./App.css";
import { hls } from "./player/hlsClient";
import HlsPlayer from "./player/hlsPlayer";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<HlsPlayer hls={hls} />
			</header>
		</div>
	);
}

export default App;
