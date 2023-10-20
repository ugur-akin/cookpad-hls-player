import { Menu, MenuItem, Stack, StackProps } from "@mui/material";
import React, { MouseEventHandler } from "react";
import ControlButton from "../common/ControlButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";
import QualityLevelIcon from "@mui/icons-material/Tune";
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
	const {
		isPlaying,
		currentTime,
		duration,
		qualityLevels,
		selectedLevel,
		playVideo,
		pauseVideo,
		rw10,
		ff10,
		switchLevels,
	} = useHLSPlayerContext();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const openQualitySelection: MouseEventHandler<HTMLElement> = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const closeQualitySelection = () => setAnchorEl(null);

	const open = Boolean(anchorEl);

	const PlayButtonIcon = isPlaying ? PauseIcon : PlayIcon;
	const onTogglePlayingState = isPlaying ? pauseVideo : playVideo;

	const propsWithOverrides = { ...DEFAULT_STACK_PROPS, ...stackPropsOverrides };
	const sxWithOverrides = { ...DEFAULT_SX, ...sx };

	const qualityMenuItems = qualityLevels.map(([code, label]) => (
		<MenuItem
			key={`${code}:${label}`}
			sx={{ fontSize: 12 }}
			selected={code === selectedLevel}
			onClick={() => {
				switchLevels(code);
				closeQualitySelection();
			}}
		>
			{label}
		</MenuItem>
	));

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
				onClick={openQualitySelection}
			/>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={closeQualitySelection}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{qualityMenuItems}
			</Menu>
		</Stack>
	);
};
