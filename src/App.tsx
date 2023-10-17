import React from "react";
import { Typography } from "@mui/material";
import CookpadAppBar from "./header/CookpadAppBar";

function App() {
	return (
		<>
			<CookpadAppBar />
			<Typography variant="h1">Hello World!</Typography>
		</>
	);
}

export default App;
