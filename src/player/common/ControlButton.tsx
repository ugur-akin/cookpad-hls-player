import { ButtonBase, ButtonBaseProps, SvgIcon } from "@mui/material";
import React from "react";

const DEFAULT_SX = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	padding: 0,
	width: 45,
	color: "#fff",
};

export interface ControlButtonProps extends ButtonBaseProps {
	IconComponent: typeof SvgIcon;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
	IconComponent,
	sx,
	...buttonBaseProps
}) => {
	const sxWithOverrides = {
		...DEFAULT_SX,
		...sx,
	};

	return (
		<ButtonBase sx={sxWithOverrides} {...buttonBaseProps}>
			<IconComponent color="inherit" fontSize="medium" />
		</ButtonBase>
	);
};

export default ControlButton;
