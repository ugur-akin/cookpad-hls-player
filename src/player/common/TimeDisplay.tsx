import React from "react";
import { secondsToTimeDisplayFormat } from "../../utils";
import { Box, BoxProps, Typography } from "@mui/material";

const DEFAULT_SX = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	paddingY: 2,
	color: "#fff",
};

export interface TimeDisplayProps extends BoxProps {
	currentTime: number;
	duration: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
	currentTime,
	duration,
	sx,
	...boxProps
}) => {
	const currentTimeStr = secondsToTimeDisplayFormat(currentTime);
	const durationStr = secondsToTimeDisplayFormat(duration);

	const sxWithOverrides = {
		...DEFAULT_SX,
		...sx,
	};

	return (
		<Box component="span" sx={sxWithOverrides} {...boxProps}>
			<Typography
				color="inherit"
				fontWeight={(theme) => theme.typography.fontWeightLight}
				fontSize={14}
			>{`${currentTimeStr} / ${durationStr}`}</Typography>
		</Box>
	);
};

export default TimeDisplay;
