import { AppBar, Toolbar } from "@mui/material";
import React from "react";
import CookpadLogo from "./CookpadLogo";

const CookpadAppBar = () => {
	return (
		<AppBar position="relative">
			<Toolbar>
				<CookpadLogo />
			</Toolbar>
		</AppBar>
	);
};

export default CookpadAppBar;
