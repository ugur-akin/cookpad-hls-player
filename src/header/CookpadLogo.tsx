import React from "react";
import logo from "./logo.png";
import { Typography } from "@mui/material";

const CookpadLogo = () => {
	return (
		<>
			<img
				alt="Cookpad logo"
				src={logo}
				width={40}
				style={{ marginRight: 5 }}
			/>
			<Typography variant="h6" color="inherit" noWrap>
				Cookpad
			</Typography>
		</>
	);
};

export default CookpadLogo;
