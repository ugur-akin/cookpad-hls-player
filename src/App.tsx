import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import CookpadAppBar from "./header/CookpadAppBar";
import Player from "./player/Player";
import { MediaSourceSelector } from "./config/MediaSourceSelector";

function App() {
	return (
		<>
			<CookpadAppBar />
			<Container maxWidth="lg" sx={{ paddingTop: 10 }}>
				<Paper
					elevation={2}
					sx={{
						width: "100%",
						display: "flex",
						flexDirection: "column",
						padding: 5,
						rowGap: 5,
					}}
				>
					<Typography variant="h3">Cookpad HLS Player</Typography>
					<MediaSourceSelector />

					<Box
						sx={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Player />
					</Box>
				</Paper>
			</Container>
		</>
	);
}

export default App;
