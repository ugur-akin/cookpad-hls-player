import React from "react";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import { HLSConfigurationContextProvider } from "./context/HLSConfigurationContext";
import { HLSPlayerContextProvider } from "./context/HLSPlayerContext";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
	<HLSConfigurationContextProvider>
		<HLSPlayerContextProvider>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<App />
			</ThemeProvider>
		</HLSPlayerContextProvider>
	</HLSConfigurationContextProvider>
);
