import { Box, BoxProps, Stack, StackProps } from "@mui/material";
import React from "react";
import ControlButton from "../common/ControlButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import QualityLevelIcon from "@mui/icons-material/Tune";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useHLSPlayerContext } from "../../context/HLSPlayerContext";
import TimeDisplay from "./TimeDisplay";

const DEFAULT_STACK_PROPS: Partial<StackProps> = {
	id: "control-buttons-container",
	direction: "row",
	alignItems: "stretch",
};

const DEFAULT_SX: StackProps["sx"] = {
	height: 40,
};

export interface ControlButtonsProps extends StackProps {}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
	sx,
	...stackPropsOverrides
}) => {
	// TODO: Use interaction hooks to implement functionality

	const {
		isPlaying,
		currentTime,
		duration,
		playVideo,
		pauseVideo,
		rw10,
		ff10,
	} = useHLSPlayerContext();

	const PlayButtonIcon = isPlaying ? PauseIcon : PlayIcon;
	const onTogglePlayingState = isPlaying ? pauseVideo : playVideo;

	const propsWithOverrides = { ...DEFAULT_STACK_PROPS, ...stackPropsOverrides };
	const sxWithOverrides = { ...DEFAULT_SX, ...sx };

	return (
		<Stack sx={sxWithOverrides} {...propsWithOverrides}>
			<ControlButton
				IconComponent={PlayButtonIcon}
				onClick={onTogglePlayingState}
			/>
			<ControlButton IconComponent={Replay10Icon} onClick={rw10} />
			<ControlButton IconComponent={Forward10Icon} onClick={ff10} />
			<TimeDisplay currentTime={currentTime} duration={duration} />
			<ControlButton
				sx={{
					marginLeft: "auto",
				}}
				IconComponent={QualityLevelIcon}
			/>
		</Stack>
	);
};
