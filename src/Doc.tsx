import React from "react";

const Doc = () => {
	return (
		<div style={{ width: 1000, textAlign: "left" }}>
			<h2 id="tech">Tech</h2>
			<ul>
				<li>React/TS</li>
				<li>
					<a href="https://github.com/video-dev/hls.js">HLS.js</a> - For HLS
					support on browsers
				</li>
			</ul>
			<h2 id="backlog">Backlog</h2>
			<h3 id="features">Features</h3>
			<ul>
				<li>Media element with HLS content attached ✅</li>
				<li>Pause/Play button ✅</li>
				<li>Buttons to FastForward/Rewind 10 seconds ✅</li>
				<li>
					A progress bar indicator for play/load/duration:
					<ul>
						<li>
							Jump seek support (i.e. click anywhere on the slider to jump to an
							instant)
						</li>
						<li>
							Slide seek support (i.e. click and drag the slider to jump to an
							instant)
						</li>
					</ul>
				</li>
				<li>Duration/Play time display ✅</li>
				<li>Quality level selection ✅</li>
				<li>Volume control ❌</li>
				<li>
					Drop low quality frags if higher quality versions fetched ✅ (more
					details below)
				</li>
				<li>
					Fine tuning HLS configuration for:
					<ul>
						<li>
							Buffer sizes (
							<a href="https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning">
								(max)buffer/backBufferLength
							</a>
							). ❌
						</li>
						<li>
							Auto quality switching behaviour (fps drops, bandwith drops, max
							allowed buffering time) ❌
						</li>
					</ul>
				</li>
				<li>Live Stream support (Not tested)</li>
				<li>Media error recovery ❌</li>
				<li>
					Multi browser testing
					<ul>
						<li>Chrome ✅</li>
						<li>Firefox ❌</li>
						<li>Safari ❌</li>
					</ul>
				</li>
			</ul>
			<h3 id="known-issues">Known Issues</h3>
			<ul>
				<li>
					<b>BUG</b>: Video player sometimes doesn&#39;t sync frame after
					quality level switch.
					<ul>
						<li>
							<strong>Browser</strong>: Chrome
						</li>
						<li>
							<strong>Steps to reproduce</strong>:
							<ul>
								<li>Load &amp; Play video</li>
								<li>While the video is playing change quality levels</li>
								<li>
									When changing the quality level to a higher one, and loading
									takes some time, the player (sometimes) won&#39;t update the
									frame until the next segment/frag starts playing.
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
			<h3 id="questions">Questions</h3>
			<h4 id="regarding-item-4-">Regarding Item 4:</h4>
			<blockquote>
				<p>
					If the player starts with low bandwidth and has cached low resolution
					segments, when the video is replayed or skipped back, higher
					resolution versions should replace the cached ones if bandwidth has
					improved
				</p>
			</blockquote>
			<p>2 questions:</p>
			<ul>
				<li>
					If the opposite scenario happens, i.e. video has been playing at a
					high resolution but bandwith drops and quality level is downgraded, do
					we want to maintain a backBuffer for the higher quality level? If so,
					how far back (in time/duration) do we want this buffer - having a
					longer buffer will allow for longer backwards jumps without buffering
					or droppig quality, however, it will also increase memory usage (maybe
					significantly)?
				</li>
				<li>
					If the user manually selects a lower quality but we have a higher
					quality segment already loaded/seekable, do we want to play the high
					quality segment or segment corresponding to the user selected quality?
				</li>
			</ul>
			<h4 id="styling">Styling</h4>
			<p>
				Is it important for the player to look like an actual video player? If
				so let me know and I can add some styling. I prioritized functionality
				over it as I wasn&#39;t sure it was important to you.
			</p>
		</div>
	);
};

export default Doc;
