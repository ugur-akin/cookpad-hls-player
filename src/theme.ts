import { createTheme } from "@mui/material/styles";
import { blue, grey, orange, red } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		primary: blue,
		secondary: orange,
		error: {
			main: red.A400,
		},
		background: {
			default: grey[50],
		},
	},
});

export default theme;
