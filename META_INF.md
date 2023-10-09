## Tech

- React/TS
- [HLS.js](https://github.com/video-dev/hls.js) - For HLS support on browsers

## Backlog

### Features

- Media element with HLS content attached ✅
- Pause/Play button ✅
- Buttons to FastForward/Rewind 10 seconds ✅
- A progress bar indicator for play/load/duration:
  - Jump seek support (i.e. click anywhere on the slider to jump to an instant)
  - Slide seek support (i.e. click and drag the slider to jump to an instant)
- Duration/Play time display ✅
- Quality level selection ✅
- Volume control ❌
- Drop low quality frags if higher quality versions fetched ✅ (more details below)
- Fine tuning HLS configuration for:
  - Buffer sizes ([(max)buffer/backBufferLength](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning)). ❌
  - Auto quality switching behaviour (fps drops, bandwith drops, max allowed buffering time) ❌
- Live Stream support (Not tested)
- Media error recovery ❌
- Multi browser testing
  - Chrome ✅
  - Firefox ❌
  - Safari ❌

### Known Issues

- `BUG`: Video player sometimes doesn't sync frame after quality level switch.
  - **Browser**: Chrome
  - **Steps to reproduce**:
    - Load & Play video
    - While the video is playing change quality levels
    - When changing the quality level to a higher one, and loading takes some time, the player
      (sometimes) won't update the frame until the next segment/frag starts playing.

### Questions

#### Regarding Item 4:

> If the player starts with low bandwidth and has cached low resolution segments, when the video is replayed or skipped back, higher resolution versions should replace the cached ones if bandwidth has improved

2 questions:

- If the opposite scenario happens, i.e. video has been playing at a high resolution but bandwith drops and quality level is downgraded, do we want to maintain a backBuffer for the higher quality level? If so, how far back (in time/duration) do we want this buffer - having a longer buffer will allow for longer backwards jumps without buffering or droppig quality, however, it will also increase memory usage (maybe significantly)?
- If the user manually selects a lower quality but we have a higher quality segment already loaded/seekable, do we want to play the high quality segment or segment corresponding to the user selected quality?

#### Styling

Is it important for the player to look like an actual video player? If so let me know and I can add some styling. I prioritized functionality over it as I wasn't sure it was important to you.
